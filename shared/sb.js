// Hiving Studio · couche d'accès données.
// Deux backends : Supabase (CONFIG.MOCK=false) ou mock local en mémoire (démo/dev).
// Toutes les pages passent par cette API · jamais par supabase-js directement.
import { CONFIG } from './config.js';

let sb = null;
async function client(){
  if (sb) return sb;
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  sb = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  return sb;
}
function fail(e){ throw new Error(typeof e === 'string' ? e : (e.message || 'Erreur inattendue')); }

/* ============================ MOCK ============================ */
// Jeu de données réaliste persisté dans localStorage pour que la démo survive aux rechargements.
const LS_KEY = 'hs-mock-v1';
function nowPlus(d, h){ const t = new Date(); t.setDate(t.getDate() + d); t.setHours(h, 0, 0, 0); return t.toISOString(); }
function mkMock(){
  return {
    me: null, // {id, email, name, role}
    profiles: [
      { id: 'u-admin', email: 'admin@exemple.fr', name: 'Admin', role: 'admin', house: null },
      { id: 'u-lea',   email: 'lea@exemple.fr',    name: 'Léa',    role: 'creator', house: 'hiving' },
      { id: 'u-marco', email: 'marco@exemple.fr',  name: 'Marco',  role: 'creator', house: 'food' },
      { id: 'u-sofia', email: 'sofia@exemple.fr',  name: 'Sofia',  role: 'creator', house: 'food' },
    ],
    allowed: [
      { email: 'admin@exemple.fr', name: 'Admin', role: 'admin', house: null },
      { email: 'lea@exemple.fr', name: 'Léa', role: 'creator', house: 'hiving' },
      { email: 'marco@exemple.fr', name: 'Marco', role: 'creator', house: 'food' },
      { email: 'sofia@exemple.fr', name: 'Sofia', role: 'creator', house: 'food' },
    ],
    bookings: [
      { id: 'b1', studio_id: 'pro',       starts_at: nowPlus(1, 9),  ends_at: nowPlus(1, 13), kind: 'creator', status: 'active', user_id: 'u-lea',   title: 'Tournage hebdo' },
      { id: 'b2', studio_id: 'famille',   starts_at: nowPlus(2, 14), ends_at: nowPlus(2, 18), kind: 'creator', status: 'active', user_id: 'u-marco', title: 'Recettes de saison' },
      { id: 'b3', studio_id: 'famille',   starts_at: nowPlus(3, 8),  ends_at: nowPlus(3, 22), kind: 'brand',   status: 'active', user_id: null,       title: 'Marque · confidentiel', brand_request_id: 'q1' },
      { id: 'b4', studio_id: 'pro',       starts_at: nowPlus(-2, 15), ends_at: nowPlus(-2, 19), kind: 'creator', status: 'active', user_id: 'u-sofia', title: 'Collab fromages' },
    ],
    reviews: [],
    urgent: [],
    brandRequests: [
      { id: 'q1', studio_id: 'famille',   date: nowPlus(3, 8).slice(0, 10), days: 1, duration: 'full',
        keep_set: 'asis', production: 'self', needs: '', company: 'Maison Verte', contact_name: 'Camille R.',
        email: 'camille@exemple.fr', phone: '06 00 00 00 00', billing_address: '12 rue du Bac, Paris',
        vat: 'FR00123456789', siret: '', status: 'confirmed', quote_number: 'HS-2026-0001', quote_total: 450,
        created_at: new Date().toISOString() },
    ],
    options: [
      { id: 'o1',  label: 'Package Lumière : 2 lumières continues + softbox 70 cm + 2 panneaux LED', price: 150, unit: 'day', category: 'lumiere',    included: false, sort: 1,  active: true },
      { id: 'o2',  label: 'Lanterne 90 cm',                 price: 10,  unit: 'day', category: 'lumiere',    included: false, sort: 2,  active: true, image: 'lanterne-90.webp' },
      { id: 'o3',  label: 'Softbox parabolique 85 cm',      price: 10,  unit: 'day', category: 'lumiere',    included: false, sort: 3,  active: true, image: 'softbox-85.webp' },
      { id: 'o4',  label: 'Softbox parabolique 120 cm',     price: 10,  unit: 'day', category: 'lumiere',    included: false, sort: 4,  active: true, image: 'softbox-85.webp' },
      { id: 'o5',  label: 'Projecteur LED RGB 130 W',       price: 25,  unit: 'day', category: 'lumiere',    included: false, sort: 5,  active: true, image: 'projecteur-rgb-130.webp' },
      { id: 'o6',  label: 'Projecteur LED 600 W',           price: 60,  unit: 'day', category: 'lumiere',    included: false, sort: 6,  active: true, image: 'projecteur-600.webp' },
      { id: 'o7',  label: 'Projecteur LED 150 W',           price: 25,  unit: 'day', category: 'lumiere',    included: false, sort: 7,  active: true, image: 'projecteur-150.webp' },
      { id: 'o8',  label: 'Stick lumineux magnétique',      price: 5,   unit: 'day', category: 'lumiere',    included: false, sort: 8,  active: true, image: 'stick-magnetique.webp' },
      { id: 'o9',  label: 'Stick RGB 20 W',                 price: 15,  unit: 'day', category: 'lumiere',    included: false, sort: 9,  active: true, image: 'stick-rgb-20.webp' },
      { id: 'o10', label: 'Caméra Sony FX30 Cinema Line',   price: 100, unit: 'day', category: 'camera',     included: false, sort: 10, active: true, image: 'fx30.webp' },
      { id: 'o11', label: 'Caméra Sony FX3 plein format',   price: 200, unit: 'day', category: 'camera',     included: false, sort: 11, active: true, image: 'fx3.webp' },
      { id: 'o12', label: 'Objectif Laowa 24 mm Macro Probe', price: 180, unit: 'day', category: 'optique',  included: false, sort: 12, active: true, image: 'laowa-macro.webp' },
      { id: 'o13', label: 'Objectif Sony 12-24 mm F2.8 GM', price: 100, unit: 'day', category: 'optique',    included: false, sort: 13, active: true, image: 'sony-12-24.webp' },
      { id: 'o14', label: 'Objectif Sony 24-70 mm F2.8 GM', price: 65,  unit: 'day', category: 'optique',    included: false, sort: 14, active: true, image: 'sony-24-70.webp' },
      { id: 'o15', label: 'Stabilisateur DJI RS 4',         price: 30,  unit: 'day', category: 'accessoire', included: false, sort: 15, active: true, image: 'dji-rs4.webp' },
      { id: 'o16', label: 'Trépied 200 cm',                 price: 5,   unit: 'day', category: 'accessoire', included: false, sort: 16, active: true, image: 'trepied-200.webp' },
      { id: 'o17', label: 'Trépied vidéo pro',              price: 7,   unit: 'day', category: 'accessoire', included: false, sort: 17, active: true, image: 'trepied-video.webp' },
      { id: 'o18', label: 'Moniteur terrain 7 pouces',      price: 25,  unit: 'day', category: 'accessoire', included: false, sort: 18, active: true, image: 'moniteur-7.webp' },
      { id: 'o19', label: 'Rail caméra motorisé',           price: 25,  unit: 'day', category: 'accessoire', included: false, sort: 19, active: true, image: 'rail-motorise.webp' },
      { id: 'o20', label: 'Support caméra aérien',          price: 10,  unit: 'day', category: 'accessoire', included: false, sort: 20, active: true, image: 'support-aerien.webp' },
      { id: 'o21', label: 'Machine à fumée',                price: 5,   unit: 'day', category: 'accessoire', included: false, sort: 21, active: true, image: 'machine-fumee.webp' },
    ],
    quoteSeq: 2,
  };
}
function loadMock(){
  try { const s = localStorage.getItem(LS_KEY); if (s) return JSON.parse(s); } catch (e) {}
  return mkMock();
}
function saveMock(){ try { localStorage.setItem(LS_KEY, JSON.stringify(M)); } catch (e) {} }
const M = CONFIG.MOCK ? loadMock() : null;
const uid = () => 'id-' + Math.random().toString(36).slice(2, 10);
const overlap = (a0, a1, b0, b1) => new Date(a0) < new Date(b1) && new Date(b0) < new Date(a1);
function mockDelay(x){ return new Promise(r => setTimeout(() => r(x), 120)); }

/* ============================ API ============================ */

export const api = {

  /* ---------- auth ---------- */
  async getSession(){
    if (CONFIG.MOCK) return M.me;
    const c = await client();
    const { data: { session } } = await c.auth.getSession();
    if (!session) return null;
    try {
      const { data, error } = await c.rpc('st_ensure_profile');
      if (error) { if ((error.message || '').includes('EMAIL_NOT_ALLOWED')) return { notAllowed: true, email: session.user.email }; fail(error); }
      const codeSet = session.user?.user_metadata?.code_set === true;
      return { ...data, needsCode: !codeSet };   // 1re connexion : code pas encore choisi
    } catch (e) { if (String(e).includes('EMAIL_NOT_ALLOWED')) return { notAllowed: true, email: session.user.email }; throw e; }
  },
  // Connexion par email + mot de passe (aucun mail nécessaire). Session mémorisée par le navigateur.
  async signInPassword(email, password){
    if (CONFIG.MOCK){
      const p = M.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (!p) fail('BAD_CREDENTIALS');
      M.pwd = M.pwd || {};
      if (M.pwd[p.email] && M.pwd[p.email] !== password) fail('BAD_CREDENTIALS');
      if (!M.pwd[p.email]) M.pwd[p.email] = password;    // démo : 1re connexion fixe le mot de passe
      M.me = p; saveMock();
      return mockDelay({ ok: true });
    }
    const c = await client();
    const { error } = await c.auth.signInWithPassword({ email, password });
    if (error){
      if (/invalid login credentials/i.test(error.message)) fail('BAD_CREDENTIALS');
      fail(error);
    }
    const { error: e2 } = await c.rpc('st_ensure_profile');
    if (e2 && (e2.message || '').includes('EMAIL_NOT_ALLOWED')){ await c.auth.signOut(); fail('EMAIL_NOT_ALLOWED'); }
    return { ok: true };
  },
  // Première connexion : on envoie un mail de validation (l'email doit être dans la liste).
  async sendInvite(email){
    if (CONFIG.MOCK){
      const p = M.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (!p) fail('EMAIL_NOT_ALLOWED');
      M.pwd = M.pwd || {}; delete M.pwd[p.email];
      M.me = { ...p, needsCode: true }; saveMock();       // démo : simule le clic sur le lien
      return mockDelay({ mockInvite: true });
    }
    const c = await client();
    const { data: allowed, error: e0 } = await c.rpc('st_email_allowed', { em: email });
    if (e0) fail(e0);
    if (!allowed) fail('EMAIL_NOT_ALLOWED');
    const { error } = await c.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: location.href.split('#')[0].split('?')[0] } });
    if (error) fail(error);
    return { sent: true };
  },
  async resetPassword(email){
    if (CONFIG.MOCK) return mockDelay({ sent: true });
    const c = await client();
    const { error } = await c.auth.resetPasswordForEmail(email, { redirectTo: location.href.split('#')[0].split('?')[0] });
    if (error) fail(error);
    return { sent: true };
  },
  // Définir son code (1re connexion depuis le lien, ou après « code oublié »).
  async updatePassword(newPassword){
    if (CONFIG.MOCK){ if (M.me){ M.me.needsCode = false; M.pwd = M.pwd || {}; M.pwd[M.me.email] = newPassword; saveMock(); } return mockDelay(true); }
    const c = await client();
    const { error } = await c.auth.updateUser({ password: newPassword, data: { code_set: true } });
    if (error) fail(error);
    return true;
  },
  async signOut(){
    if (CONFIG.MOCK){ M.me = null; saveMock(); return; }
    const c = await client(); await c.auth.signOut();
  },
  onAuthChange(cb){
    if (CONFIG.MOCK) return;
    client().then(c => c.auth.onAuthStateChange((event) => cb(event)));
  },

  /* ---------- studios ---------- */
  async studios(){
    if (CONFIG.MOCK) return CONFIG.STUDIOS_FALLBACK;
    const c = await client();
    const { data, error } = await c.from('st_studios').select('*').order('sort');
    if (error) fail(error);
    // on n'affiche que les studios actifs (colonne active ; absente = actif). Lifestyle est désactivé.
    const live = (data || []).filter(s => s.active !== false);
    return live.length ? live : CONFIG.STUDIOS_FALLBACK;
  },

  /* ---------- catalogue d'options (matériel / lumière à prix fixes) ---------- */
  // Lecture publique (utilisée par le wizard marque). Renvoie tout le catalogue trié.
  async options(){
    if (CONFIG.MOCK) return (M.options || []).slice().sort((a, b) => a.sort - b.sort);
    const c = await client();
    const { data, error } = await c.from('st_options').select('*').order('sort');
    if (error){
      // table pas encore créée (upgrade-10 non appliqué) : on n'affiche simplement aucune option
      if (/st_options|schema cache|does not exist/i.test(error.message || '')) return [];
      fail(error);
    }
    return data || [];
  },
  // Écriture réservée aux admins (RLS). o = {id?, label, price, unit, category, included, sort, active}.
  async optionSave(o){
    const row = {
      label: String(o.label || '').trim(),
      price: Number(o.price) || 0,
      unit: o.unit === 'flat' ? 'flat' : 'day',
      category: o.category || 'materiel',
      included: !!o.included,
      sort: Number(o.sort) || 0,
      active: o.active !== false,
    };
    if (CONFIG.MOCK){
      if (o.id){ const x = M.options.find(p => p.id === o.id); if (x) Object.assign(x, row); }
      else M.options.push({ id: uid(), ...row });
      saveMock(); return;
    }
    const c = await client();
    const q = o.id ? c.from('st_options').update(row).eq('id', o.id) : c.from('st_options').insert(row);
    const { error } = await q; if (error) fail(error);
  },
  async optionRemove(id){
    if (CONFIG.MOCK){ M.options = M.options.filter(p => p.id !== id); saveMock(); return; }
    const c = await client();
    const { error } = await c.from('st_options').delete().eq('id', id); if (error) fail(error);
  },

  /* ---------- créateurs : calendrier & créneaux ---------- */
  async bookings(fromISO, toISO){
    if (CONFIG.MOCK){
      return mockDelay(M.bookings
        .filter(b => b.status === 'active' && overlap(b.starts_at, b.ends_at, fromISO, toISO))
        .map(b => ({ ...b, profile: M.profiles.find(p => p.id === b.user_id) || null })));
    }
    const c = await client();
    const { data, error } = await c.from('st_bookings')
      .select('*, profile:st_profiles(name, email)')
      .eq('status', 'active').lt('starts_at', toISO).gt('ends_at', fromISO);
    if (error) fail(error);
    return data;
  },
  async createBooking({ studio_id, starts_at, ends_at, title }){
    if (CONFIG.MOCK){
      if (!M.me) fail('Non connecté');
      if (await this._mockPendingReview()) fail('REVIEW_PENDING');
      const clash = M.bookings.find(b => b.status === 'active' && b.studio_id === studio_id && overlap(b.starts_at, b.ends_at, starts_at, ends_at));
      if (clash) fail('Ce créneau chevauche une réservation existante.');
      const bk = { id: uid(), studio_id, starts_at, ends_at, kind: 'creator', status: 'active', user_id: M.me.id, title: title || 'Tournage' };
      M.bookings.push(bk); saveMock();
      return mockDelay(bk);
    }
    const c = await client();
    const { data: { user } } = await c.auth.getUser();
    const { data, error } = await c.from('st_bookings')
      .insert({ studio_id, starts_at, ends_at, kind: 'creator', user_id: user.id, title: title || 'Tournage' })
      .select().single();
    if (error){
      const m = error.message || '';
      if (m.includes('st_no_overlap')) fail('Ce créneau chevauche une réservation existante.');
      if (m.includes('row-level security')) fail('REVIEW_PENDING');
      fail(error);
    }
    return data;
  },
  async cancelBooking(id){
    if (CONFIG.MOCK){
      const b = M.bookings.find(b => b.id === id && b.user_id === M.me?.id);
      if (!b) fail('Créneau introuvable');
      b.status = 'cancelled';
      M.urgent.forEach(u => { if (u.booking_id === id && u.status === 'pending'){ u.status = 'cancelled'; } });
      saveMock();
      return mockDelay(true);
    }
    const c = await client();
    const { error } = await c.from('st_bookings').update({ status: 'cancelled' }).eq('id', id);
    if (error) fail(error);
    return true;
  },
  async myBookings(){
    if (CONFIG.MOCK){
      if (!M.me) return [];
      return mockDelay(M.bookings.filter(b => b.user_id === M.me.id && b.status !== 'cancelled')
        .sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at))
        .map(b => ({ ...b, reviewed: M.reviews.some(r => r.booking_id === b.id) })));
    }
    const c = await client();
    const { data: { user } } = await c.auth.getUser();
    const { data, error } = await c.from('st_bookings')
      .select('*, review:st_reviews(id)')
      .eq('user_id', user.id).neq('status', 'cancelled')
      .order('starts_at', { ascending: false });
    if (error) fail(error);
    const done = b => b.review && (Array.isArray(b.review) ? b.review.length > 0 : true);
    return data.map(b => ({ ...b, reviewed: !!done(b) }));
  },

  /* ---------- reviews bloquantes ---------- */
  async _mockPendingReview(){
    if (!M.me) return false;
    return M.bookings.some(b => b.user_id === M.me.id && b.kind === 'creator' && b.status === 'active'
      && new Date(b.ends_at) < new Date() && !M.reviews.some(r => r.booking_id === b.id));
  },
  async pendingReviews(){
    if (CONFIG.MOCK){
      if (!M.me) return [];
      return mockDelay(M.bookings.filter(b => b.user_id === M.me.id && b.kind === 'creator' && b.status === 'active'
        && new Date(b.ends_at) < new Date() && !M.reviews.some(r => r.booking_id === b.id)));
    }
    const c = await client();
    const { data: { user } } = await c.auth.getUser();
    const { data, error } = await c.from('st_bookings')
      .select('*, review:st_reviews(id)')
      .eq('user_id', user.id).eq('kind', 'creator').eq('status', 'active')
      .lt('ends_at', new Date().toISOString());
    if (error) fail(error);
    return data.filter(b => !(b.review && (Array.isArray(b.review) ? b.review.length > 0 : true)));
  },
  async submitReview({ booking_id, stars_clean, stars_equipment, breakage, missing, note }){
    if (CONFIG.MOCK){
      M.reviews.push({ id: uid(), booking_id, user_id: M.me.id, stars_clean, stars_equipment, breakage, missing, note, created_at: new Date().toISOString() });
      saveMock();
      return mockDelay(true);
    }
    const c = await client();
    const { data: { user } } = await c.auth.getUser();
    const { error } = await c.from('st_reviews').insert({ booking_id, user_id: user.id, stars_clean, stars_equipment, breakage, missing: missing || null, note });
    if (error) fail(error);
    return true;
  },

  /* ---------- urgences ---------- */
  async createUrgent(booking_id, message){
    if (CONFIG.MOCK){
      M.urgent.push({ id: uid(), booking_id, requester_id: M.me.id, message, status: 'pending', created_at: new Date().toISOString() });
      saveMock();
      return mockDelay(true);
    }
    const c = await client();
    const { data: { user } } = await c.auth.getUser();
    const { error } = await c.from('st_urgent_requests').insert({ booking_id, requester_id: user.id, message });
    if (error) fail(error);
    return true;
  },
  async urgentInbox(){
    if (CONFIG.MOCK){
      if (!M.me) return [];
      return mockDelay(M.urgent
        .filter(u => { const b = M.bookings.find(b => b.id === u.booking_id); return b && b.user_id === M.me.id; })
        .map(u => ({ ...u,
          booking: M.bookings.find(b => b.id === u.booking_id),
          requester: M.profiles.find(p => p.id === u.requester_id) })));
    }
    const c = await client();
    const { data: { user } } = await c.auth.getUser();
    const { data, error } = await c.from('st_urgent_requests')
      .select('*, booking:st_bookings!inner(*), requester:st_profiles!st_urgent_requests_requester_id_fkey(name, email)')
      .eq('booking.user_id', user.id);
    if (error) fail(error);
    return data;
  },
  async urgentSent(){
    if (CONFIG.MOCK){
      if (!M.me) return [];
      return mockDelay(M.urgent.filter(u => u.requester_id === M.me.id)
        .map(u => ({ ...u, booking: M.bookings.find(b => b.id === u.booking_id) })));
    }
    const c = await client();
    const { data: { user } } = await c.auth.getUser();
    const { data, error } = await c.from('st_urgent_requests')
      .select('*, booking:st_bookings(*)').eq('requester_id', user.id);
    if (error) fail(error);
    return data;
  },
  async respondUrgent(id, accept){
    if (CONFIG.MOCK){
      const u = M.urgent.find(u => u.id === id);
      if (!u || u.status !== 'pending') fail('Demande déjà traitée');
      if (accept){
        const b = M.bookings.find(b => b.id === u.booking_id);
        b.status = 'cancelled';
        M.bookings.push({ id: uid(), studio_id: b.studio_id, starts_at: b.starts_at, ends_at: b.ends_at, kind: 'creator', status: 'active', user_id: u.requester_id, title: 'Projet urgent' });
        u.status = 'accepted';
        M.urgent.forEach(o => { if (o.booking_id === b.id && o.id !== u.id && o.status === 'pending') o.status = 'cancelled'; });
      } else { u.status = 'declined'; }
      u.resolved_at = new Date().toISOString(); saveMock();
      return mockDelay(true);
    }
    const c = await client();
    if (accept){
      const { error } = await c.rpc('st_accept_urgent', { req_id: id });
      if (error) fail(error);
    } else {
      const { error } = await c.from('st_urgent_requests').update({ status: 'declined', resolved_at: new Date().toISOString() }).eq('id', id);
      if (error) fail(error);
    }
    return true;
  },

  /* ---------- état du plateau + consommables ---------- */
  async lastState(studioId){
    if (CONFIG.MOCK){
      const revs = M.reviews
        .map(r => ({ ...r, studio_id: (M.bookings.find(b => b.id === r.booking_id) || {}).studio_id, author: (M.profiles.find(p => p.id === r.user_id) || {}).name }))
        .filter(r => r.studio_id === studioId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return mockDelay(revs[0] || null);
    }
    const c = await client();
    const { data, error } = await c.rpc('st_last_state', { p_studio: studioId });
    if (error) fail(error);
    return (data && data[0]) || null;
  },
  async supplies(studioId){
    if (CONFIG.MOCK){
      M.supplies = M.supplies || [];
      return mockDelay(M.supplies.filter(s => s.studio_id === studioId)
        .map(s => ({ ...s, author: (M.profiles.find(p => p.id === s.added_by) || {}).name || '—', resolver: (M.profiles.find(p => p.id === s.resolved_by) || {}).name || null }))
        .sort((a, b) => (b.status === 'open') - (a.status === 'open') || new Date(b.created_at) - new Date(a.created_at)));
    }
    const c = await client();
    const { data, error } = await c.rpc('st_supplies_of', { p_studio: studioId });
    if (error) fail(error);
    return data;
  },
  async addSupply(studioId, item){
    if (CONFIG.MOCK){
      M.supplies = M.supplies || [];
      const s = { id: uid(), studio_id: studioId, item, status: 'open', source: 'creator', added_by: M.me?.id, created_at: new Date().toISOString(), resolved_by: null, resolved_at: null };
      M.supplies.push(s); saveMock();
      return mockDelay(s);
    }
    const c = await client();
    const { data: { user } } = await c.auth.getUser();
    const { error } = await c.from('st_supplies').insert({ studio_id: studioId, item, added_by: user.id });
    if (error) fail(error);
    return true;
  },
  async resolveSupply(id, done){
    if (CONFIG.MOCK){
      const s = (M.supplies || []).find(s => s.id === id);
      if (s){ s.status = done ? 'done' : 'open'; s.resolved_by = done ? M.me?.id : null; s.resolved_at = done ? new Date().toISOString() : null; saveMock(); }
      return mockDelay(true);
    }
    const c = await client();
    const { data: { user } } = await c.auth.getUser();
    const { error } = await c.from('st_supplies')
      .update({ status: done ? 'done' : 'open', resolved_by: done ? user.id : null, resolved_at: done ? new Date().toISOString() : null })
      .eq('id', id);
    if (error) fail(error);
    return true;
  },
  async shopUrl(){
    if (CONFIG.MOCK) return M.shopUrl || '';
    const c = await client();
    const { data, error } = await c.rpc('st_shop_url');
    if (error) return '';
    return data || '';
  },
  // Consommables ouverts, TOUS studios (chaque créateur voit l'état global).
  async openSupplies(){
    if (CONFIG.MOCK){
      M.supplies = M.supplies || [];
      const nm = id => (CONFIG.STUDIOS_FALLBACK.find(s => s.id === id) || {}).name || id;
      return mockDelay(M.supplies.filter(s => s.status === 'open')
        .map(s => ({ studio_id: s.studio_id, studio_name: nm(s.studio_id), item: s.item, author: (M.profiles.find(p => p.id === s.added_by) || {}).name || '—', created_at: s.created_at })));
    }
    const c = await client();
    const { data, error } = await c.rpc('st_open_supplies');
    if (error) fail(error);
    return data;
  },
  async allLastState(){
    if (CONFIG.MOCK){
      const out = {};
      M.reviews.forEach(r => { const b = M.bookings.find(b => b.id === r.booking_id); if (!b) return; const cur = out[b.studio_id]; if (!cur || new Date(r.created_at) > new Date(cur.created_at)) out[b.studio_id] = { studio_id: b.studio_id, note: r.note, missing: r.missing, stars_clean: r.stars_clean, breakage: r.breakage, created_at: r.created_at, author: (M.profiles.find(p => p.id === r.user_id) || {}).name || 'un créateur' }; });
      return mockDelay(Object.values(out));
    }
    const c = await client();
    const { data, error } = await c.rpc('st_all_last_state');
    if (error) fail(error);
    return data;
  },

  /* ---------- mur des membres : notes partagées (temps réel) ---------- */
  async notesList(limit){
    if (CONFIG.MOCK){
      M.notes = M.notes || [];
      const nm = id => (CONFIG.STUDIOS_FALLBACK.find(s => s.id === id) || {}).name || null;
      return mockDelay([...M.notes]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit || 60)
        .map(n => ({ ...n, studio_name: nm(n.studio_id), author: (M.profiles.find(p => p.id === n.author_id) || {}).name || 'un membre' })));
    }
    const c = await client();
    const { data, error } = await c.rpc('st_notes_list', { p_limit: limit || 60 });
    if (error) fail(error);
    return data;
  },
  async noteAdd(body, studio_id){
    if (CONFIG.MOCK){
      M.notes = M.notes || [];
      const rec = { id: uid(), body: String(body).trim().slice(0, 500), studio_id: studio_id || null, author_id: M.me?.id || null, created_at: new Date().toISOString() };
      M.notes.unshift(rec); saveMock(); return mockDelay(rec);
    }
    const c = await client();
    const { data, error } = await c.rpc('st_note_add', { p_body: body, p_studio: studio_id || null });
    if (error) fail(error);
    return data;
  },
  async noteDelete(id){
    if (CONFIG.MOCK){ M.notes = (M.notes || []).filter(n => n.id !== id); saveMock(); return mockDelay(true); }
    const c = await client();
    const { error } = await c.rpc('st_note_delete', { p_id: id });
    if (error) fail(error);
    return true;
  },
  // abonnement temps réel : cb() est appelé à chaque nouvelle note. Renvoie une fonction de désabonnement.
  async onNotesChange(cb){
    if (CONFIG.MOCK) return () => {};
    const c = await client();
    const ch = c.channel('st_notes_feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'st_notes' }, () => cb())
      .subscribe();
    return () => { try { c.removeChannel(ch); } catch (e) {} };
  },

  /* ---------- marques (public) ---------- */
  async brandBusy(fromISO, toISO){
    if (CONFIG.MOCK){
      return mockDelay(M.bookings
        .filter(b => b.kind === 'brand' && b.status === 'active' && overlap(b.starts_at, b.ends_at, fromISO, toISO))
        .map(b => ({ studio_id: b.studio_id, starts_at: b.starts_at, ends_at: b.ends_at })));
    }
    const c = await client();
    const { data, error } = await c.rpc('st_brand_busy', { from_ts: fromISO, to_ts: toISO });
    if (error) fail(error);
    return data;
  },
  // Occupé TOUT confondu. On expose seulement le TYPE d'occupant ('creator'|'brand'|'block'),
  // jamais l'identité : la marque voit qu'un créneau est pris, et par quel genre d'occupant.
  async allBusy(fromISO, toISO){
    if (CONFIG.MOCK){
      return mockDelay(M.bookings
        .filter(b => b.status === 'active' && overlap(b.starts_at, b.ends_at, fromISO, toISO))
        .map(b => ({ studio_id: b.studio_id, starts_at: b.starts_at, ends_at: b.ends_at, kind: b.kind || null })));
    }
    const c = await client();
    const { data, error } = await c.rpc('st_all_busy', { from_ts: fromISO, to_ts: toISO });
    if (error){
      // avant upgrade-11 : seuls les créneaux marques sont visibles
      if (/st_all_busy|does not exist|schema cache/i.test(error.message || '')){
        return (await this.brandBusy(fromISO, toISO)).map(b => ({ ...b, kind: 'brand' }));
      }
      fail(error);
    }
    // avant upgrade-13 la fonction ne renvoie pas kind : null = neutre (gris), jamais « autre marque »
    return (data || []).map(b => ({ ...b, kind: b.kind || null }));
  },
  async createBrandRequest(payload){
    if (CONFIG.MOCK){
      const studio = CONFIG.STUDIOS_FALLBACK.find(s => s.id === payload.studio_id);
      const opts = payload.options || [];
      // total des options recalculé depuis le catalogue mock (comme le serveur depuis st_options)
      let ot = 0;
      for (const o of opts){
        const ref = (M.options || []).find(x => x.id === o.id);
        if (ref) ot += ref.price * (ref.unit === 'day' ? (payload.days || 1) : 1);
      }
      const isQuote = !!payload.custom || payload.duration === 'custom';   // sur-mesure / horaires perso → devis
      const studioTotal = String(payload.duration).startsWith('half') ? Math.round(studio.price_day * 0.6) : studio.price_day * (payload.days || 1);
      const req = { ...payload, id: uid(), status: isQuote ? 'new' : 'confirmed',
        quote_number: 'HS-2026-' + String(M.quoteSeq++).padStart(4, '0'),
        quote_total: isQuote ? null : studioTotal + ot, doc_type: isQuote ? 'quote' : 'invoice',
        options: opts, created_at: new Date().toISOString() };
      // facture standard → réservation FERME du créneau (si libre, sans bump)
      if (!isQuote){
        const [y, m, d] = payload.date.split('-').map(Number);
        const t0 = new Date(y, m - 1, d, payload.duration === 'half-pm' ? 14 : 8);
        const t1 = new Date(y, m - 1, d + (payload.duration === 'full' ? (payload.days || 1) - 1 : 0), (payload.duration === 'half' || payload.duration === 'half-am') ? 14 : 22);
        const s0 = t0.toISOString(), s1 = t1.toISOString();
        if (M.bookings.some(b => b.status === 'active' && b.studio_id === payload.studio_id && overlap(b.starts_at, b.ends_at, s0, s1))) fail('SLOT_TAKEN');
        M.bookings.push({ id: uid(), studio_id: payload.studio_id, starts_at: s0, ends_at: s1, kind: 'brand', status: 'active', user_id: null, title: payload.company, brand_request_id: req.id });
      }
      M.brandRequests.push(req); saveMock();
      return mockDelay(req);
    }
    const c = await client();
    const { data, error } = await c.rpc('st_create_brand_request', {
      p_studio_id: payload.studio_id, p_date: payload.date, p_days: payload.days || 1, p_duration: payload.duration,
      p_keep_set: payload.keep_set || 'asis', p_production: payload.production || 'self', p_needs: payload.needs || null,
      p_company: payload.company, p_contact_name: payload.contact_name, p_email: payload.email, p_phone: payload.phone || null,
      p_billing_address: payload.billing_address || null, p_vat: payload.vat || null, p_siret: payload.siret || null,
      p_hours: payload.hours || null,
      p_options: payload.options || [], p_custom: !!payload.custom,
      p_billing_zip: payload.billing_zip || null, p_billing_city: payload.billing_city || null,
    });
    if (error){ if (/SLOT_TAKEN/.test(error.message || '')) fail('SLOT_TAKEN'); fail(error); }
    return Array.isArray(data) ? data[0] : data;
  },
  async getQuote(id){
    if (CONFIG.MOCK){
      const r = M.brandRequests.find(r => r.id === id);
      if (!r) fail('Devis introuvable');
      const s = CONFIG.STUDIOS_FALLBACK.find(s => s.id === r.studio_id);
      return mockDelay({ ...r, studio_name: s.name, price_day: s.price_day });
    }
    const c = await client();
    const { data, error } = await c.rpc('st_get_quote', { qid: id });
    if (error) fail(error);
    if (!data || !data.length) fail('Devis introuvable');
    return data[0];
  },

  /* ---------- admin ---------- */
  async adminBrandRequests(){
    if (CONFIG.MOCK) return mockDelay([...M.brandRequests].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    const c = await client();
    const { data, error } = await c.from('st_brand_requests').select('*').order('created_at', { ascending: false });
    if (error) fail(error);
    return data;
  },
  async adminConfirmBrand(id){
    if (CONFIG.MOCK){
      const r = M.brandRequests.find(r => r.id === id);
      if (!r || r.status !== 'new') fail('Demande déjà traitée');
      const t0 = new Date(r.date + (r.duration === 'half-pm' ? 'T14:00:00' : 'T08:00:00'));
      const t1 = (r.duration === 'half' || r.duration === 'half-am') ? new Date(r.date + 'T14:00:00')
        : r.duration === 'half-pm' ? new Date(r.date + 'T22:00:00')
        : new Date(new Date(r.date + 'T22:00:00').getTime() + (r.days - 1) * 86400000);
      const bumped = M.bookings.filter(b => b.studio_id === r.studio_id && b.kind === 'creator' && b.status === 'active'
        && overlap(b.starts_at, b.ends_at, t0.toISOString(), t1.toISOString()));
      bumped.forEach(b => b.status = 'bumped');
      M.bookings.push({ id: uid(), studio_id: r.studio_id, starts_at: t0.toISOString(), ends_at: t1.toISOString(), kind: 'brand', status: 'active', user_id: null, brand_request_id: r.id, title: r.company });
      r.status = 'confirmed'; saveMock();
      return mockDelay(bumped.map(b => { const p = M.profiles.find(p => p.id === b.user_id); return { bumped_email: p?.email, bumped_name: p?.name, bumped_start: b.starts_at }; }));
    }
    const c = await client();
    const { data, error } = await c.rpc('st_confirm_brand', { req_id: id });
    if (error) fail(error);
    return data || [];
  },
  async adminDeclineBrand(id){
    if (CONFIG.MOCK){
      const r = M.brandRequests.find(r => r.id === id); if (r) r.status = 'declined'; saveMock();
      return mockDelay(true);
    }
    const c = await client();
    const { error } = await c.from('st_brand_requests').update({ status: 'declined' }).eq('id', id);
    if (error) fail(error);
    return true;
  },
  // Annuler la confirmation d'une résa marque : on libère le créneau et on repasse la demande
  // en « à traiter » (new) pour pouvoir la re-confirmer ou la décliner.
  async adminCancelBrand(id){
    if (CONFIG.MOCK){
      (M.bookings || []).filter(b => b.brand_request_id === id && b.kind === 'brand' && b.status === 'active')
        .forEach(b => b.status = 'cancelled');
      const r = M.brandRequests.find(r => r.id === id); if (r) r.status = 'new';
      saveMock(); return mockDelay(true);
    }
    const c = await client();
    const { data: bks, error: e1 } = await c.from('st_bookings').select('id')
      .eq('brand_request_id', id).eq('kind', 'brand').eq('status', 'active');
    if (e1) fail(e1);
    for (const b of (bks || [])){ const { error } = await c.rpc('st_admin_cancel', { p_id: b.id }); if (error) fail(error); }
    const { error: e2 } = await c.from('st_brand_requests').update({ status: 'new' }).eq('id', id);
    if (e2) fail(e2);
    return true;
  },
  async adminReviews(){
    if (CONFIG.MOCK){
      return mockDelay(M.reviews.map(r => ({ ...r,
        booking: M.bookings.find(b => b.id === r.booking_id),
        profile: M.profiles.find(p => p.id === r.user_id) }))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    }
    const c = await client();
    const { data, error } = await c.from('st_reviews')
      .select('*, booking:st_bookings(studio_id, starts_at, ends_at), profile:st_profiles(name, email)')
      .order('created_at', { ascending: false });
    if (error) fail(error);
    return data;
  },
  async adminUrgent(){
    if (CONFIG.MOCK){
      return mockDelay(M.urgent.map(u => ({ ...u,
        booking: M.bookings.find(b => b.id === u.booking_id),
        requester: M.profiles.find(p => p.id === u.requester_id) })));
    }
    const c = await client();
    const { data, error } = await c.from('st_urgent_requests')
      .select('*, booking:st_bookings(*), requester:st_profiles!st_urgent_requests_requester_id_fkey(name, email)')
      .order('created_at', { ascending: false });
    if (error) fail(error);
    return data;
  },
  // Admin : poser un créneau marque / bloquer un créneau (ménage, maintenance…).
  async adminBook({ studio_id, starts_at, ends_at, kind, title }){
    if (CONFIG.MOCK){
      const overlap = M.bookings.some(b => b.studio_id === studio_id && b.status === 'active'
        && new Date(b.starts_at) < new Date(ends_at) && new Date(b.ends_at) > new Date(starts_at));
      if (overlap) fail('OVERLAP');
      const bk = { id: 'bk' + (M.bookings.length + 1) + '_' + String(starts_at).slice(0,10), studio_id, starts_at, ends_at, kind, status: 'active', title: title || null, user_id: null };
      M.bookings.push(bk); saveMock(); return mockDelay(bk);
    }
    const c = await client();
    const { data, error } = await c.rpc('st_admin_book', { p_studio: studio_id, p_starts: starts_at, p_ends: ends_at, p_kind: kind, p_title: title || null });
    if (error) fail(error);
    return data;
  },
  async adminCancel(id){
    if (CONFIG.MOCK){ const b = M.bookings.find(b => b.id === id); if (b) b.status = 'cancelled'; saveMock(); return mockDelay(true); }
    const c = await client();
    const { error } = await c.rpc('st_admin_cancel', { p_id: id });
    if (error) fail(error);
    return true;
  },
  // Admin : déplacer / éditer un créneau (studio, horaires, libellé) — comme Google Agenda.
  async adminMove({ id, studio_id, starts_at, ends_at, title }){
    if (CONFIG.MOCK){
      const overlap = M.bookings.some(b => b.id !== id && b.studio_id === studio_id && b.status === 'active'
        && new Date(b.starts_at) < new Date(ends_at) && new Date(b.ends_at) > new Date(starts_at));
      if (overlap) fail('OVERLAP');
      const b = M.bookings.find(x => x.id === id);
      if (!b) fail('Créneau introuvable');
      b.studio_id = studio_id; b.starts_at = starts_at; b.ends_at = ends_at;
      if (title && title.trim()) b.title = title.trim();
      saveMock(); return mockDelay(b);
    }
    const c = await client();
    const { data, error } = await c.rpc('st_admin_move', { p_id: id, p_studio: studio_id, p_starts: starts_at, p_ends: ends_at, p_title: title || null });
    if (error){ if (/exclu|overlap|23P01/i.test(error.message || '')) fail('OVERLAP'); fail(error); }
    return data;
  },
  // Marque (public) : demander à libérer un créneau pris. On ne force jamais l'annulation.
  async releaseRequest({ studio_id, date, email, company, message }){
    if (CONFIG.MOCK){
      const t0 = new Date(date + 'T08:00:00'), t1 = new Date(date + 'T22:00:00');
      const bk = M.bookings.find(b => b.studio_id === studio_id && b.status === 'active'
        && new Date(b.starts_at) < t1 && new Date(b.ends_at) > t0);
      const r = { id: uid(), studio_id, date, requester_email: email, requester_company: company || null,
        message: message || null, booking_id: bk?.id || null, holder_kind: bk?.kind || null,
        status: 'pending', created_at: new Date().toISOString() };
      (M.releases = M.releases || []).push(r); saveMock();
      return mockDelay(r.id);
    }
    const c = await client();
    const { data, error } = await c.rpc('st_release_request', { p_studio: studio_id, p_date: date, p_email: email, p_company: company || null, p_message: message || null });
    if (error) fail(error);
    return data;
  },
  async releaseList(){
    if (CONFIG.MOCK){
      return mockDelay((M.releases || []).map(r => {
        const bk = M.bookings.find(b => b.id === r.booking_id);
        const holder = bk && bk.user_id ? M.profiles.find(p => p.id === bk.user_id) : null;
        const s = CONFIG.STUDIOS_FALLBACK.find(s => s.id === r.studio_id);
        return { ...r, studio_name: s?.name, holder_name: holder?.name || null, holder_email: holder?.email || null };
      }).sort((a, b) => (a.status === 'pending' ? 0 : 1) - (b.status === 'pending' ? 0 : 1) || new Date(b.created_at) - new Date(a.created_at)));
    }
    const c = await client();
    const { data, error } = await c.rpc('st_release_list');
    if (error){ if (/st_release_list|does not exist|schema cache/i.test(error.message || '')) return []; fail(error); }
    return data;
  },
  async releaseResolve(id, status){
    if (CONFIG.MOCK){ const r = (M.releases || []).find(r => r.id === id); if (r){ r.status = status; r.resolved_at = new Date().toISOString(); } saveMock(); return mockDelay(true); }
    const c = await client();
    const { error } = await c.rpc('st_release_resolve', { p_id: id, p_status: status });
    if (error) fail(error);
    return true;
  },
  async broadcast(subject, message, audience){
    const aud = audience || 'all';
    if (CONFIG.MOCK) return mockDelay(M.profiles.filter(p => p.role === 'creator' && (aud === 'all' || p.house === aud)).length);
    const c = await client();
    const { data, error } = await c.rpc('st_broadcast', { p_subject: subject, p_message: message, p_audience: aud });
    if (error) fail(error);
    return data;
  },
  async dashboard(){
    if (CONFIG.MOCK){
      const ms = new Date(); ms.setDate(1); ms.setHours(0,0,0,0);
      const per = CONFIG.STUDIOS_FALLBACK.map(s => ({
        id: s.id, name: s.name,
        bookings_month: M.bookings.filter(b => b.studio_id === s.id && b.status === 'active' && new Date(b.starts_at) >= ms).length,
        creator_month: M.bookings.filter(b => b.studio_id === s.id && b.kind === 'creator' && b.status === 'active' && new Date(b.starts_at) >= ms).length,
      }));
      M.ledger = M.ledger || [];
      const sum = k => M.ledger.filter(l => l.kind === k && new Date(l.entry_date) >= ms).reduce((a, l) => a + Number(l.amount), 0);
      const pending = (M.brandRequests || []).filter(r => r.status === 'new').length;
      const alerts = M.reviews.filter(r => r.stars_clean <= 2 || r.stars_equipment <= 2 || r.breakage || (r.missing && r.missing.trim())).length;
      return mockDelay({ month_start: ms.toISOString(), per_studio: per, income_month: sum('income'), expense_month: sum('expense'), brand_pending: pending, alerts });
    }
    const c = await client();
    const { data, error } = await c.rpc('st_dashboard');
    if (error) fail(error);
    return data;
  },
  // livre de comptes : ventes / dépenses saisies à la main
  async ledgerAdd({ kind, amount, label, studio_id, entry_date }){
    if (CONFIG.MOCK){
      M.ledger = M.ledger || [];
      const nm = id => (CONFIG.STUDIOS_FALLBACK.find(s => s.id === id) || {}).name || null;
      const rec = { id: uid(), kind, amount: Math.abs(Number(amount) || 0), label: String(label).trim(), studio_id: studio_id || null, studio_name: nm(studio_id), entry_date: entry_date || new Date().toISOString().slice(0, 10), author: M.me?.name || '—', created_at: new Date().toISOString() };
      M.ledger.unshift(rec); saveMock(); return mockDelay(rec);
    }
    const c = await client();
    const { data, error } = await c.rpc('st_ledger_add', { p_kind: kind, p_amount: amount, p_label: label, p_studio: studio_id || null, p_date: entry_date || null });
    if (error) fail(error);
    return data;
  },
  async ledgerList(from, to){
    if (CONFIG.MOCK){
      M.ledger = M.ledger || [];
      return mockDelay([...M.ledger].filter(l =>
        (!from || l.entry_date >= from) && (!to || l.entry_date <= to)));
    }
    const c = await client();
    const { data, error } = await c.rpc('st_ledger_list', { p_from: from || null, p_to: to || null, p_limit: 200 });
    if (error) fail(error);
    return data;
  },
  async ledgerDelete(id){
    if (CONFIG.MOCK){ M.ledger = (M.ledger || []).filter(l => l.id !== id); saveMock(); return mockDelay(true); }
    const c = await client();
    const { error } = await c.rpc('st_ledger_delete', { p_id: id });
    if (error) fail(error);
    return true;
  },
  async history(studio, limit){
    if (CONFIG.MOCK){
      const nm = id => (CONFIG.STUDIOS_FALLBACK.find(s => s.id === id) || {}).name || id;
      return mockDelay([...M.bookings]
        .filter(b => !studio || b.studio_id === studio)
        .sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at))
        .slice(0, limit || 100)
        .map(b => ({ studio_id: b.studio_id, studio_name: nm(b.studio_id), starts_at: b.starts_at, ends_at: b.ends_at, kind: b.kind, status: b.status,
          who: (M.profiles.find(p => p.id === b.user_id) || {}).name || (b.kind === 'brand' ? (b.title || 'Marque') : b.kind === 'block' ? 'Bloqué' : '—'), title: b.title })));
    }
    const c = await client();
    const { data, error } = await c.rpc('st_history', { p_studio: studio || null, p_limit: limit || 100 });
    if (error) fail(error);
    return data;
  },
  async allowedList(){
    if (CONFIG.MOCK) return mockDelay([...M.allowed]);
    const c = await client();
    const { data, error } = await c.from('st_allowed_emails').select('*').order('created_at');
    if (error) fail(error);
    return data;
  },
  async allowedAdd(email, name, role, house){
    const r = role === 'admin' ? 'admin' : 'creator';
    const h = r === 'creator' ? (house === 'hiving' ? 'hiving' : 'food') : null;
    if (CONFIG.MOCK){
      if (M.allowed.some(a => a.email.toLowerCase() === email.toLowerCase())) fail('Déjà dans la liste');
      M.allowed.push({ email, name, role: r, house: h });
      M.profiles.push({ id: uid(), email, name, role: r, house: h });
      saveMock();
      return mockDelay(true);
    }
    const c = await client();
    const { error } = await c.from('st_allowed_emails').insert({ email: email.toLowerCase(), name, role: r, house: h });
    if (error) fail(error);
    return true;
  },
  async allowedRemove(email){
    if (CONFIG.MOCK){
      const lo = String(email).toLowerCase();
      M.allowed = M.allowed.filter(a => a.email.toLowerCase() !== lo);
      // comme le vrai st_remove_member : on coupe aussi l'accès (profil non-admin + mdp)
      M.profiles = M.profiles.filter(p => p.email.toLowerCase() !== lo || p.role === 'admin');
      if (M.pwd) delete M.pwd[email];
      if (M.me && M.me.email && M.me.email.toLowerCase() === lo && M.me.role !== 'admin') M.me = null;
      saveMock();
      return mockDelay(true);
    }
    const c = await client();
    const { error } = await c.rpc('st_remove_member', { p_email: email });
    if (error) fail(error);
    return true;
  },
  async adminGetSetting(key){
    if (CONFIG.MOCK) return key === 'shop_url' ? (M.shopUrl || '') : '';
    const c = await client();
    const { data } = await c.from('st_settings').select('value').eq('key', key).maybeSingle();
    return (data && data.value) || '';
  },
  async adminSetSetting(key, value){
    if (CONFIG.MOCK){ if (key === 'shop_url') M.shopUrl = value; saveMock(); return mockDelay(true); }
    const c = await client();
    const { error } = await c.from('st_settings').update({ value }).eq('key', key);
    if (error) fail(error);
    return true;
  },
};

/* ---------- utilitaires partagés ---------- */
export const fmt = {
  date: iso => new Date(iso).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
  dateFull: iso => new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  time: iso => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  range: (a, b) => `${fmt.date(a)} · ${fmt.time(a)} à ${fmt.time(b)}`,
  euro: n => Number(n).toLocaleString('fr-FR') + ' €',
};
export function toast(msg, ms = 3200){
  let t = document.querySelector('.toast');
  if (!t){ t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.innerHTML = msg; t.classList.add('on');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), ms);
}
export function mockBanner(){
  if (!CONFIG.MOCK) return;
  const d = document.createElement('div');
  d.className = 'mock-banner';
  d.innerHTML = 'Mode <b>démo</b> · données fictives locales (schema.sql pas encore appliqué)';
  document.body.prepend(d);
}
