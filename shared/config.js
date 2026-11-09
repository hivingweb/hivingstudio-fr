// Configuration plateforme Hiving Studio
// MOCK=true : données fictives locales (démo/dev sans base). Passer à false une fois schema.sql appliqué dans Supabase.
export const CONFIG = {
  MOCK: false,
  SUPABASE_URL: 'https://pmrqrbjxikljlarhkseu.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_j_kHa-caXfSxkSyeGd-veA_ZdUvNCw8',
  CONTACT_EMAIL: 'contact@hivingfood.fr',
  // Réservation via le CRM Hiving (devis puis facture Pennylane) : adresse COMPLÈTE de l'API du CRM,
  // ex. 'https://crm.exemple.fr/api/studio/reservations'. Vide = ancien circuit (Supabase pour /pro/,
  // e-mail /api/contact pour /pages/devis.html). En la remplissant, ajouter l'origine du CRM à
  // connect-src dans vercel.json (les deux CSP). Spécification : docs/reservation-pennylane.md.
  CRM_RESERVATION_URL: '',
  STUDIOS_FALLBACK: [
    { id: 'pro',       name: 'Studio Pro',       price_day: 850,  tag: 'la cuisine des chefs' },
    { id: 'famille',   name: 'Studio Famille',   price_day: 1000, tag: 'comme à la maison' },
  ],
  OPEN_HOUR: 8, CLOSE_HOUR: 22,
  VAT_RATE: 20,                                   // TVA applicable (%)
  LEGAL: {
    name: 'HIVING FOOD',
    form: 'SAS au capital de 5 000 €',
    address_l1: '4-10 rue Mozart',
    address_l2: '92110 Clichy · France',
    siren: '990 876 401',
    vat: 'FR01990876401',
  },
};
