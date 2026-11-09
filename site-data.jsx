// HIVING FOOD — Données partagées multi-pages
// Plateaux, services SEO, carnet, équipe, presse, tarifs

(function () {
  // ─── PLATEAUX ────────────────────────────────────────
  // Faits officiels validés par Maxime (2026-11-09) : 2 plateaux, prix à la journée HT.
  // Textes repris de l'accueil (index.html). Pas de tarif demi-journée publié.
  const PLATEAUX = [
    {
      slug: 'studio-pro',
      num: '01',
      name: 'STUDIO PRO',
      tagline: 'La cuisine des chefs',
      desc: 'Plafond technique, grill lumière, plan inox, piano 6 feux et four UNOX. Cellule de refroidissement jusqu\'à moins 40 °C, tour réfrigérée, Kitchen Aid, plonge et ustensiles complets. Le plateau des brand films, des pubs et des formats haut de gamme qui exigent un rendu net.',
      surface: '80 m²',
      ceiling: '3,2 m',
      price: 850,
      book: 'pro/?studio=pro',
      img: 'img/ph/pro-1.jpg',
      tags: ['Brand films', 'Pubs', 'Haut de gamme'],
      dark: false,
    },
    {
      slug: 'studio-famille',
      num: '02',
      name: 'STUDIO FAMILLE',
      tagline: 'Comme à la maison, en mieux éclairé',
      desc: 'Cuisine habitée, lumière douce : îlot central mobile, plan bois, parquet chevrons, coin repas. Plaques 8 feux, hotte intégrée, four vapeur : entièrement équipée et personnalisable sur mesure. Le décor des formats UGC, contenus food et séries web.',
      surface: '65 m²',
      ceiling: '2,8 m',
      price: 1000,
      book: 'pro/?studio=famille',
      img: 'img/ph/famille-1.jpg',
      tags: ['UGC', 'Contenus food', 'Séries web'],
      dark: true,
    },
  ];

  // ─── SERVICES SEO ─────────────────────────────────────
  const SERVICES = [
    {
      slug: 'photo-culinaire-paris',
      title: 'Photo culinaire Paris',
      eyebrow: 'Service · Photographie',
      hero: 'Le studio photo food le plus complet de Paris.',
      desc: 'Deux plateaux dédiés, lumière naturelle nord, équipe stylisme intégrée. Pour les marques food, chefs étoilés et magazines exigeants.',
      keywords: 'studio photo culinaire paris, photographe food paris, location studio food, plateau photo gastronomie',
      bullets: [
        '2 plateaux modulaires de 65 et 80 m²',
        'Cyclo blanc + 18 décors bois/marbre',
        'Parc lumière LED + naturelle nord',
        'Stylistes culinaires sur place',
        'Cuisine pro Bonnet attenante',
        'Décote -15% sur le matos en bookant le plateau',
      ],
      from: 750,
      faq: [
        { q: 'Combien coûte une journée de photo culinaire en studio à Paris ?', a: 'La location d\'un plateau est à 850 € HT la journée pour le Studio Pro et 1 000 € HT pour le Studio Famille. Compter 1 500 à 3 500 € avec stylisme + matériel pro.' },
        { q: 'Quelle est la meilleure lumière pour photographier des plats ?', a: 'La lumière naturelle nord est idéale (constante, douce, sans dominante). À défaut, des LED bicolores diffusées simulent très bien le rendu.' },
        { q: 'Faut-il un styliste culinaire pour un shooting food ?', a: 'Pour une photo qui vend (packaging, pub, magazine), oui. Un styliste prépare les plats spécifiquement pour la photo (texture, brillance, taille des portions, vapeur figée). Nous avons 4 stylistes partenaires expérimentés.' },
      ],
    },
    {
      slug: 'packshot-produit-alimentaire',
      title: 'Packshot produit alimentaire',
      eyebrow: 'Service · E-commerce',
      hero: 'Vos produits, sublimés. À l\'échelle catalogue.',
      desc: 'Cyclo blanc, lumière calibrée, banc de prise stable. Volume catalogue ou grandes campagnes — workflow industrialisé sans perte de qualité.',
      keywords: 'packshot alimentaire paris, photo produit food, photographie packaging, studio packshot e-commerce',
      bullets: [
        'Cyclo blanc parfaitement uniforme',
        'Banc Cambo + Phase One IQ4 150 MP',
        'Capture tethered + retouche live',
        'Workflow 200+ refs / jour',
        'Calibration colorimétrique D65',
        'Livraison RAW + retouche en J+2',
      ],
      from: 950,
      faq: [
        { q: 'Combien de packshots peut-on shooter en une journée ?', a: 'Selon la complexité : 200 références simples (1 angle), 60-80 sets multi-angles avec props. Notre workflow tethered + 2e poste de retouche en parallèle accélère tout.' },
        { q: 'Format de livraison standard ?', a: 'RAW + JPG haute déf + PNG détouré sur fond transparent + version e-commerce 1500 px. Workflow couleur D65, conversion sRGB et Adobe RGB livrés.' },
      ],
    },
    {
      slug: 'stop-motion-food',
      title: 'Stop motion food',
      eyebrow: 'Service · Animation',
      hero: 'Le format qui crève l\'écran social.',
      desc: 'Studio dédié stop motion : banc multiplane, robot DMX, contrôle lumière image par image. Pour les marques food qui veulent percer sur Insta, TikTok, YouTube.',
      keywords: 'stop motion food paris, animation culinaire, studio stop motion alimentaire, vidéo food réseaux sociaux',
      bullets: [
        'Banc motion control DMX + Dragonframe',
        'Lumière 100% LED stable image par image',
        'Préparation par styliste dédié',
        'Storyboarding inclus',
        'Livraison 4K ProRes + montage social',
        'Formats Insta/TikTok/YouTube prêts',
      ],
      from: 1500,
      faq: [
        { q: 'Combien de temps pour produire 15 secondes de stop motion food ?', a: 'Compter 1 à 2 jours de tournage selon la complexité (nombre de plats, transitions). Plus 1-2 jours de post-prod. Budget moyen 8 000-15 000 € HT pour un spot social qualité diffusion.' },
      ],
    },
    {
      slug: 'spot-tv-cuisine',
      title: 'Spot TV cuisine',
      eyebrow: 'Service · Film',
      hero: 'Tournage TV : cuisine pro, équipe pro, plateau pro.',
      desc: 'Cuisine 6 feux pro + cyclo + extraction industrielle. Hauteur sous plafond 4m, monte-charge, loges. Pour les pubs TV, capsules YouTube, contenus chefs étoilés.',
      keywords: 'tournage spot tv food paris, location plateau cinéma cuisine, studio film culinaire, location cuisine tournage paris',
      bullets: [
        'Hauteur 4m + grill technique',
        'Cuisine Bonnet 6 feux + plancha + piano',
        'Extraction 6000 m³/h silencieuse',
        'Loges + maquillage + régie',
        'Monte-charge 1.4 t',
        'Brigade Hiving (chef + commis) en option',
      ],
      from: 2200,
      faq: [
        { q: 'Le studio est-il adapté à un tournage avec une équipe complète ?', a: 'Oui. 4m sous plafond, grille technique câblée 32A, monte-charge 1.4 t, 3 loges, salle de régie, parking 8 places. Capacité jusqu\'à 25 personnes en plateau.' },
      ],
    },
  ];

  // ─── ARTICLES BLOG ────────────────────────────────────
  const ARTICLES = [
    {
      slug: 'article-photo-food',
      title: '7 erreurs à éviter en photo culinaire',
      eyebrow: 'Pratique',
      excerpt: 'La lumière, la profondeur, le timing : ce qu\'on voit (et qu\'on revoit) tous les jours en studio. Et comment les corriger.',
      readTime: 6,
      date: '2026-04-22',
      author: 'Léa Marchand · Cheffe styliste',
      tags: ['Photo', 'Pratique', 'Light'],
    },
    {
      slug: 'article-styliste',
      title: 'Comment bien briefer un styliste culinaire',
      eyebrow: 'Méthode',
      excerpt: 'Un brief styliste réussi = 30% de temps gagné en studio et un résultat qui colle à votre univers de marque.',
      readTime: 5,
      date: '2026-04-08',
      author: 'Camille Dorsay · Directrice studio',
      tags: ['Méthode', 'Workflow'],
    },
    {
      slug: 'article-tendances-2026',
      title: 'Tendances food photography 2026',
      eyebrow: 'Tendances',
      excerpt: 'Le retour du contraste, les compositions verticales pour les réseaux, le frame-within-the-frame. Ce qui marche cette année.',
      readTime: 8,
      date: '2026-03-30',
      author: 'Studio Hiving',
      tags: ['Tendances', 'Direction artistique'],
    },
  ];

  // ─── ÉQUIPE ───────────────────────────────────────────
  const TEAM = [
    { id: 1, name: 'Camille Dorsay', role: 'Directrice studio', bio: '15 ans en photo food. Ex-direction artistique chez Régal. Pilote Hiving depuis l\'ouverture.', tags: ['Direction', 'DA'] },
    { id: 2, name: 'Léa Marchand', role: 'Cheffe styliste culinaire', bio: 'Diplômée Ferrandi + Vatel. Stylisme pour Picard, Bonne Maman, Ladurée. 200+ shootings/an.', tags: ['Stylisme'] },
    { id: 3, name: 'Marco Pezzato', role: 'Chef de cuisine résident', bio: 'Ex-Septime, ex-Anne-Sophie Pic. Brigade Hiving sur les tournages films et chef-driven projects.', tags: ['Cuisine', 'Brigade'] },
    { id: 4, name: 'Sami Belkacem', role: 'Régisseur lumière + tech', bio: 'Régie plateau, parc lumière, Phase One certified. 10 ans en pub TV.', tags: ['Tech', 'Lumière'] },
    { id: 5, name: 'Inès Tabet', role: 'Coordination & client', bio: 'Devis, planning, brief client. Votre point de contact unique du premier mail au shoot.', tags: ['Coordination'] },
    { id: 6, name: 'Théo Leduc', role: 'Photographe résident', bio: 'Spécialisé packshot et lifestyle food. Disponible sur option pour les shoots Hiving.', tags: ['Photo'] },
  ];

  // ─── PRESSE ───────────────────────────────────────────
  const PRESS = [
    { id: 1, source: 'Le Monde · Styles', title: 'Hiving, le studio qui change la photo food à Paris', date: '2025-11-12' },
    { id: 2, source: 'L\'Hôtellerie Restauration', title: 'Le boom des studios food spécialisés', date: '2025-09-04' },
    { id: 3, source: 'Vanity Fair France', title: 'Comment Hiving photographie le luxe alimentaire', date: '2025-06-22' },
    { id: 4, source: 'Stratégies', title: 'Picard signe sa nouvelle campagne avec Hiving', date: '2025-04-15' },
    { id: 5, source: 'Konbini Food', title: 'Dans les coulisses du studio préféré des marques food', date: '2025-02-28' },
    { id: 6, source: 'Frenchy Food', title: 'Hiving, l\'usine à belles photos', date: '2024-12-10' },
  ];

  const CLIENTS = [
    'PICARD', 'BONNE MAMAN', 'LADURÉE', 'BORDIER', 'MAILLE',
    'MICHEL & AUGUSTIN', 'CRU & CO.', 'SEPTIME', 'L\'ARPÈGE',
    'DASSAÏ', 'KUSMI TEA', 'COMTE', 'LE BON MARCHÉ',
  ];

  // ─── ADD-ONS / OPTIONS ────────────────────────────────
  const ADDONS_FULL = [
    { id: 'styliste', name: 'Styliste culinaire', desc: '1 styliste pro pour préparer/finaliser les plats', unit: 'jour', price: 650, cat: 'Équipe' },
    { id: 'chef', name: 'Chef cuisine', desc: 'Chef Hiving pour exécution des recettes', unit: 'jour', price: 750, cat: 'Équipe' },
    { id: 'commis', name: 'Commis', desc: 'Aide cuisine + plonge', unit: 'jour', price: 280, cat: 'Équipe' },
    { id: 'photographe', name: 'Photographe résident', desc: 'Théo Leduc — packshot/lifestyle', unit: 'jour', price: 1200, cat: 'Équipe' },
    { id: 'phaseone', name: 'Phase One IQ4 150 MP', desc: 'Boîtier moyen format + 3 optiques', unit: 'jour', price: 480, cat: 'Matériel' },
    { id: 'cambo', name: 'Banc Cambo + tilt-shift', desc: 'Banc de repro pour packshot', unit: 'jour', price: 220, cat: 'Matériel' },
    { id: 'lumiere', name: 'Pack lumière premium', desc: 'Profoto B10X ×4 + softbox + drapeaux', unit: 'jour', price: 320, cat: 'Matériel' },
    { id: 'props', name: 'Kit props (vaisselle/textile)', desc: 'Accès aux 800 références sur place', unit: 'jour', price: 180, cat: 'Matériel' },
    { id: 'retouche', name: 'Retouche post-prod', desc: 'Par image livrée — délai J+3', unit: 'image', price: 35, cat: 'Post-production' },
    { id: 'food', name: 'Food cost (matières premières)', desc: 'Marché du jour, factures à l\'euro près', unit: 'forfait', price: 0, cat: 'Cuisine' },
    { id: 'parking', name: 'Parking 8 places', desc: 'Véhicules régie + équipe', unit: 'jour', price: 120, cat: 'Logistique' },
    { id: 'loges', name: 'Loges + maquillage', desc: '3 loges + miroir maquillage + douche', unit: 'jour', price: 200, cat: 'Logistique' },
  ];

  // ─── CERTIFICATIONS ───────────────────────────────────
  const CERTS = [
    { name: 'RC Pro AXA', value: '2 M€ couverture' },
    { name: 'Hygiène HACCP', value: 'Niveau 3 · audit annuel' },
    { name: 'Affilié SATEV', value: 'Syndicat technique audiovisuel' },
    { name: 'Membre AFC', value: 'Association française des cinematographers' },
    { name: 'B Corp', value: 'Certification 2024' },
  ];

  Object.assign(window, {
    HIVING_PLATEAUX: PLATEAUX,
    HIVING_SERVICES: SERVICES,
    HIVING_ARTICLES: ARTICLES,
    HIVING_TEAM_FULL: TEAM,
    HIVING_PRESS: PRESS,
    HIVING_CLIENTS: CLIENTS,
    HIVING_ADDONS_FULL: ADDONS_FULL,
    HIVING_CERTS: CERTS,
  });
})();
