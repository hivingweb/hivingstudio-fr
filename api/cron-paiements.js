// GET /api/cron-paiements — tâche planifiée Vercel (toutes les 15 min, vercel.json « crons »).
// Protégée par CRON_SECRET : Vercel envoie « Authorization: Bearer <CRON_SECRET> ».
//
// Suit les devis Pennylane créés par /api/reservation (external_reference « HS-RES-… », 21 derniers jours) :
//  - devis « pending » et option 48 h dépassée → statut « expired » dans Pennylane, e-mail « option expirée »
//    au client, alerte à l'équipe pour libérer la date dans l'admin ;
//  - devis « accepted » sans facture → facture finalisée créée depuis le devis (réf. HS-FAC-<id du devis>)
//    et envoyée par e-mail Pennylane (bouton de paiement si le paiement en ligne est activé) ;
//  - devis « accepted » avec facture payée → e-mail de confirmation au client, alerte « réservation payée :
//    à confirmer dans l'admin » (st_confirm_brand reste un clic admin), puis devis passé en « invoiced ».
//
// Idempotence sans base de données : l'état est porté par le statut du devis dans Pennylane.
//  pending → expired (fait une fois) ; accepted + facture HS-FAC (recherchée avant toute création) ;
//  accepted + payée → invoiced (fait une fois). Convention du site : « invoiced » = payé ET client prévenu.
//  Si Pennylane passe seul le devis en « invoiced » à la création de la facture, on le remet en « accepted ».
//  Alertes ponctuelles (facture impayée à l'échéance) : envoyées par le seul passage dont le créneau
//  de 15 min contient l'échéance, avec clé d'idempotence Resend (24 h) contre les doubles passages.
// Limites : voir docs/reservation-pennylane.md, section « Version autonome site ».

const { envoyerEmail, adresseContact } = require('./_mail');
const S = require('./_studio');
const PL = require('./_pennylane');

const QUART = 15 * 60e3;
const RETRO_JOURS = 21;

function autorise(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const h = (req.headers && req.headers.authorization) || '';
  return h === `Bearer ${secret}`;
}

// true si l'instant t tombe dans le créneau de 15 min qui vient de s'écouler
function dansCeCreneau(t, maintenant) {
  const fin = Math.floor(maintenant / QUART) * QUART;
  return t >= fin - QUART && t < fin;
}

async function emailClient(q) {
  const id = q.customer && (q.customer.id || q.customer);
  if (!id || typeof id === 'object') return null;
  try {
    const c = await PL.lireClient(id);
    return (c && Array.isArray(c.emails) && c.emails[0]) || (c && c.email) || null;
  } catch (e) { console.error('[cron] client illisible', id, e.message); return null; }
}

const sujetDevis = (q) => q.pdf_invoice_subject || ('Devis ' + PL.numeroDevis(q));

async function traiter(q, maintenant, journal) {
  const fin = S.lireReference(q.external_reference);
  if (!fin) return;
  const numero = PL.numeroDevis(q);
  const quoi = sujetDevis(q);

  if (q.status === 'pending') {
    if (maintenant <= fin.getTime()) return;
    await PL.statutDevis(q.id, 'expired');
    journal.push(`${numero} : expiré`);
    const email = await emailClient(q);
    if (email) {
      await envoyerEmail({
        to: [email], cle: 'exp-client-' + q.id, replyTo: adresseContact(),
        sujet: 'Votre option a expiré · Hiving Studio',
        corps: [
          'Bonjour,', '',
          `Sans signature ni paiement dans les 48 h, l'option liée au devis ${numero} (${quoi}) a expiré et la date est libérée.`,
          'Vous pouvez réserver à nouveau sur https://hivingstudio.fr/pro/ si la date est toujours libre.', '',
          `Une question : ${adresseContact()}.`, '', 'L\'équipe Hiving Studio',
        ].join('\n'),
      });
    }
    await envoyerEmail({
      cle: 'exp-equipe-' + q.id,
      sujet: `Option expirée : ${numero} · date à libérer dans l'admin`,
      corps: `${quoi}\nDevis ${numero} non signé à l'échéance (${S.libelleInstant(fin)}) : passé en « expiré » dans Pennylane.\nÀ FAIRE : libérer la date dans l'admin (demandes marques).${email ? '' : '\nClient non prévenu (e-mail introuvable dans Pennylane).'}`,
    });
    return;
  }

  if (q.status === 'accepted' || q.status === 'invoiced') {
    if (q.status === 'invoiced') return; // déjà payé et prévenu (convention du site)
    const refFacture = `HS-FAC-${q.id}`;
    let facture = await PL.factureParReference(refFacture);
    if (!facture) {
      facture = await PL.creerFactureDepuisDevis(q.id, refFacture);
      journal.push(`${numero} : facture créée`);
      // Pennylane a pu passer le devis en « invoiced » : on garde « accepted » tant que ce n'est pas payé
      await PL.statutDevis(q.id, 'accepted').catch(e => console.error('[cron] statut accepted', e.message));
      const envoi = await PL.envoyerFacture(facture.id);
      await envoyerEmail({
        cle: 'fac-equipe-' + q.id,
        sujet: `Devis signé : ${numero} · facture ${envoi.ok ? 'envoyée' : 'à envoyer'}`,
        corps: `${quoi}\nLe client a signé le devis ${numero}. Facture finalisée créée dans Pennylane (réf. ${refFacture}).\n`
          + (envoi.ok ? 'Elle est partie par e-mail Pennylane.' : `À FAIRE : l'envoyer depuis Pennylane (${envoi.erreur || 'PDF en préparation'}).`),
      });
      return;
    }
    const detail = facture.id ? await PL.lireFacture(facture.id) : facture;
    if (PL.estPayee(detail)) {
      const email = await emailClient(q);
      if (email) {
        await envoyerEmail({
          to: [email], cle: 'paye-client-' + q.id, replyTo: adresseContact(),
          sujet: 'Réservation confirmée · Hiving Studio',
          corps: [
            'Bonjour,', '',
            `Nous avons bien reçu votre paiement : votre réservation est confirmée (${quoi}).`,
            `Horaires : ${S.OUVERTURE} h-${S.FERMETURE} h. Adresse : 4 rue Mozart, 92110 Clichy.`, '',
            `Une question : ${adresseContact()}.`, '', 'À très vite,', 'L\'équipe Hiving Studio',
          ].join('\n'),
        });
      }
      await envoyerEmail({
        cle: 'paye-equipe-' + q.id,
        sujet: `Réservation payée : à confirmer dans l'admin · ${numero}`,
        corps: `${quoi}\nFacture ${refFacture} payée.\nÀ FAIRE : confirmer la demande dans l'admin (bouton Confirmer).${email ? '' : '\nClient non prévenu (e-mail introuvable dans Pennylane).'}`,
      });
      await PL.statutDevis(q.id, 'invoiced');
      journal.push(`${numero} : payé`);
      return;
    }
    // facture impayée à l'échéance de l'option : une alerte, l'équipe décide (avoir, délai de virement…)
    if (dansCeCreneau(fin.getTime(), maintenant)) {
      await envoyerEmail({
        cle: 'impaye-equipe-' + q.id,
        sujet: `Option échue, facture impayée : ${numero}`,
        corps: `${quoi}\nDevis signé mais facture ${refFacture} non payée à l'échéance (${S.libelleInstant(fin)}).\nÀ DÉCIDER : attendre le virement, ou annuler par un avoir dans Pennylane et libérer la date dans l'admin.`,
      });
      journal.push(`${numero} : impayé à l'échéance`);
    }
  }
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!autorise(req)) return res.status(401).json({ error: 'Non autorisé' });
  if (!PL.estActif()) return res.status(200).json({ ok: true, ignore: 'PENNYLANE_API_KEY absente' });
  if (PL.estDryRun()) {
    console.log('[cron DRY_RUN] aucun appel à Pennylane');
    return res.status(200).json({ ok: true, dryRun: true, traites: 0 });
  }

  const maintenant = Date.now();
  const journal = [], erreurs = [];
  let devis = [];
  try {
    devis = (await PL.devisRecents(S.plusJoursIso(S.aujourdhuiParis(maintenant), -RETRO_JOURS)))
      .filter(q => /^HS-RES-/.test(q.external_reference || ''));
  } catch (e) {
    console.error('[cron] liste des devis', e.statut, e.message);
    if (e.statut === 401 || e.statut === 403) {
      await envoyerEmail({ cle: 'cron-jeton-' + Math.floor(maintenant / 864e5), sujet: 'Hiving Studio : jeton Pennylane refusé', corps: `La tâche planifiée ne peut plus lire Pennylane (${e.message}). Vérifier PENNYLANE_API_KEY dans Vercel.` });
    }
    return res.status(502).json({ ok: false, error: e.message });
  }
  for (const q of devis) {
    try { await traiter(q, maintenant, journal); }
    catch (e) { erreurs.push(`${q.id} : ${e.message}`); console.error('[cron] devis', q.id, e.statut, e.message); }
  }
  console.log('[cron]', JSON.stringify({ devis: devis.length, journal, erreurs }));
  return res.status(200).json({ ok: true, traites: devis.length, journal, erreurs });
};

module.exports._interne = { dansCeCreneau, traiter };
