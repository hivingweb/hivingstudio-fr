// POST /api/contact — formulaires de contact (accueil, /evenementiel/…)
// Corps JSON : { name, email, company?, message, subject?, source?, website? (piège à robots, doit rester vide) }
// Envoie la demande par e-mail à l'adresse de contact (« répondre » va directement au visiteur).

const { SITE, copieCrm, controlesDeBase, lireCorps, EMAIL_RE, texte, ligne, indisponible, envoyerEmail, dateParis } = require('./_mail');

module.exports = async (req, res) => {
  if (controlesDeBase(req, res)) return;

  const b = await lireCorps(req);
  if (texte(b.website, 200)) return res.status(200).json({ success: true }); // robot : on ignore en silence

  const name = ligne(b.name, 120);
  const email = ligne(b.email, 254);
  const company = ligne(b.company, 160);
  const subject = ligne(b.subject, 120);
  const source = ligne(b.source, 60);
  const message = texte(b.message, 5000);

  if (!name || !email || !message) return res.status(400).json({ error: 'Champs obligatoires : nom, e-mail, message.' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Adresse e-mail invalide.' });

  const corps = [
    `Nouveau message depuis ${SITE.domaine}${source ? ` (${source})` : ''}`, '',
    `Nom : ${name}`, `E-mail : ${email}`, `Société : ${company || '-'}`, `Date : ${dateParis()}`, '',
    'Message :', message,
  ].join('\n');

  const envoi = await envoyerEmail({
    sujet: `${subject || `Nouveau contact ${SITE.nom}`} : ${name}`,
    corps,
    replyTo: email,
    // Demande de réservation (page devis) : copie cachée vers la boîte lue par le CRM,
    // seulement si CRM_COPIE_TO est réglée sur Vercel (sinon contact@ seul, comme aujourd'hui).
    copieCachee: source === 'devis' ? copieCrm() : [],
  });
  if (!envoi.ok) return indisponible(res);
  return res.status(200).json({ success: true, message: 'Message envoyé. On revient vers vous très vite.' });
};
