// Test local des fonctions de formulaire (aucun e-mail réellement envoyé).
// Lancer depuis la racine du dépôt :  node tests/formulaires.test.js
// L'appel à Resend est simulé : on vérifie seulement qu'il a lieu (ou pas).

const path = require('path');
const assert = require('assert');

const fs = require('fs');
const API = path.join(__dirname, '..', 'api');
const ORIGINE_OK = require(path.join(API, '_mail.js')).SITE.origines[0];
const ORIGINE_KO = 'https://pirate.example';

// Corps valides, un par fonction
const VALIDES = {
  contact: { name: 'Test Robot', email: 'test@example.com', company: 'ACME', message: 'Bonjour, ceci est un test.' },
  newsletter: { email: 'test@example.com', source: 'test' },
  brief: {
    type: 'Campagne influence', company: 'ACME', budget: '5 000 à 15 000 € HT',
    deadline: 'Sous 1 mois', message: 'Lancement d’un nouveau produit.', email: 'test@example.com',
  },
};

// on ne teste que les fonctions présentes dans ce dépôt
for (const nom of Object.keys(VALIDES)) if (!fs.existsSync(path.join(API, nom + '.js'))) delete VALIDES[nom];

let appelsResend = [];
global.fetch = async (url, opts) => {
  appelsResend.push({ url, body: JSON.parse(opts.body) });
  return { ok: true, status: 200, json: async () => ({ id: 'simule' }), text: async () => '' };
};

function appeler(nom, { method = 'POST', origin = ORIGINE_OK, body } = {}) {
  const fn = require(path.join(API, nom + '.js'));
  return new Promise((resolve, reject) => {
    const res = {
      statusCode: 200, headers: {}, corps: undefined,
      setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
      status(c) { this.statusCode = c; return this; },
      json(o) { this.corps = o; resolve(this); return this; },
      end() { resolve(this); return this; },
    };
    const req = { method, headers: origin ? { origin } : {}, body };
    Promise.resolve(fn(req, res)).catch(reject);
  });
}

async function cas(titre, f) {
  appelsResend = [];
  try { await f(); console.log('  ok   ' + titre); }
  catch (e) { console.log('  ECHEC ' + titre + ' : ' + e.message); process.exitCode = 1; }
}

(async () => {
  for (const nom of Object.keys(VALIDES)) {
    console.log('/api/' + nom);
    const valide = VALIDES[nom];

    process.env.RESEND_API_KEY = 'cle-de-test';
    await cas('JSON valide -> 200 et un e-mail', async () => {
      const r = await appeler(nom, { body: { ...valide } });
      assert.strictEqual(r.statusCode, 200);
      assert.ok(appelsResend.some(a => a.url === 'https://api.resend.com/emails'));
      const mail = appelsResend.find(a => a.url === 'https://api.resend.com/emails').body;
      assert.ok(mail.to[0].includes('@'), 'destinataire présent');
      assert.strictEqual(mail.reply_to, 'test@example.com');
    });
    await cas('corps texte (chaîne JSON) -> 200', async () => {
      const r = await appeler(nom, { body: JSON.stringify(valide) });
      assert.strictEqual(r.statusCode, 200);
    });
    await cas('e-mail invalide -> 400 sans envoi', async () => {
      const r = await appeler(nom, { body: { ...valide, email: 'pas-un-email' } });
      assert.strictEqual(r.statusCode, 400);
      assert.strictEqual(appelsResend.length, 0);
    });
    await cas('pot de miel rempli -> 200 sans envoi', async () => {
      const r = await appeler(nom, { body: { ...valide, website: 'http://spam.example' } });
      assert.strictEqual(r.statusCode, 200);
      assert.strictEqual(appelsResend.length, 0);
    });
    await cas('origine interdite -> 403 sans envoi', async () => {
      const r = await appeler(nom, { origin: ORIGINE_KO, body: { ...valide } });
      assert.strictEqual(r.statusCode, 403);
      assert.strictEqual(appelsResend.length, 0);
    });
    await cas('méthode GET -> 405', async () => {
      const r = await appeler(nom, { method: 'GET' });
      assert.strictEqual(r.statusCode, 405);
    });
    await cas('OPTIONS (pré-vol navigateur) -> 204', async () => {
      const r = await appeler(nom, { method: 'OPTIONS' });
      assert.strictEqual(r.statusCode, 204);
    });

    delete process.env.RESEND_API_KEY;
    await cas('sans RESEND_API_KEY -> 503 avec adresse de repli', async () => {
      const r = await appeler(nom, { body: { ...valide } });
      assert.strictEqual(r.statusCode, 503);
      assert.ok(/indisponible/.test(r.corps.error) && /@/.test(r.corps.error));
      assert.strictEqual(appelsResend.length, 0);
    });
  }

  // Cas propres au brief : chaque champ obligatoire est revérifié côté serveur
  if (VALIDES.brief) {
    process.env.RESEND_API_KEY = 'cle-de-test';
    console.log('/api/brief (validation)');
    for (const [champ, valeur] of [['type', 'Inconnu'], ['company', ''], ['budget', '1 €'], ['deadline', 'demain'], ['message', 'court']]) {
      await cas(`${champ} invalide -> 400`, async () => {
        const r = await appeler('brief', { body: { ...VALIDES.brief, [champ]: valeur } });
        assert.strictEqual(r.statusCode, 400);
        assert.ok(r.corps.fields && r.corps.fields[champ]);
      });
    }
  }
  console.log(process.exitCode ? '\nDes tests ont échoué.' : '\nTous les tests passent.');
})();
