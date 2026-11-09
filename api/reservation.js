// POST /api/reservation — réservation d'un plateau avec devis Pennylane (version autonome du site).
// Décision de Maxime (nov. 2026) : le site parle directement à Pennylane, sans attendre le CRM.
//
// Étapes : contrôles (origine, pot de miel, taille, fréquence) → validation → prix recalculé ici
// (grille serveur, jamais le prix du navigateur) → disponibilité (lecture st_all_busy) → Pennylane :
// client retrouvé ou créé, devis créé (validité = fin de l'option 48 h) → demande enregistrée dans la base
// par la RPC publique st_create_brand_request (comme /pro/, référence du devis dans le message) →
// envoi du devis par e-mail Pennylane → récapitulatif Resend au client et à contact@hivingfood.fr.
//
// Sans PENNYLANE_API_KEY (et sans PENNYLANE_DRY_RUN) : réponse 501 { fallback: true } sans rien faire,
// la page reprend alors l'ancien circuit (/api/contact ou st_create_brand_request).
// PENNYLANE_DRY_RUN=1 : rien n'est créé (ni Pennylane ni base), tout est journalisé, e-mails marqués [TEST].
// Documentation : docs/reservation-pennylane.md, section « Version autonome site ».

const crypto = require('crypto');
const { SITE, controlesDeBase, lireCorps, EMAIL_RE, texte, ligne, envoyerEmail, adresseContact } = require('./_mail');
const S = require('./_studio');
const base = require('./_base');
const PL = require('./_pennylane');

const TAILLE_MAX = 20000;            // octets de JSON
const PAR_IP_HEURE = 5;              // demandes par adresse IP et par heure (mémoire de l'instance)
const frequence = new Map();         // ip -> [instants]
const dejaVu = new Map();            // idempotency_key -> { t, reponse } (24 h, mémoire de l'instance)

const REGLE = 'Votre date est bloquée 48 h. Elle est confirmée à réception du paiement. Sans paiement, pas de prestation.';

function tropFrequent(ip, maintenant = Date.now()) {
  const l = (frequence.get(ip) || []).filter(t => maintenant - t < 3600e3);
  l.push(maintenant);
  frequence.set(ip, l);
  return l.length > PAR_IP_HEURE;
}

function ipDe(req) {
  const h = (req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || '';
  return String(h).split(',')[0].trim() || 'inconnue';
}

// Validation complète : renvoie { erreur } ou { d } (données propres)
function valider(b) {
  const studio = ligne(b.studio_id, 20);
  if (!S.PLATEAUX[studio]) return { erreur: 'Champ manquant : plateau.' };
  const debut = ligne(b.start_date, 10);
  if (!S.dateValide(debut)) return { erreur: 'Champ manquant : date de début.' };
  if (debut < S.aujourdhuiParis()) return { erreur: 'Cette date est passée.' };
  const jours = Number(b.days);
  if (!Number.isInteger(jours) || jours < 1 || jours > S.JOURS_MAX) return { erreur: `Nombre de jours : de 1 à ${S.JOURS_MAX}.` };

  if (b.options != null && !Array.isArray(b.options)) return { erreur: 'Options invalides.' };
  const brutes = (b.options || []);
  if (brutes.length > 30) return { erreur: 'Trop d\'options.' };
  const vues = new Set();
  const options = [];
  for (const o of brutes) {
    if (!o || typeof o !== 'object') return { erreur: 'Options invalides.' };
    const catalog = o.catalog === 'site' ? 'site' : (o.catalog === 'st_options' || o.catalog == null ? 'st_options' : null);
    const id = ligne(o.id, 64);
    if (!catalog || !id) return { erreur: 'Options invalides.' };
    const qty = catalog === 'site' ? Number(o.qty) : 1;
    if (!Number.isInteger(qty) || qty < 1 || qty > S.QTE_MAX) return { erreur: `Quantité invalide : ${id}.` };
    const cle = catalog + ':' + id;
    if (vues.has(cle)) continue;
    vues.add(cle);
    options.push({ catalog, id, qty });
  }

  const c = b.customer && typeof b.customer === 'object' ? b.customer : {};
  const adr = c.billing_address && typeof c.billing_address === 'object' ? c.billing_address : {};
  const client = {
    company: ligne(c.company, 200), contact_name: ligne(c.contact_name, 200), email: ligne(c.email, 254).toLowerCase(),
    address: ligne(adr.line1, 200), zip: ligne(adr.zip, 12), city: ligne(adr.city, 120),
    siren: null,
  };
  if (!client.company) return { erreur: 'Champ manquant : société.' };
  if (!client.contact_name) return { erreur: 'Champ manquant : nom.' };
  if (!EMAIL_RE.test(client.email)) return { erreur: 'Adresse e-mail invalide.' };
  if (!client.address) return { erreur: 'Champ manquant : adresse de facturation.' };
  if (!client.zip) return { erreur: 'Champ manquant : code postal.' };
  if (!client.city) return { erreur: 'Champ manquant : ville.' };
  const siren = String(c.siren || '').replace(/[\s.\-]/g, '');
  if (siren) {
    if (!/^\d{9}$|^\d{14}$/.test(siren)) return { erreur: 'SIREN invalide : 9 chiffres (ou 14 pour un SIRET).' };
    client.siren = siren.slice(0, 9);
  }
  if (b.accept_conditions !== true) return { erreur: 'Merci de confirmer avoir lu les conditions de réservation.' };

  const totalNavigateur = b.client_total_ht == null ? null : Number(b.client_total_ht);
  if (totalNavigateur != null && !Number.isFinite(totalNavigateur)) return { erreur: 'Total invalide.' };

  return {
    d: {
      studio, debut, jours, options, client, totalNavigateur,
      message: texte(b.message, 2000),
      source: ligne(b.source, 60) || 'hivingstudio.fr',
      cle: ligne(b.idempotency_key, 64),
    },
  };
}

function corpsDevis({ d, calc, fin, ref, clientId }) {
  const plateau = S.PLATEAUX[d.studio];
  return {
    customer_id: clientId,
    date: S.aujourdhuiParis(),
    deadline: S.aujourdhuiParis(fin.getTime()),
    currency: 'EUR',
    language: 'fr_FR',
    external_reference: ref,
    pdf_invoice_subject: `Location Hiving Studio · ${plateau.nom} · ${S.libellePeriode(d.debut, d.jours)}`,
    pdf_invoice_free_text: `Option valable jusqu'au ${S.libelleInstant(fin)}. ${REGLE}`,
    invoice_lines: calc.lignes.map(l => ({
      label: l.libelle, quantity: l.quantite, unit: l.unite,
      raw_currency_unit_price: S.montant(l.prixHt), vat_rate: 'FR_200',
    })),
  };
}

function recapitulatif({ d, calc, fin, numero }) {
  const plateau = S.PLATEAUX[d.studio];
  return [
    `Plateau : ${plateau.nom}, ${S.libellePeriode(d.debut, d.jours)} (${d.jours} jour${d.jours > 1 ? 's' : ''}, ${S.OUVERTURE} h-${S.FERMETURE} h)`,
    ...calc.lignes.map(l => `- ${l.libelle} : ${l.quantite} × ${S.euros(l.prixHt)} HT = ${S.euros(l.prixHt * l.quantite)} HT`),
    `Total : ${S.euros(calc.totalHt)} HT, TVA 20 % ${S.euros(calc.totalTva)}, soit ${S.euros(calc.totalTtc)} TTC`,
    `Devis Pennylane : ${numero || 'en préparation'}`,
    `Date bloquée jusqu'au : ${S.libelleInstant(fin)}`,
  ];
}

module.exports = async (req, res) => {
  if (controlesDeBase(req, res)) return;

  if (!PL.estActif()) {
    return res.status(501).json({ ok: false, fallback: true, error: 'Réservation directe non activée.' });
  }

  const b = await lireCorps(req);
  let taille = 0;
  try { taille = JSON.stringify(b).length; } catch { taille = Infinity; }
  if (taille > TAILLE_MAX) return res.status(413).json({ error: 'Demande trop volumineuse.' });

  // pot de miel : réponse factice, rien n'est créé
  if (texte(b.website, 200)) return res.status(200).json({ ok: true, quoteNumber: null, holdUntil: null });

  if (tropFrequent(ipDe(req))) return res.status(429).json({ error: 'Trop de demandes, réessayez dans quelques minutes.' });

  const v = valider(b);
  if (v.erreur) return res.status(400).json({ error: v.erreur });
  const d = v.d;

  // double clic / réseau lent : même clé = même réponse
  if (d.cle && dejaVu.has(d.cle) && Date.now() - dejaVu.get(d.cle).t < 24 * 3600e3) {
    return res.status(200).json(dejaVu.get(d.cle).reponse);
  }

  const fin = S.finOption(d.debut);
  if (!fin) return res.status(422).json({ error: 'Pour un tournage aussi proche, écrivez-nous à ' + adresseContact() + '.' });

  // prix : uniquement la grille serveur
  let stOptions = null;
  if (d.options.some(o => o.catalog === 'st_options')) {
    try { stOptions = await base.optionsCatalogue(); }
    catch (e) { console.error('[reservation] catalogue illisible', e.message); return res.status(503).json({ error: 'Réservation en ligne momentanément indisponible.' }); }
  }
  const calc = S.calculer({ plateauId: d.studio, debut: d.debut, jours: d.jours, options: d.options }, stOptions);
  if (calc.erreur) return res.status(422).json({ error: calc.erreur });
  if (d.totalNavigateur != null && Math.abs(d.totalNavigateur - calc.totalHt) > 1) {
    return res.status(422).json({ error: `Le prix a changé : nouveau total ${S.euros(calc.totalHt)} HT. Merci de vérifier.`, totalHt: calc.totalHt });
  }

  // disponibilité (lecture seule)
  const t0 = S.parisVersUtc(d.debut, S.OUVERTURE).toISOString();
  const t1 = S.parisVersUtc(S.plusJoursIso(d.debut, d.jours - 1), S.FERMETURE).toISOString();
  try {
    const pris = (await base.occupes(t0, t1)).some(x => x.studio_id === d.studio && x.starts_at < t1 && x.ends_at > t0);
    if (pris) return res.status(409).json({ error: 'SLOT_TAKEN', message: 'Cette date vient d\'être prise sur ce plateau.' });
  } catch (e) {
    console.error('[reservation] disponibilité illisible', e.message);
    return res.status(503).json({ error: 'Réservation en ligne momentanément indisponible.' });
  }

  const dry = PL.estDryRun();
  const ref = S.referenceReservation(fin, crypto.randomBytes(3).toString('hex'));
  const plateau = S.PLATEAUX[d.studio];

  // Pennylane : client puis devis. Une panne Pennylane ne bloque pas la réservation (alerte équipe).
  let devis = null, erreurPennylane = null;
  try {
    const cl = await PL.trouverOuCreerClient(d.client);
    devis = await PL.creerDevis(corpsDevis({ d, calc, fin, ref, clientId: cl.id }));
  } catch (e) {
    erreurPennylane = e.message;
    console.error('[reservation] Pennylane', e.statut, e.message);
  }
  const numero = devis ? PL.numeroDevis(devis) : null;

  // Enregistrement dans la base (RPC publique existante, comme /pro/) : la date est bloquée.
  const notes = [
    d.message,
    `[Pennylane] Devis ${numero || 'non créé (' + (erreurPennylane || '?') + ')'}${devis && devis.id ? ' · id ' + devis.id : ''} · réf. ${ref}`,
    `Option jusqu'au ${S.libelleInstant(fin)} · total ${S.euros(calc.totalHt)} HT · source ${d.source}`,
    ...calc.lignes.filter(l => l.code.startsWith('site-')).map(l => `Option site : ${l.libelle} × ${l.quantite} (${S.euros(l.prixHt * l.quantite)} HT)`),
  ].filter(Boolean).join('\n');
  const demande = {
    studio_id: d.studio, date: d.debut, days: d.jours, needs: notes,
    company: d.client.company, contact_name: d.client.contact_name, email: d.client.email,
    billing_address: d.client.address, billing_zip: d.client.zip, billing_city: d.client.city, siret: d.client.siren,
    // seules les options du catalogue st_options sont connues de la base (format de /pro/)
    options: (stOptions || []).filter(o => d.options.some(x => x.catalog === 'st_options' && String(x.id) === String(o.id)))
      .map(o => ({ id: o.id, label: o.label, price: Number(o.price), unit: o.unit })),
  };
  let enregistree = null;
  if (dry) {
    console.log('[reservation DRY_RUN] st_create_brand_request', JSON.stringify(demande));
  } else {
    try { enregistree = await base.creerDemande(demande); }
    catch (e) {
      if (devis && devis.id) await PL.statutDevis(devis.id, 'denied').catch(x => console.error('[reservation] devis non annulé', x.message));
      if (e.statut === 409) return res.status(409).json({ error: 'SLOT_TAKEN', message: 'Cette date vient d\'être prise sur ce plateau.' });
      console.error('[reservation] base', e.statut, e.message);
      return res.status(503).json({ error: 'Réservation en ligne momentanément indisponible.' });
    }
  }

  // envoi du devis par Pennylane (le PDF peut mettre quelques instants à être prêt)
  let envoi = { ok: false };
  if (devis && devis.id) envoi = await PL.envoyerDevis(devis.id);

  // e-mails Resend
  const test = dry ? '[TEST] ' : '';
  const lignesRecap = recapitulatif({ d, calc, fin, numero });
  await envoyerEmail({
    to: [d.client.email],
    sujet: `${test}Votre date est bloquée 48 h · ${plateau.nom}, ${S.libellePeriode(d.debut, d.jours)}`,
    corps: [
      `Bonjour ${d.client.contact_name},`, '',
      'Merci pour votre réservation chez Hiving Studio.', '',
      ...lignesRecap, '',
      REGLE,
      envoi.ok
        ? 'Votre devis Pennylane vient de partir dans un e-mail séparé : signez-le en ligne, puis réglez la facture qui suit.'
        : 'Votre devis Pennylane vous arrive dans un e-mail séparé : signez-le en ligne, puis réglez la facture qui suit.',
      '', `Adresse : 4 rue Mozart, 92110 Clichy. Une question : ${adresseContact()}.`, '', 'L\'équipe Hiving Studio',
    ].join('\n'),
    replyTo: adresseContact(),
    cle: d.cle ? 'res-client-' + d.cle : undefined,
  });
  await envoyerEmail({
    sujet: `${test}Réservation ${plateau.nom} ${S.libellePeriode(d.debut, d.jours)} : ${d.client.company}`,
    corps: [
      `Nouvelle réservation depuis ${SITE.domaine} (${d.source})`, '',
      ...lignesRecap, '',
      `Société : ${d.client.company}${d.client.siren ? ' (SIREN ' + d.client.siren + ')' : ''}`,
      `Contact : ${d.client.contact_name} <${d.client.email}>`,
      `Adresse : ${d.client.address}, ${d.client.zip} ${d.client.city}`,
      d.message ? `Message : ${d.message}` : '',
      `Demande en base : ${enregistree && enregistree.id ? enregistree.id : (dry ? 'non créée (DRY_RUN)' : '?')}`,
      erreurPennylane ? `À FAIRE : devis Pennylane non créé (${erreurPennylane}). Le faire à la main.` : '',
      devis && !envoi.ok ? `À FAIRE : devis créé mais pas encore envoyé (${envoi.erreur || 'PDF en préparation'}). Cliquer « Envoyer » dans Pennylane.` : '',
    ].filter(Boolean).join('\n'),
    replyTo: d.client.email,
    cle: d.cle ? 'res-equipe-' + d.cle : undefined,
  });

  const reponse = {
    ok: true, quoteNumber: numero, holdUntil: fin.toISOString(), quoteSent: !!envoi.ok,
    totalHt: calc.totalHt, totalTtc: calc.totalTtc, requestId: (enregistree && enregistree.id) || null,
    ...(dry ? { dryRun: true } : {}),
  };
  if (d.cle) dejaVu.set(d.cle, { t: Date.now(), reponse });
  return res.status(200).json(reponse);
};

// pour les tests
module.exports._interne = { valider, frequence, dejaVu };
