// Fake data pour le dashboard admin Hiving Food

const ADMIN_KPIS = {
  ca_mois: 48750,
  ca_mois_evol: +18,
  reservations_mois: 22,
  reservations_evol: +4,
  taux_occupation: 78,
  taux_evol: +12,
  demandes_pending: 7,
};

const ADMIN_REQUESTS = [
  { id: 'HF-K7M2X', client: 'Marie Dupont', company: 'Maison Bonnefoy', studio: 'LE BLANC', date: '2026-05-14', slot: 'Journée', total: 2580, status: 'pending', created: '2026-05-02T09:14', email: 'marie@exemple.fr', phone: '+33 6 00 00 00 00', brief: 'Shooting nouvelle collection confitures. Besoin de lumière douce naturelle. Équipe de 5.' },
  { id: 'HF-Q4N9P', client: 'Léa Sanchis', company: 'Studio Charron', studio: 'LA TABLE', date: '2026-05-09', slot: 'Demi-journée AM', total: 1410, status: 'pending', created: '2026-05-02T08:42', email: 'lea@exemple.fr', phone: '+33 6 00 00 00 00', brief: 'Top-shots pâtisserie pour catalogue Pierre Hermé.' },
  { id: 'HF-B2L8H', client: 'Hugo Bernier', company: 'Pulse Agency', studio: 'LA CUISINE', date: '2026-05-21', slot: 'Journée + nuit', total: 4960, status: 'pending', created: '2026-05-01T17:22', email: 'hugo@exemple.fr', phone: '+33 6 00 00 00 00', brief: 'Spot 30s pour Bonne Maman, 2 chefs sur place, 12 personnes équipe.' },
  { id: 'HF-Z9R1T', client: 'Camille Reboul', company: 'Maison Ladurée', studio: 'LE BLANC', date: '2026-05-28', slot: 'Journée', total: 1980, status: 'pending', created: '2026-05-01T14:08', email: 'camille@exemple.fr', phone: '+33 6 00 00 00 00', brief: 'Macarons édition Saint-Valentin. Packshots + ambiance.' },
  { id: 'HF-J3D7W', client: 'Marc Bénichou', company: 'Veuve Clicquot', studio: 'LA TABLE', date: '2026-06-04', slot: 'Journée', total: 2820, status: 'pending', created: '2026-05-01T11:55', email: 'marc@exemple.fr', phone: '+33 6 00 00 00 00', brief: 'Brut Yellow Director Cut — 3 setups différents, équipe ciné.' },
  { id: 'HF-V6Y2K', client: 'Sophie Aubert', company: 'Picard Surgelés', studio: 'LA CUISINE', date: '2026-05-16', slot: 'Demi-journée PM', total: 1320, status: 'pending', created: '2026-05-01T09:30', email: 'sophie@exemple.fr', phone: '+33 6 00 00 00 00', brief: 'TVC 20s premium, focus produit cuisson live.' },
  { id: 'HF-P5C0F', client: 'Élise Marchand', company: 'Fauchon', studio: 'LE BLANC', date: '2026-06-11', slot: 'Journée', total: 2240, status: 'pending', created: '2026-04-30T16:45', email: 'elise@exemple.fr', phone: '+33 6 00 00 00 00', brief: 'Chocolats Pâques — packshot collection.' },
];

const ADMIN_BOOKINGS_CONFIRMED = [
  { id: 'HF-A1B2C', client: 'Pierre Hermé', studio: 'LE BLANC', date: '2026-05-04', slot: 'Journée', total: 2980, paid: 894, status: 'confirmed' },
  { id: 'HF-D3E4F', client: 'Bonne Maman', studio: 'LA CUISINE', date: '2026-05-06', slot: 'Journée', total: 3520, paid: 1056, status: 'confirmed' },
  { id: 'HF-G5H6I', client: 'Perrier', studio: 'LA TABLE', date: '2026-05-07', slot: 'Demi-journée AM', total: 1410, paid: 423, status: 'confirmed' },
  { id: 'HF-J7K8L', client: 'Poilâne', studio: 'LE BLANC', date: '2026-05-08', slot: 'Journée', total: 2240, paid: 2240, status: 'paid' },
  { id: 'HF-M9N0O', client: 'Maison Ladurée', studio: 'LA CUISINE', date: '2026-05-12', slot: 'Journée + nuit', total: 4980, paid: 1494, status: 'confirmed' },
  { id: 'HF-P1Q2R', client: 'Veuve Clicquot', studio: 'LA TABLE', date: '2026-05-13', slot: 'Journée', total: 2820, paid: 846, status: 'confirmed' },
];

const ADMIN_CLIENTS = [
  { id: 'cl-001', name: 'Maison Ladurée', contact: 'Camille Reboul', email: 'camille@exemple.fr', phone: '+33 1 40 75 08 75', shoots: 12, ca: 38500, last: '2026-04-22', tags: ['VIP', 'Récurrent'] },
  { id: 'cl-002', name: 'Bonne Maman', contact: 'Hugo Bernier', email: 'hugo@exemple.fr', phone: '+33 1 47 23 45 89', shoots: 8, ca: 28200, last: '2026-04-15', tags: ['Récurrent'] },
  { id: 'cl-003', name: 'Pierre Hermé', contact: 'Sophie Lambert', email: 'lambert@exemple.fr', phone: '+33 1 47 03 89 09', shoots: 15, ca: 52800, last: '2026-04-28', tags: ['VIP', 'Récurrent'] },
  { id: 'cl-004', name: 'Veuve Clicquot', contact: 'Marc Bénichou', email: 'marc@exemple.fr', phone: '+33 1 55 35 88 88', shoots: 6, ca: 22400, last: '2026-04-10', tags: ['VIP'] },
  { id: 'cl-005', name: 'Poilâne', contact: 'Apollonia P.', email: 'apollonia@exemple.fr', phone: '+33 1 45 48 42 59', shoots: 4, ca: 8960, last: '2026-03-30', tags: [] },
  { id: 'cl-006', name: 'Fauchon', contact: 'Élise Marchand', email: 'elise@exemple.fr', phone: '+33 1 70 39 38 00', shoots: 7, ca: 17850, last: '2026-04-18', tags: ['Récurrent'] },
  { id: 'cl-007', name: 'Perrier', contact: 'Léa Charron', email: 'lea@exemple.fr', phone: '+33 1 45 88 77 00', shoots: 3, ca: 6300, last: '2026-04-02', tags: [] },
  { id: 'cl-008', name: 'Picard Surgelés', contact: 'Sophie Aubert', email: 'sophie@exemple.fr', phone: '+33 1 41 14 28 28', shoots: 5, ca: 12450, last: '2026-04-25', tags: ['Récurrent'] },
];

const ADMIN_INVOICES = [
  { num: '2026-0142', client: 'Maison Ladurée', date: '2026-04-28', amount: 3580, status: 'paid', due: '2026-05-12' },
  { num: '2026-0141', client: 'Bonne Maman', date: '2026-04-25', amount: 4220, status: 'paid', due: '2026-05-10' },
  { num: '2026-0140', client: 'Pierre Hermé', date: '2026-04-22', amount: 5980, status: 'sent', due: '2026-05-06' },
  { num: '2026-0139', client: 'Veuve Clicquot', date: '2026-04-18', amount: 2820, status: 'overdue', due: '2026-05-02' },
  { num: '2026-0138', client: 'Poilâne', date: '2026-04-15', amount: 1980, status: 'paid', due: '2026-04-29' },
  { num: '2026-0137', client: 'Fauchon', date: '2026-04-12', amount: 2240, status: 'paid', due: '2026-04-26' },
  { num: 'D-2026-0089', client: 'Maison Bonnefoy', date: '2026-05-02', amount: 2580, status: 'quote', due: '—' },
  { num: 'D-2026-0088', client: 'Pulse Agency', date: '2026-05-01', amount: 4960, status: 'quote', due: '—' },
];

const ADMIN_TEAM = [
  { id: 't-001', name: 'Camille R.', role: 'Cheffe résidente', avail: 'busy', color: '#d4a574' },
  { id: 't-002', name: 'Hugo L.', role: 'Dir. photo', avail: 'free', color: '#8b6f47' },
  { id: 't-003', name: 'Léa S.', role: 'Régie', avail: 'free', color: '#a83232' },
  { id: 't-004', name: 'Marc B.', role: 'Fondateur', avail: 'free', color: '#2d2520' },
  { id: 't-005', name: 'Théo M.', role: 'Assistant photo', avail: 'busy', color: '#5a8c3e' },
  { id: 't-006', name: 'Inès D.', role: 'Styliste culinaire', avail: 'free', color: '#c9a574' },
];

const ADMIN_EQUIPMENT_INV = [
  { cat: 'Lumière', items: [
    { name: 'Profoto B10X', qty: 4, available: 4 },
    { name: 'Profoto B10X Plus', qty: 2, available: 1 },
    { name: 'Aputure 600D', qty: 2, available: 2 },
    { name: 'Boîtes à lumière 1×1', qty: 6, available: 5 },
  ]},
  { cat: 'Optiques', items: [
    { name: 'Canon RF 100mm Macro', qty: 2, available: 2 },
    { name: 'Canon RF 24-70mm f/2.8', qty: 3, available: 2 },
    { name: 'Sigma 105mm Art', qty: 1, available: 0 },
  ]},
  { cat: 'Caméras', items: [
    { name: 'Canon R5', qty: 3, available: 3 },
    { name: 'Sony FX3', qty: 2, available: 1 },
    { name: 'Phase One IQ4', qty: 1, available: 1 },
  ]},
];

// Helpers format
function fmtEur(n) { return n.toLocaleString('fr-FR') + '\u00A0€'; }
function fmtDateFR2(d) {
  const dt = (d instanceof Date) ? d : new Date(d);
  return dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}
function fmtDateLong(d) {
  const dt = (d instanceof Date) ? d : new Date(d);
  return dt.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}
function fmtTime(d) {
  const dt = (d instanceof Date) ? d : new Date(d);
  return dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
function relTime(d) {
  const dt = new Date(d);
  const diff = (Date.now() - dt.getTime()) / 1000 / 60;
  if (diff < 60) return `il y a ${Math.round(diff)} min`;
  if (diff < 60 * 24) return `il y a ${Math.round(diff / 60)} h`;
  return `il y a ${Math.round(diff / 60 / 24)} j`;
}

const studioColor = (name) => {
  if (name === 'LE BLANC') return '#e8e3d8';
  if (name === 'LA TABLE') return '#2d2520';
  return '#c9824a';
};

Object.assign(window, {
  ADMIN_KPIS, ADMIN_REQUESTS, ADMIN_BOOKINGS_CONFIRMED, ADMIN_CLIENTS,
  ADMIN_INVOICES, ADMIN_TEAM, ADMIN_EQUIPMENT_INV,
  fmtEur, fmtDateFR2, fmtDateLong, fmtTime, relTime, studioColor,
});
