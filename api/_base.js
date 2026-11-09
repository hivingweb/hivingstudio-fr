// Accès à la base Supabase du CRM depuis les fonctions Vercel, avec la clé PUBLIQUE seulement
// (la même que shared/config.js, faite pour être visible : elle ne donne que les droits du visiteur).
// Uniquement ce que le site utilise déjà : lecture de st_options, RPC st_all_busy (disponibilités)
// et RPC st_create_brand_request (demande de réservation, comme /pro/). Jamais de clé service_role,
// jamais de création ou de modification de table depuis ce dépôt.

const URL_BASE = process.env.SUPABASE_URL || 'https://pmrqrbjxikljlarhkseu.supabase.co';
const CLE_PUBLIQUE = process.env.SUPABASE_ANON_KEY || 'sb_publishable_j_kHa-caXfSxkSyeGd-veA_ZdUvNCw8';

class ErreurBase extends Error {
  constructor(message, statut) { super(message); this.statut = statut; }
}

async function appel(chemin, { method = 'GET', corps } = {}) {
  let r;
  try {
    r = await fetch(URL_BASE + chemin, {
      method,
      headers: {
        apikey: CLE_PUBLIQUE, Authorization: `Bearer ${CLE_PUBLIQUE}`,
        'Content-Type': 'application/json', Accept: 'application/json',
      },
      body: corps ? JSON.stringify(corps) : undefined,
    });
  } catch (e) {
    throw new ErreurBase('Base injoignable : ' + (e && e.message), 0);
  }
  const texte = await r.text().catch(() => '');
  let data = null;
  try { data = texte ? JSON.parse(texte) : null; } catch { data = texte; }
  if (!r.ok) {
    const msg = (data && (data.message || data.error)) || texte || ('HTTP ' + r.status);
    throw new ErreurBase(String(msg), r.status);
  }
  return data;
}

// Catalogue des options de /pro/ (lecture publique, comme shared/sb.js)
async function optionsCatalogue() {
  const d = await appel('/rest/v1/st_options?select=id,label,price,unit,active,included');
  return Array.isArray(d) ? d : [];
}

// Créneaux occupés (studio, période, type) entre deux instants
async function occupes(deIso, aIso) {
  const d = await appel('/rest/v1/rpc/st_all_busy', { method: 'POST', corps: { from_ts: deIso, to_ts: aIso } });
  return Array.isArray(d) ? d : [];
}

// Demande de réservation : mêmes paramètres que shared/sb.js (createBrandRequest), rien d'inventé.
async function creerDemande(p) {
  try {
    const d = await appel('/rest/v1/rpc/st_create_brand_request', {
      method: 'POST',
      corps: {
        p_studio_id: p.studio_id, p_date: p.date, p_days: p.days, p_duration: 'full',
        p_keep_set: 'asis', p_production: 'self', p_needs: p.needs || null,
        p_company: p.company, p_contact_name: p.contact_name, p_email: p.email, p_phone: null,
        p_billing_address: p.billing_address || null, p_vat: null, p_siret: p.siret || null,
        p_hours: null, p_options: p.options || [], p_custom: false,
        p_billing_zip: p.billing_zip || null, p_billing_city: p.billing_city || null,
      },
    });
    return Array.isArray(d) ? d[0] : d;
  } catch (e) {
    if (/SLOT_TAKEN/.test(e.message)) throw new ErreurBase('SLOT_TAKEN', 409);
    throw e;
  }
}

module.exports = { ErreurBase, optionsCatalogue, occupes, creerDemande };
