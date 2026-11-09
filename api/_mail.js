// Outils communs aux fonctions de formulaire (contact / demande de devis).
// Même mécanique que hivingfood.fr (dépôt hivingfood-fr), réglée pour hivingstudio.fr.
// Envoi des e-mails par l'API Resend. Aucun secret dans le code :
// la clé est lue dans la variable d'environnement RESEND_API_KEY (réglages Vercel).
// Le fichier commence par « _ » : Vercel ne le publie pas comme une adresse.
// Ne touche pas à la base Supabase du CRM (espace pro, admin, devis/ restent sur Supabase).

const SITE = {
  nom: 'Hiving Studio',
  domaine: 'hivingstudio.fr',
  contact: 'contact@hivingfood.fr',
  // expéditeur sur hivingfood.fr : un seul domaine à vérifier dans Resend pour les deux sites
  expediteur: 'Hiving Studio <noreply@hivingfood.fr>',
  origines: ['https://hivingstudio.fr', 'https://www.hivingstudio.fr'],
  // prévisualisations Vercel de ce projet (hivingstudio-fr-xxxx.vercel.app, hivingstudio-fr-git-branche-equipe.vercel.app)
  previews: /^https:\/\/hivingstudio-fr(-[a-z0-9-]+)?\.vercel\.app$/,
};

function origineAutorisee(origin) {
  if (!origin) return true; // appel direct sans navigateur (curl, tests) : pot de miel et validation restent actifs
  if (SITE.origines.includes(origin)) return true;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true; // npx vercel dev
  return SITE.previews.test(origin);
}

function enTetes(req, res) {
  const origin = (req.headers && req.headers.origin) || '';
  if (origin && origineAutorisee(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
}

// Contrôles communs : méthode et origine. Renvoie true si la réponse est déjà partie.
function controlesDeBase(req, res) {
  enTetes(req, res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return true; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Méthode non autorisée' }); return true; }
  if (!origineAutorisee(req.headers && req.headers.origin)) { res.status(403).json({ error: 'Origine refusée' }); return true; }
  return false;
}

async function lireCorps(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body) || {}; } catch { return {}; } }
  return {};
}

const EMAIL_RE = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,190}\.[^\s@<>"]{2,24}$/;

// Texte libre : caractères de contrôle retirés (sauf retours à la ligne), longueur limitée.
function texte(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

// Valeur sur une seule ligne (sujet, nom) : jamais de retour à la ligne.
function ligne(v, max) {
  return texte(v, max).replace(/[\r\n\t]+/g, ' ');
}

function adresseContact() {
  return process.env.CONTACT_TO || SITE.contact;
}

function indisponible(res) {
  return res.status(503).json({
    error: `Envoi momentanément indisponible, écrivez-nous à ${adresseContact()}.`,
    contact: adresseContact(),
  });
}

// Adresse(s) de copie vers la boîte que le CRM analyse (variable Vercel CRM_COPIE_TO,
// séparées par des virgules). Vide par défaut : rien ne change tant qu'elle n'est pas réglée.
function copieCrm() {
  return String(process.env.CRM_COPIE_TO || '').split(',').map((a) => a.trim()).filter((a) => EMAIL_RE.test(a));
}

async function envoyerEmail({ sujet, corps, replyTo, copieCachee = [] }) {
  const cle = process.env.RESEND_API_KEY;
  if (!cle) {
    console.error('[formulaire] RESEND_API_KEY absente : e-mail non envoyé');
    return { ok: false, raison: 'config' };
  }
  let r;
  try {
    r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cle}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || SITE.expediteur,
        to: [adresseContact()],
        bcc: copieCachee.length ? copieCachee : undefined,
        reply_to: replyTo || undefined,
        subject: ligne(sujet, 200),
        text: corps,
      }),
    });
  } catch (e) {
    console.error('[formulaire] Resend injoignable', e && e.message);
    return { ok: false, raison: 'envoi' };
  }
  if (!r.ok) {
    console.error('[formulaire] Resend a refusé l\'envoi', r.status, await r.text().catch(() => ''));
    return { ok: false, raison: 'envoi' };
  }
  return { ok: true };
}

function dateParis() {
  return new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
}

module.exports = {
  copieCrm,
  SITE, origineAutorisee, enTetes, controlesDeBase, lireCorps, EMAIL_RE, texte, ligne,
  adresseContact, indisponible, envoyerEmail, dateParis,
};
