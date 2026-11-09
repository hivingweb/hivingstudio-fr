// Client minimal de l'API Pennylane v2 pour les fonctions Vercel du site.
// Jeton lu dans PENNYLANE_API_KEY (réglages Vercel), jamais dans le code ni envoyé au navigateur.
// PENNYLANE_DRY_RUN=1 : aucun appel à Pennylane, chaque requête est seulement journalisée.
// Ce qui est confirmé ou non par la documentation officielle : docs/reservation-pennylane.md,
// section « Version autonome site ».

const BASE = 'https://app.pennylane.com/api/external/v2';

class ErreurPennylane extends Error {
  constructor(message, statut, corps) { super(message); this.statut = statut; this.corps = corps; }
}

const estDryRun = () => process.env.PENNYLANE_DRY_RUN === '1';
const estActif = () => !!process.env.PENNYLANE_API_KEY || estDryRun();
const pause = (ms) => new Promise(r => setTimeout(r, ms));

// Compteur des faux identifiants du mode test
let fauxId = 900000;

async function appel(method, chemin, corps, { tentatives = 3 } = {}) {
  if (estDryRun()) {
    console.log('[pennylane DRY_RUN]', method, chemin, corps ? JSON.stringify(corps) : '');
    return { __dryRun: true, id: ++fauxId, quote_number: 'DRY-RUN-' + fauxId, items: [], has_more: false };
  }
  const cle = process.env.PENNYLANE_API_KEY;
  if (!cle) throw new ErreurPennylane('PENNYLANE_API_KEY absente', 0);
  for (let i = 1; ; i++) {
    let r;
    try {
      r = await fetch(BASE + chemin, {
        method,
        headers: { Authorization: `Bearer ${cle}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: corps ? JSON.stringify(corps) : undefined,
      });
    } catch (e) {
      if (i < tentatives) { await pause(800 * i); continue; }
      throw new ErreurPennylane('Pennylane injoignable : ' + (e && e.message), 0);
    }
    if ((r.status === 429 || r.status >= 500) && i < tentatives) { await pause(1000 * i); continue; }
    const texte = await r.text().catch(() => '');
    let data = null;
    try { data = texte ? JSON.parse(texte) : null; } catch { data = texte; }
    if (!r.ok) {
      const msg = (data && (data.error || data.message)) || ('HTTP ' + r.status);
      throw new ErreurPennylane(`${method} ${chemin} : ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`, r.status, data);
    }
    return data;
  }
}

const filtre = (champs) => 'filter=' + encodeURIComponent(JSON.stringify(champs));
const elements = (d) => (d && (d.items || d.data)) || (Array.isArray(d) ? d : []);

/* ---------- clients ---------- */

// external_reference : HS-SIREN-<siren> si SIREN, sinon HS-EMAIL-<e-mail en minuscules>
function referenceClient({ siren, email }) {
  return siren ? `HS-SIREN-${siren}` : `HS-EMAIL-${String(email).toLowerCase()}`;
}

async function trouverOuCreerClient(c) {
  const ref = referenceClient(c);
  const trouve = elements(await appel('GET', '/customers?' + filtre([{ field: 'external_reference', operator: 'eq', value: ref }])));
  if (trouve.length) return { id: trouve[0].id, cree: false };
  const corps = {
    name: c.company,
    billing_address: { address: c.address, postal_code: c.zip, city: c.city, country: 'FR' },
    emails: [c.email],
    recipient: c.contact_name,
    external_reference: ref,
    billing_language: 'fr_FR',
  };
  if (c.siren) corps.reg_no = c.siren;
  const d = await appel('POST', '/company_customers', corps);
  return { id: d.id || d.customer_id, cree: true };
}

async function lireClient(id) {
  return appel('GET', `/customers/${encodeURIComponent(id)}`);
}

/* ---------- devis ---------- */

async function creerDevis(corps) {
  return appel('POST', '/quotes', corps);
}
// 409 = PDF pas encore prêt : on réessaie quelques secondes, puis on rend la main.
async function envoyerDevis(id, { essais = 5, attente = 4000 } = {}) {
  for (let i = 1; ; i++) {
    try { await appel('POST', `/quotes/${id}/send_by_email`, {}); return { ok: true }; }
    catch (e) {
      if (e.statut === 409 && i < essais) { await pause(attente); continue; }
      return { ok: false, statut: e.statut, erreur: e.message };
    }
  }
}
async function statutDevis(id, status) {
  return appel('PUT', `/quotes/${id}/update_status`, { status });
}
// Devis récents (date >= depuis), toutes pages (5 au plus)
async function devisRecents(depuisIso) {
  const out = [];
  let curseur = null;
  for (let page = 0; page < 5; page++) {
    const q = [filtre([{ field: 'date', operator: 'gteq', value: depuisIso }]), 'limit=100'];
    if (curseur) q.push('cursor=' + encodeURIComponent(curseur));
    const d = await appel('GET', '/quotes?' + q.join('&'));
    out.push(...elements(d));
    if (!d || !d.has_more || !d.next_cursor) break;
    curseur = d.next_cursor;
  }
  return out;
}

/* ---------- factures ---------- */

async function factureParReference(ref) {
  const d = await appel('GET', '/customer_invoices?' + filtre([{ field: 'external_reference', operator: 'eq', value: ref }]));
  return elements(d)[0] || null;
}
async function creerFactureDepuisDevis(quoteId, ref) {
  return appel('POST', '/customer_invoices/create_from_quote', { quote_id: quoteId, draft: false, external_reference: ref });
}
async function envoyerFacture(id, { essais = 5, attente = 4000 } = {}) {
  for (let i = 1; ; i++) {
    try { await appel('POST', `/customer_invoices/${id}/send_by_email`, {}); return { ok: true }; }
    catch (e) {
      if (e.statut === 409 && i < essais) { await pause(attente); continue; }
      return { ok: false, statut: e.statut, erreur: e.message };
    }
  }
}
async function lireFacture(id) {
  return appel('GET', `/customer_invoices/${id}`);
}
// Payée : booléen `paid` (lu par les connecteurs du marché, non détaillé dans la page de référence),
// sinon statut « paid », sinon reste à payer nul sur une facture finalisée.
function estPayee(f) {
  if (!f) return false;
  if (typeof f.paid === 'boolean') return f.paid;
  if (f.status === 'paid') return true;
  if (f.remaining_amount != null && f.status && f.status !== 'draft') return Number(f.remaining_amount) <= 0;
  return false;
}

const numeroDevis = (q) => (q && (q.quote_number || q.invoice_number || q.label)) || (q && q.id ? 'n° ' + q.id : null);

module.exports = {
  ErreurPennylane, estDryRun, estActif, referenceClient, trouverOuCreerClient, lireClient,
  creerDevis, envoyerDevis, statutDevis, devisRecents,
  factureParReference, creerFactureDepuisDevis, envoyerFacture, lireFacture, estPayee, numeroDevis,
};
