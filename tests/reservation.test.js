// Test local de /api/reservation et /api/cron-paiements, sans réseau :
// Pennylane, la base Supabase et Resend sont simulés (fetch remplacé).
// Lancer depuis la racine du dépôt :  node tests/reservation.test.js

const path = require('path');
const assert = require('assert');
const API = path.join(__dirname, '..', 'api');
const S = require(path.join(API, '_studio.js'));
const ORIGINE = 'https://hivingstudio.fr';

/* ---------- faux services ---------- */
let appels, pl, base;
function reinit() {
  appels = [];
  pl = { clients: [], devis: [], factures: [], seq: 100 };
  base = {
    options: [
      { id: 'o1', label: 'Package Lumière : 2 lumières', price: 150, unit: 'day', active: true, included: false },
      { id: 'o2', label: 'Trépied', price: 40, unit: 'forfait', active: true, included: false },
      { id: 'o3', label: 'Inclus', price: 0, unit: 'day', active: true, included: true },
    ],
    occupe: [], demandes: [], slotTaken: false,
  };
}
const rep = (status, data) => ({
  ok: status >= 200 && status < 300, status,
  text: async () => (data == null ? '' : JSON.stringify(data)),
  json: async () => data,
});
const filtreDe = (url) => { const m = /filter=([^&]+)/.exec(url); return m ? JSON.parse(decodeURIComponent(m[1])) : []; };

global.fetch = async (url, opts = {}) => {
  const method = opts.method || 'GET';
  const corps = opts.body ? JSON.parse(opts.body) : null;
  appels.push({ url, method, corps, headers: opts.headers || {} });
  // Resend
  if (url === 'https://api.resend.com/emails') return rep(200, { id: 'mail' });
  // Supabase (clé publique uniquement)
  if (url.includes('supabase.co')) {
    assert.ok(!/service_role/.test(JSON.stringify(opts.headers)), 'jamais de service_role');
    if (url.includes('/rest/v1/st_options')) return rep(200, base.options);
    if (url.endsWith('/rpc/st_all_busy')) return rep(200, base.occupe);
    if (url.endsWith('/rpc/st_create_brand_request')) {
      if (base.slotTaken) return rep(400, { message: 'SLOT_TAKEN' });
      const d = { id: 'req-' + (base.demandes.length + 1), ...corps };
      base.demandes.push(d);
      return rep(200, [d]);
    }
    return rep(404, { message: 'inconnu' });
  }
  // Pennylane
  const P = 'https://app.pennylane.com/api/external/v2';
  assert.ok(url.startsWith(P), 'adresse inattendue ' + url);
  assert.strictEqual(opts.headers.Authorization, 'Bearer cle-pennylane-test');
  const chemin = url.slice(P.length);
  let m;
  if (method === 'GET' && chemin.startsWith('/customers?')) {
    const ref = filtreDe(url)[0].value;
    return rep(200, { items: pl.clients.filter(c => c.external_reference === ref), has_more: false });
  }
  if (method === 'POST' && chemin === '/company_customers') {
    const c = { id: ++pl.seq, ...corps }; pl.clients.push(c); return rep(201, c);
  }
  if (method === 'GET' && (m = /^\/customers\/(\d+)$/.exec(chemin))) return rep(200, pl.clients.find(c => c.id === +m[1]));
  if (method === 'POST' && chemin === '/quotes') {
    const q = { id: ++pl.seq, status: 'pending', quote_number: 'D-2026-' + pl.seq, customer: { id: corps.customer_id }, ...corps };
    pl.devis.push(q); return rep(201, q);
  }
  if (method === 'POST' && (m = /^\/quotes\/(\d+)\/send_by_email$/.exec(chemin))) return rep(204, null);
  if (method === 'PUT' && (m = /^\/quotes\/(\d+)\/update_status$/.exec(chemin))) {
    const q = pl.devis.find(x => x.id === +m[1]); q.status = corps.status; return rep(200, q);
  }
  if (method === 'GET' && chemin.startsWith('/quotes?')) return rep(200, { items: pl.devis, has_more: false, next_cursor: null });
  if (method === 'GET' && chemin.startsWith('/customer_invoices?')) {
    const ref = filtreDe(url)[0].value;
    return rep(200, { items: pl.factures.filter(f => f.external_reference === ref) });
  }
  if (method === 'POST' && chemin === '/customer_invoices/create_from_quote') {
    assert.strictEqual(corps.draft, false, 'facture finalisée');
    const f = { id: ++pl.seq, paid: false, status: 'upcoming', external_reference: corps.external_reference, quote_id: corps.quote_id };
    pl.factures.push(f);
    pl.devis.find(q => q.id === corps.quote_id).status = 'invoiced'; // comportement possible de Pennylane
    return rep(201, f);
  }
  if (method === 'POST' && /^\/customer_invoices\/\d+\/send_by_email$/.test(chemin)) return rep(204, null);
  if (method === 'GET' && (m = /^\/customer_invoices\/(\d+)$/.exec(chemin))) return rep(200, pl.factures.find(f => f.id === +m[1]));
  return rep(404, { error: 'route simulée absente ' + method + ' ' + chemin });
};

/* ---------- appel d'une fonction ---------- */
function appeler(nom, { method = 'POST', origin = ORIGINE, body, headers = {} } = {}) {
  const fn = require(path.join(API, nom + '.js'));
  return new Promise((resolve, reject) => {
    const res = {
      statusCode: 200, headers: {}, corps: undefined,
      setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
      status(c) { this.statusCode = c; return this; },
      json(o) { this.corps = o; resolve(this); return this; },
      end() { resolve(this); return this; },
    };
    const req = { method, headers: { ...(origin ? { origin } : {}), 'x-forwarded-for': '10.0.0.' + Math.floor(Math.random() * 250), ...headers }, body };
    Promise.resolve(fn(req, res)).catch(reject);
  });
}

let echecs = 0;
async function cas(titre, f) {
  reinit();
  try { await f(); console.log('  ok   ' + titre); }
  catch (e) { echecs++; console.log('  ECHEC ' + titre + ' : ' + (e && e.stack || e)); }
}

const dans10j = S.plusJoursIso(S.aujourdhuiParis(), 10);
const valide = (x = {}) => ({
  source: 'test', idempotency_key: 'k-' + Math.random().toString(36).slice(2),
  studio_id: 'pro', start_date: dans10j, days: 2,
  options: [{ catalog: 'st_options', id: 'o1', qty: 1, unit_price_ht: 1 }, { catalog: 'st_options', id: 'o2', qty: 1 }],
  customer: {
    company: 'ACME SAS', siren: '123 456 789', contact_name: 'Camille Martin', email: 'Camille@Acme.fr',
    billing_address: { line1: '12 rue du Bac', zip: '75007', city: 'Paris', country: 'FR' },
  },
  message: 'Recette en gros plan', client_total_ht: 850 * 2 + 150 * 2 + 40, accept_conditions: true, website: '', ...x,
});
const pennylane = () => appels.filter(a => a.url.includes('pennylane.com'));
const mails = () => appels.filter(a => a.url === 'https://api.resend.com/emails');

(async () => {
  process.env.RESEND_API_KEY = 'cle-resend-test';
  process.env.PENNYLANE_API_KEY = 'cle-pennylane-test';
  delete process.env.PENNYLANE_DRY_RUN;

  console.log('Calcul du prix (serveur)');
  await cas('plateau × jours + options st_options (jour × jours, forfait × 1)', async () => {
    const c = S.calculer({ plateauId: 'pro', debut: dans10j, jours: 2, options: [{ catalog: 'st_options', id: 'o1' }, { catalog: 'st_options', id: 'o2' }] }, base.options);
    assert.strictEqual(c.totalHt, 2040); assert.strictEqual(c.totalTva, 408); assert.strictEqual(c.totalTtc, 2448);
    assert.deepStrictEqual(c.lignes.map(l => l.quantite), [2, 2, 1]);
  });
  await cas('Studio Famille 1 000 € + catalogue site (quantité choisie)', async () => {
    const c = S.calculer({ plateauId: 'famille', debut: dans10j, jours: 1, options: [{ catalog: 'site', id: 'retouche', qty: 10 }, { catalog: 'site', id: 'styliste', qty: 1 }] }, null);
    assert.strictEqual(c.totalHt, 1000 + 350 + 650);
  });
  await cas('option inconnue, incluse ou à 0 € refusée', async () => {
    assert.ok(S.calculer({ plateauId: 'pro', debut: dans10j, jours: 1, options: [{ catalog: 'site', id: 'food', qty: 1 }] }, null).erreur);
    assert.ok(S.calculer({ plateauId: 'pro', debut: dans10j, jours: 1, options: [{ catalog: 'st_options', id: 'o3' }] }, base.options).erreur);
  });
  await cas('option 48 h : plafonnée à 2 h avant le tournage, refus sous 4 h', async () => {
    const now = Date.now();
    const minutes = (S.finOption(dans10j, now) - now) / 60000; // arrondi à la minute inférieure
    assert.ok(minutes > 48 * 60 - 1 && minutes <= 48 * 60, String(minutes));
    const demain = S.plusJoursIso(S.aujourdhuiParis(now), 1);
    const f = S.finOption(demain, now);
    if (f) assert.ok(f.getTime() <= S.parisVersUtc(demain, 8).getTime() - 2 * 3600e3);
    assert.strictEqual(S.finOption(S.aujourdhuiParis(now), S.parisVersUtc(S.aujourdhuiParis(now), 7).getTime()), null);
  });

  console.log('/api/reservation');
  await cas('réservation valide -> 200, client + devis Pennylane, base, 2 e-mails', async () => {
    const r = await appeler('reservation', { body: valide() });
    assert.strictEqual(r.statusCode, 200, JSON.stringify(r.corps));
    assert.strictEqual(r.corps.ok, true);
    assert.ok(/^D-2026-/.test(r.corps.quoteNumber));
    assert.ok(r.corps.holdUntil && r.corps.quoteSent === true);
    assert.strictEqual(r.corps.totalHt, 2040);
    const cl = pl.clients[0];
    assert.strictEqual(cl.external_reference, 'HS-SIREN-123456789');
    assert.strictEqual(cl.reg_no, '123456789');
    assert.deepStrictEqual(cl.emails, ['camille@acme.fr']);
    const q = pl.devis[0];
    assert.ok(/^HS-RES-\d{12}-[0-9a-f]{6}$/.test(q.external_reference));
    assert.strictEqual(q.invoice_lines.length, 3);
    assert.deepStrictEqual(q.invoice_lines.map(l => l.raw_currency_unit_price), ['850.00', '150.00', '40.00']);
    assert.ok(q.invoice_lines.every(l => l.vat_rate === 'FR_200'));
    assert.strictEqual(q.deadline, S.aujourdhuiParis(Date.parse(r.corps.holdUntil)));
    assert.ok(pennylane().some(a => /\/quotes\/\d+\/send_by_email$/.test(a.url)));
    assert.strictEqual(base.demandes.length, 1);
    assert.ok(base.demandes[0].p_needs.includes(q.quote_number), 'référence du devis dans le message');
    assert.ok(base.demandes[0].p_needs.includes(q.external_reference));
    assert.strictEqual(base.demandes[0].p_options.length, 2);
    const m = mails();
    assert.strictEqual(m.length, 2);
    assert.deepStrictEqual(m[0].corps.to, ['camille@acme.fr']);
    assert.ok(m[0].corps.text.includes('Elle est confirmée à réception du paiement'));
    assert.deepStrictEqual(m[1].corps.to, ['contact@hivingfood.fr']);
  });
  await cas('client déjà connu dans Pennylane : pas de doublon', async () => {
    pl.clients.push({ id: 7, external_reference: 'HS-SIREN-123456789' });
    const r = await appeler('reservation', { body: valide() });
    assert.strictEqual(r.statusCode, 200);
    assert.strictEqual(pl.clients.length, 1);
    assert.strictEqual(pl.devis[0].customer_id, 7);
  });
  await cas('prix du navigateur différent -> 422, rien de créé', async () => {
    const r = await appeler('reservation', { body: valide({ client_total_ht: 10 }) });
    assert.strictEqual(r.statusCode, 422);
    assert.ok(/nouveau total 2\s?040 € HT/.test(r.corps.error), r.corps.error);
    assert.strictEqual(pennylane().length, 0); assert.strictEqual(base.demandes.length, 0);
  });
  await cas('prix unitaires du navigateur ignorés (unit_price_ht=1)', async () => {
    const r = await appeler('reservation', { body: valide({ client_total_ht: undefined }) });
    assert.strictEqual(r.statusCode, 200); assert.strictEqual(r.corps.totalHt, 2040);
  });
  await cas('date déjà prise (lecture) -> 409, pas de Pennylane', async () => {
    base.occupe = [{ studio_id: 'pro', starts_at: S.parisVersUtc(dans10j, 10).toISOString(), ends_at: S.parisVersUtc(dans10j, 12).toISOString(), kind: 'creator' }];
    const r = await appeler('reservation', { body: valide() });
    assert.strictEqual(r.statusCode, 409); assert.strictEqual(pennylane().length, 0);
  });
  await cas('autre plateau occupé : pas de conflit', async () => {
    base.occupe = [{ studio_id: 'famille', starts_at: S.parisVersUtc(dans10j, 8).toISOString(), ends_at: S.parisVersUtc(dans10j, 22).toISOString() }];
    assert.strictEqual((await appeler('reservation', { body: valide() })).statusCode, 200);
  });
  await cas('course perdue (SLOT_TAKEN à l\'enregistrement) -> 409 et devis refusé', async () => {
    base.slotTaken = true;
    const r = await appeler('reservation', { body: valide() });
    assert.strictEqual(r.statusCode, 409);
    assert.strictEqual(pl.devis[0].status, 'denied');
    assert.strictEqual(mails().length, 0);
  });
  await cas('même idempotency_key deux fois -> même réponse, un seul devis', async () => {
    const b = valide();
    const r1 = await appeler('reservation', { body: b });
    const r2 = await appeler('reservation', { body: b });
    assert.deepStrictEqual(r2.corps, r1.corps); assert.strictEqual(pl.devis.length, 1);
  });
  await cas('validations -> 400 (e-mail, conditions, plateau, jours, SIREN, date passée)', async () => {
    for (const x of [
      { customer: { ...valide().customer, email: 'pas-un-email' } }, { accept_conditions: false }, { studio_id: 'lifestyle' },
      { days: 11 }, { days: 1.5 }, { customer: { ...valide().customer, siren: '12' } }, { start_date: '2020-01-01' },
    ]) assert.strictEqual((await appeler('reservation', { body: valide(x) })).statusCode, 400, JSON.stringify(x));
    assert.strictEqual(pennylane().length, 0);
  });
  await cas('pot de miel -> 200 factice sans rien créer', async () => {
    const r = await appeler('reservation', { body: valide({ website: 'http://spam' }) });
    assert.strictEqual(r.statusCode, 200); assert.strictEqual(appels.length, 0);
  });
  await cas('origine interdite -> 403 ; OPTIONS -> 204 ; GET -> 405', async () => {
    assert.strictEqual((await appeler('reservation', { origin: 'https://pirate.example', body: valide() })).statusCode, 403);
    const o = await appeler('reservation', { method: 'OPTIONS', origin: 'https://hivingstudio-fr-git-x-hiving.vercel.app' });
    assert.strictEqual(o.statusCode, 204);
    assert.strictEqual(o.headers['access-control-allow-origin'], 'https://hivingstudio-fr-git-x-hiving.vercel.app');
    assert.strictEqual((await appeler('reservation', { method: 'GET' })).statusCode, 405);
  });
  await cas('corps trop gros -> 413', async () => {
    const r = await appeler('reservation', { body: valide({ message: 'x'.repeat(30000) }) });
    assert.strictEqual(r.statusCode, 413);
  });
  await cas('plus de 5 demandes par IP et par heure -> 429', async () => {
    const h = { 'x-forwarded-for': '203.0.113.9' };
    let dernier;
    for (let i = 0; i < 6; i++) dernier = await appeler('reservation', { body: valide(), headers: h });
    assert.strictEqual(dernier.statusCode, 429);
  });
  await cas('Pennylane en panne : date quand même bloquée, alerte équipe, quoteNumber null', async () => {
    const vrai = global.fetch;
    global.fetch = async (url, o) => (url.includes('pennylane.com') ? rep(401, { error: 'jeton' }) : vrai(url, o));
    try {
      const r = await appeler('reservation', { body: valide() });
      assert.strictEqual(r.statusCode, 200); assert.strictEqual(r.corps.quoteNumber, null);
      assert.strictEqual(base.demandes.length, 1);
      assert.ok(mails()[1].corps.text.includes('devis Pennylane non créé'));
    } finally { global.fetch = vrai; }
  });
  await cas('sans PENNYLANE_API_KEY -> 501 fallback, rien appelé (la page reprend l\'ancien circuit)', async () => {
    delete process.env.PENNYLANE_API_KEY;
    try {
      const r = await appeler('reservation', { body: valide() });
      assert.strictEqual(r.statusCode, 501); assert.strictEqual(r.corps.fallback, true); assert.strictEqual(appels.length, 0);
    } finally { process.env.PENNYLANE_API_KEY = 'cle-pennylane-test'; }
  });
  await cas('PENNYLANE_DRY_RUN=1 -> 200, aucun appel Pennylane, rien en base, e-mails [TEST]', async () => {
    process.env.PENNYLANE_DRY_RUN = '1';
    const log = console.log; const lignes = []; console.log = (...a) => lignes.push(a.join(' '));
    try {
      const r = await appeler('reservation', { body: valide() });
      assert.strictEqual(r.statusCode, 200); assert.strictEqual(r.corps.dryRun, true);
      assert.strictEqual(pennylane().length, 0); assert.strictEqual(base.demandes.length, 0);
      assert.ok(lignes.some(l => l.includes('POST /quotes')), 'devis journalisé');
      assert.ok(mails().every(m => m.corps.subject.startsWith('[TEST]')));
    } finally { console.log = log; delete process.env.PENNYLANE_DRY_RUN; }
  });

  console.log('/api/cron-paiements');
  process.env.CRON_SECRET = 'secret-cron';
  const auth = { authorization: 'Bearer secret-cron' };
  const ref = (finMs) => S.referenceReservation(new Date(finMs), 'abc123');
  const prepare = () => {
    const now = Date.now();
    pl.clients.push({ id: 1, emails: ['client@acme.fr'] });
    pl.devis.push(
      { id: 11, status: 'pending', external_reference: ref(now - 3600e3), customer: { id: 1 }, quote_number: 'D-11', pdf_invoice_subject: 'Location Studio Pro' },
      { id: 12, status: 'pending', external_reference: ref(now + 3600e3), customer: { id: 1 }, quote_number: 'D-12' },
      { id: 13, status: 'accepted', external_reference: ref(now + 3600e3), customer: { id: 1 }, quote_number: 'D-13' },
      { id: 14, status: 'accepted', external_reference: ref(now + 3600e3), customer: { id: 1 }, quote_number: 'D-14' },
      { id: 15, status: 'pending', external_reference: 'AUTRE-REF', customer: { id: 1 }, quote_number: 'D-15' },
    );
    pl.factures.push({ id: 50, paid: true, external_reference: 'HS-FAC-14' });
  };
  await cas('sans le secret -> 401', async () => {
    assert.strictEqual((await appeler('cron-paiements', { method: 'GET', origin: null })).statusCode, 401);
    assert.strictEqual((await appeler('cron-paiements', { method: 'GET', origin: null, headers: { authorization: 'Bearer faux' } })).statusCode, 401);
  });
  await cas('48 h -> expiré + e-mails ; signé -> facture finalisée + envoi ; payé -> confirmation + alerte', async () => {
    prepare();
    const r = await appeler('cron-paiements', { method: 'GET', origin: null, headers: auth });
    assert.strictEqual(r.statusCode, 200, JSON.stringify(r.corps));
    assert.deepStrictEqual(r.corps.erreurs, []);
    const st = Object.fromEntries(pl.devis.map(q => [q.id, q.status]));
    assert.deepStrictEqual(st, { 11: 'expired', 12: 'pending', 13: 'accepted', 14: 'invoiced', 15: 'pending' });
    assert.ok(pl.factures.some(f => f.external_reference === 'HS-FAC-13'), 'facture créée depuis le devis 13');
    assert.ok(pennylane().some(a => /\/customer_invoices\/\d+\/send_by_email$/.test(a.url)), 'facture envoyée');
    const sujets = mails().map(m => m.corps.subject);
    assert.ok(sujets.some(s => /option a expiré/.test(s)));
    assert.ok(sujets.some(s => /date à libérer/.test(s)));
    assert.ok(sujets.some(s => /Réservation confirmée/.test(s)));
    assert.ok(sujets.some(s => /Réservation payée : à confirmer dans l'admin/.test(s)));
    assert.ok(mails().every(m => m.headers['Idempotency-Key']), 'clé d\'idempotence Resend');
  });
  await cas('idempotence : deuxième passage sans nouvel e-mail ni nouvelle facture', async () => {
    prepare();
    await appeler('cron-paiements', { method: 'GET', origin: null, headers: auth });
    const nbFactures = pl.factures.length;
    appels = [];
    const r = await appeler('cron-paiements', { method: 'GET', origin: null, headers: auth });
    assert.strictEqual(r.statusCode, 200);
    assert.strictEqual(mails().length, 0, 'aucun e-mail au 2e passage');
    assert.strictEqual(pl.factures.length, nbFactures);
    assert.ok(!pennylane().some(a => a.method !== 'GET'), 'aucune écriture Pennylane au 2e passage');
  });
  await cas('facture du devis 13 payée ensuite -> confirmé une seule fois', async () => {
    prepare();
    await appeler('cron-paiements', { method: 'GET', origin: null, headers: auth });
    pl.factures.find(f => f.external_reference === 'HS-FAC-13').paid = true;
    appels = [];
    await appeler('cron-paiements', { method: 'GET', origin: null, headers: auth });
    assert.strictEqual(mails().filter(m => /Réservation confirmée/.test(m.corps.subject)).length, 1);
    assert.strictEqual(pl.devis.find(q => q.id === 13).status, 'invoiced');
    appels = [];
    await appeler('cron-paiements', { method: 'GET', origin: null, headers: auth });
    assert.strictEqual(mails().length, 0);
  });
  await cas('facture impayée à l\'échéance : une alerte, dans un seul créneau de 15 min', async () => {
    const { dansCeCreneau } = require(path.join(API, 'cron-paiements.js'))._interne;
    const now = Date.UTC(2026, 10, 10, 10, 7);
    assert.ok(dansCeCreneau(Date.UTC(2026, 10, 10, 9, 50), now));
    assert.ok(!dansCeCreneau(Date.UTC(2026, 10, 10, 10, 1), now));
    assert.ok(!dansCeCreneau(Date.UTC(2026, 10, 10, 9, 44), now));
  });
  await cas('cron en DRY_RUN : aucun appel Pennylane', async () => {
    process.env.PENNYLANE_DRY_RUN = '1';
    const log = console.log; console.log = () => {};
    try {
      prepare();
      const r = await appeler('cron-paiements', { method: 'GET', origin: null, headers: auth });
      assert.strictEqual(r.corps.dryRun, true); assert.strictEqual(appels.length, 0);
    } finally { console.log = log; delete process.env.PENNYLANE_DRY_RUN; }
  });

  console.log(echecs ? `\n${echecs} test(s) en échec.` : '\nTous les tests passent.');
  process.exitCode = echecs ? 1 : 0;
})();
