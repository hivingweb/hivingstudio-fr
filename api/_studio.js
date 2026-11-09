// Grille de prix serveur, heures de Paris et calcul du devis de réservation.
// Le prix envoyé par le navigateur n'est JAMAIS utilisé : tout est recalculé ici.
// Fichier « _ » : non publié comme adresse par Vercel.
//
// Sources des prix (à garder alignées avec le site, montants HT) :
//  - plateaux : shared/config.js (STUDIOS_FALLBACK) et site-data.jsx (HIVING_PLATEAUX)
//  - catalogue « site » : site-data.jsx (HIVING_ADDONS_FULL), utilisé par /pages/devis.html
//  - catalogue « st_options » (/pro/) : lu dans la base du CRM au moment de la demande (lecture publique)

const PLATEAUX = {
  pro: { nom: 'Studio Pro', prixJour: 850 },
  famille: { nom: 'Studio Famille', prixJour: 1000 },
};

// Copie serveur de HIVING_ADDONS_FULL (site-data.jsx). Prix à 0 = sur devis, refusé en ligne.
const OPTIONS_SITE = {
  styliste: { nom: 'Styliste culinaire', unite: 'jour', prix: 650 },
  chef: { nom: 'Chef cuisine', unite: 'jour', prix: 750 },
  commis: { nom: 'Commis', unite: 'jour', prix: 280 },
  photographe: { nom: 'Photographe résident', unite: 'jour', prix: 1200 },
  phaseone: { nom: 'Phase One IQ4 150 MP', unite: 'jour', prix: 480 },
  cambo: { nom: 'Banc Cambo + tilt-shift', unite: 'jour', prix: 220 },
  lumiere: { nom: 'Pack lumière premium', unite: 'jour', prix: 320 },
  props: { nom: 'Kit props (vaisselle/textile)', unite: 'jour', prix: 180 },
  retouche: { nom: 'Retouche post-prod', unite: 'image', prix: 35 },
  parking: { nom: 'Parking 8 places', unite: 'jour', prix: 120 },
  loges: { nom: 'Loges + maquillage', unite: 'jour', prix: 200 },
};

const TVA = 20;
const OUVERTURE = 8;
const FERMETURE = 22;
const JOURS_MAX = 10;
const QTE_MAX = 30;
const OPTION_HEURES = 48;

/* ---------- heure de Paris ---------- */

// Décalage (ms) de Paris par rapport à UTC à l'instant t.
function decalageParis(t) {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Paris', hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date(t)).reduce((a, x) => (a[x.type] = x.value, a), {});
  const local = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return local - Math.floor(t / 1000) * 1000;
}
// Date + heure de Paris → instant UTC (Date)
function parisVersUtc(iso, heure) {
  const [y, m, d] = iso.split('-').map(Number);
  const brut = Date.UTC(y, m - 1, d, heure);
  let t = brut - decalageParis(brut);
  t = brut - decalageParis(t);
  return new Date(t);
}
function aujourdhuiParis(maintenant = Date.now()) {
  return new Date(maintenant + decalageParis(maintenant)).toISOString().slice(0, 10);
}
function plusJoursIso(iso, n) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}
function dateValide(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return false;
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}
function libelleJour(iso, avecAnnee = true) {
  return parisVersUtc(iso, 12).toLocaleDateString('fr-FR', {
    timeZone: 'Europe/Paris', day: 'numeric', month: 'long', ...(avecAnnee ? { year: 'numeric' } : {}),
  });
}
function libellePeriode(debut, jours) {
  if (jours <= 1) return `le ${libelleJour(debut)}`;
  return `du ${libelleJour(debut, false)} au ${libelleJour(plusJoursIso(debut, jours - 1))}`;
}
function libelleInstant(date) {
  return new Date(date).toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  });
}

/* ---------- option 48 h ---------- */

// Fin de l'option : 48 h, ou 2 h avant le début du tournage si c'est plus tôt. null = trop proche (moins de 4 h).
function finOption(debutIso, maintenant = Date.now()) {
  const debut = parisVersUtc(debutIso, OUVERTURE).getTime();
  const fin = Math.min(maintenant + OPTION_HEURES * 3600e3, debut - 2 * 3600e3);
  if (fin - maintenant < 4 * 3600e3) return null;
  return new Date(Math.floor(fin / 60000) * 60000);
}

/* ---------- prix ---------- */

const arrondi = (n) => Math.round(n * 100) / 100;
const montant = (n) => arrondi(n).toFixed(2);
const euros = (n) => arrondi(n).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' €';

// Calcule les lignes du devis. stOptions = catalogue st_options lu dans la base (tableau) ou null.
// Renvoie { lignes, totalHt, totalTva, totalTtc } ou { erreur }.
function calculer({ plateauId, debut, jours, options }, stOptions) {
  const plateau = PLATEAUX[plateauId];
  if (!plateau) return { erreur: 'Plateau inconnu.' };
  const lignes = [{
    code: 'plateau-' + plateauId,
    libelle: `Location ${plateau.nom} · journée ${OUVERTURE} h-${FERMETURE} h · ${libellePeriode(debut, jours)}`,
    quantite: jours, unite: 'jour', prixHt: plateau.prixJour,
  }];
  for (const o of options) {
    if (o.catalog === 'site') {
      const ref = OPTIONS_SITE[o.id];
      if (!ref) return { erreur: `Option inconnue : ${o.id}.` };
      lignes.push({ code: 'site-' + o.id, libelle: ref.nom, quantite: o.qty, unite: ref.unite, prixHt: ref.prix });
    } else {
      const ref = (stOptions || []).find(x => String(x.id) === String(o.id));
      if (!ref || ref.active === false || ref.included || !(Number(ref.price) > 0)) return { erreur: `Option inconnue : ${o.id}.` };
      const parJour = ref.unit === 'day';
      lignes.push({
        code: 'st-' + ref.id, libelle: String(ref.label || '').slice(0, 200),
        quantite: parJour ? jours : 1, unite: parJour ? 'jour' : 'forfait', prixHt: Number(ref.price),
      });
    }
  }
  const totalHt = arrondi(lignes.reduce((s, l) => s + l.prixHt * l.quantite, 0));
  const totalTva = arrondi(totalHt * TVA / 100);
  return { lignes, totalHt, totalTva, totalTtc: arrondi(totalHt + totalTva) };
}

/* ---------- référence de réservation (posée sur le devis Pennylane) ---------- */
// HS-RES-<fin d'option AAAAMMJJHHMM UTC>-<6 caractères> : permet à la tâche planifiée de retrouver
// les devis du site et l'heure exacte de fin d'option, sans base de données.
function referenceReservation(fin, alea) {
  const t = new Date(fin).toISOString().replace(/[-:T]/g, '').slice(0, 12);
  return `HS-RES-${t}-${alea}`;
}
function lireReference(ref) {
  const m = /^HS-RES-(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})-[a-z0-9]+$/i.exec(ref || '');
  if (!m) return null;
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]));
}

module.exports = {
  PLATEAUX, OPTIONS_SITE, TVA, OUVERTURE, FERMETURE, JOURS_MAX, QTE_MAX, OPTION_HEURES,
  decalageParis, parisVersUtc, aujourdhuiParis, plusJoursIso, dateValide, libellePeriode, libelleInstant,
  finOption, calculer, montant, euros, arrondi, referenceReservation, lireReference,
};
