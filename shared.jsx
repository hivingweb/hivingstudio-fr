// Shared data + utility components for HIVING STUDIO (Clichy 92)
// Vraies données Hiving — Studio Pro, Studio Famille (2 plateaux)

const HIVING_STUDIOS = [
  {
    id: 'plateau-1',
    num: '01',
    name: 'LE PRO',
    surface: '55 m²',
    height: '3,2 m',
    light: 'Éclairage Neewer LED sur rail',
    color: '#c9c4b8',
    desc: 'Studio culinaire haut de gamme pensé pour le tournage : chefs, marques alimentaires, créateurs et équipes de production. Plan de travail spacieux, équipements pro, circulation fluide. Démonstrations techniques, recettes, ateliers, émissions, pubs — chaque détail du décor signe un rendu premium.',
    features: ['Plan inox', 'Four Unox Bakertop', 'KitchenAid', 'Plaque induction pro', 'Top-shot intégré', 'Modulable axes caméra', 'Option matériel + accompagnement technique'],
    image: '/img/studio-pro/1.webp',
    slug: 'plateaux',
    seoTitle: 'Le Pro — Studio cuisine professionnelle Paris (Clichy 92)',
    images: ['/img/studio-pro/1.webp', '/img/studio-pro/2.webp', '/img/studio-pro/3.webp', '/img/studio-pro/4.webp', '/img/studio-pro/5.webp', '/img/studio-pro/6.webp'],
    hotspots: [
      { top: '60%', left: '30%', label: 'Piano 6 feux' },
      { top: '40%', left: '65%', label: 'Top-shot' },
      { top: '55%', left: '82%', label: 'Plan inox' },
    ],
    price: '100',
  },
  {
    id: 'plateau-2',
    num: '02',
    name: 'LE FAMILIAL',
    surface: '55 m²',
    height: '2,8 m',
    light: 'Lumière naturelle + Neewer LED + blackout',
    color: '#e8d8c4',
    desc: 'Cuisine modulable pensée comme une vraie cuisine maison, optimisée pour la capture. Rendu chaleureux, authentique et premium. Îlot central et modules sur roulettes pour adapter l\'espace : démonstration, caméra faciale, duo chef-invité, atelier, masterclass, publicité, contenus sociaux.',
    features: ['Plan bois', 'Parquet chevrons', 'Îlot central mobile', 'Modules sur roulettes', 'Coin salle à manger', 'Modulable axes caméra', 'Option matériel + accompagnement'],
    image: '/img/studio-famille/4.webp',
    slug: 'plateaux',
    seoTitle: 'Le Familial — Cuisine maison modulable Paris (Clichy 92)',
    images: ['/img/studio-famille/4.webp', '/img/studio-famille/1.webp', '/img/studio-famille/2.webp', '/img/studio-famille/3.webp', '/img/studio-famille/5.webp', '/img/studio-famille/6.webp', '/img/studio-famille/7.webp'],
    hotspots: [
      { top: '58%', left: '32%', label: 'Îlot central' },
      { top: '42%', left: '60%', label: 'Plan bois' },
      { top: '50%', left: '82%', label: 'Coin repas' },
    ],
    formats: ['Recettes & capsules premium', 'Émissions & masterclass chefs', 'Publicités food & marque', 'YouTube · Instagram · TikTok', 'Cuisine en direct, défis, packshots'],
    price: '100',
  },
];

const HIVING_PORTFOLIO = [
  { brand: 'DOMINGO × GAËL MONFILS', project: 'Format long YouTube — Cuisine & confidences', year: '2026', cat: 'YouTube', tone: '#0a0908', image: '/videos/yt-monfils-domingo.jpg', youtube: '', duration: '' },
  { brand: 'MATTEO LARZIZE × MIEL × JULIOS', project: 'Format long YouTube — Édition spéciale Noël', year: '2026', cat: 'YouTube', tone: '#0a0908', image: '/videos/yt-matteo-miel-julios.jpg', youtube: '', duration: '' },
  { brand: 'LEVI’S PARIS', project: 'Une journée avec Drice habillé — @dricecook', year: '2026', cat: 'Vidéo', tone: '#1a1a1a', image: '/videos/levis-drice-cook.mp4' },
  { brand: 'FEASTABLES', project: 'ChocoFeast — @dricecook', year: '2026', cat: 'Vidéo', tone: '#3a1a0d', image: '/videos/feastables-drice-cook.mp4' },
  { brand: 'GALERIES LAFAYETTE', project: 'Arrivée @vincentsalur — Brand content', year: '2026', cat: 'Vidéo', tone: '#a83232', image: '/videos/galeries-lafayette-vincent-salur.mp4' },
  { brand: 'COYOTE', project: 'Brand x talent — @vincentsalur', year: '2026', cat: 'Vidéo', tone: '#e8633a', image: '/videos/coyote-vincent-salur.mp4' },
  { brand: 'TEFAL', project: 'Jeu concours — Brand content', year: '2026', cat: 'Vidéo', tone: '#c9824a', image: '/videos/tefal-concours.mp4' },
  { brand: 'METRO', project: 'Tataki — Brand event @hivingfood', year: '2026', cat: 'Vidéo', tone: '#1f3a5a', image: '/videos/metro-tataki.mp4' },
  { brand: 'COYOTE', project: '2026 — Brand recurrent @hivingfood', year: '2026', cat: 'Vidéo', tone: '#e8633a', image: '/videos/coyote-anniversaire.mp4' },
  { brand: 'PARMIGIANO REGGIANO', project: 'Event brand content — @matteolarzize', year: '2026', cat: 'Vidéo', tone: '#c9a574', image: '/videos/parmigiano-matteo-larzize.mp4' },
  { brand: 'JULIOS · IRL', project: 'Aux commandes dans nos cuisines — @julios.irl', year: '2026', cat: 'Vidéo', tone: '#3a3a35', image: '/videos/julios-cuisines.mp4' },
  { brand: 'JURASSIC FRUIT', project: 'Cabosses de cacao — Gâteau au chocolat', year: '2026', cat: 'Vidéo', tone: '#3a1a0d', image: '/videos/gateau-chocolat-jurassicfruit.mp4' },
  { brand: 'CARNET DE CUISINE', project: 'Mille-feuille croustillant — Feuilletine maison', year: '2026', cat: 'Vidéo', tone: '#c9a574', image: '/videos/mille-feuille-croustillant.mp4' },
  { brand: 'CARNET DE CUISINE', project: 'Maquereau × asperge × avocat', year: '2026', cat: 'Vidéo', tone: '#5a8c3e', image: '/videos/maquereau-asperge-avocat.mp4' },
  { brand: 'CARNET DE CUISINE', project: 'Plaisir en barre — Pâtisserie signature', year: '2026', cat: 'Vidéo', tone: '#a83232', image: '/videos/plaisir-en-barre.mp4' },
  { brand: 'HERTA · LE BON VÉGÉTAL', project: 'Tranches Végé Lentilles Corail Curry — Recette sandwich', year: '2026', cat: 'Vidéo', tone: '#c9824a', image: '/videos/tranches-vege-sandwich.mp4' },
  { brand: 'PICARD', project: 'On devient des chefs — @picardsurgeles', year: '2026', cat: 'Vidéo', tone: '#0a4d8c', image: '/videos/picard/devient-chefs.mp4' },
  { brand: 'PICARD', project: 'Noël 2025 — 20 vidéos brand content @hivingfood', year: '2025', cat: 'Vidéo', tone: '#0a4d8c', image: '/videos/picard/buches-creation.mp4' },
];

const HIVING_DISHES = [
  { name: 'Pizza napolitaine, four à bois', chef: 'Peppe Cutraro · 203K', tone: '#a83232' },
  { name: 'Pâtisserie signature, glaçage miroir', chef: 'Vincent Salur · 768K', tone: '#c9a574' },
  { name: 'Plat technique, dressage chef', chef: 'Kilian Franceschi · 566K', tone: '#3a3a35' },
  { name: 'Recette généreuse, cuisine sans détour', chef: 'Drice Cook · 1.8M', tone: '#6e3a20' },
  { name: 'Entremets parisien, dressage minute', chef: 'Damien Pichon · 178K', tone: '#d4a574' },
  { name: 'Recette française revisitée', chef: 'Chester Foodies · 839K', tone: '#8b6f47' },
];

const HIVING_EQUIPMENT = [
  {
    cat: 'CUISINE PRO',
    items: [
      'Four Unox Bakertop professionnel',
      'KitchenAid grand modèle',
      'Plaque induction professionnelle',
      'Plan de travail inox central spacieux',
      'Réfrigérateur double porte inox',
      'Double plaque induction · four encastré',
      'Cuisine bois + parquet chevrons',
    ],
  },
  {
    cat: 'LUMIÈRE',
    items: [
      'Éclairage Neewer LED sur rail intégré',
      'Softbox, parapluies, réflecteurs',
      'Lumière naturelle abondante',
      'Rideau blackout',
      'Setup photo studio complet',
      'Cyclorama blanc professionnel',
      'Fond vert pour incrustation',
    ],
  },
  {
    cat: 'CAPTURE & RÉGIE',
    items: [
      'Accroche caméra top-shot intégrée',
      'Pieds caméra, trépieds',
      'Wi-Fi haut débit',
      'Moniteur de contrôle',
      'Bureau de retouche · monitoring',
      'Zone lounge pour interviews',
    ],
  },
  {
    cat: 'STYLISME & PROPS',
    items: [
      'Vaisselle lifestyle (céramique, lin, bois)',
      'Fonds interchangeables (marbre, ardoise, bois, béton)',
      'Décor et accessoires personnalisables',
      'Coin salle à manger pour mise en scène',
      'Modules sur roulettes adaptables',
    ],
  },
];

const HIVING_FAQ = [
  { q: 'Quels sont les horaires de location ?', a: 'Les plateaux sont disponibles 7j/7, de 8h à 22h. Demi-journées et créneaux nocturnes possibles sur demande.' },
  { q: 'Puis-je visiter avant de réserver ?', a: 'Oui, sur rendez-vous du lundi au vendredi. Contactez-nous à contact@hivingfood.fr.' },
  { q: 'Le matériel est-il inclus ?', a: 'Oui — éclairage Neewer LED sur rail, électroménager pro (four Unox Bakertop, KitchenAid, induction). Vous n\'apportez rien sauf besoins spécifiques.' },
  { q: 'Vous proposez chefs et créateurs ?', a: 'Oui — Hiving Food représente plus de 10 chefs et créateurs culinaires : Peppe Cutraro, Drice Cook, Vincent Salur, Kilian Franceschi, Mohamed Belkassam, Chester Foodies… On propose le casting le plus juste pour votre marque.' },
  { q: 'Tarifs journée préférentiels ?', a: 'Studio Pro : 850 € HT / jour. Studio Famille : 1 000 € HT / jour.' },
  { q: 'Comment accéder aux studios ?', a: '4 Rue Mozart, 92110 Clichy. Métro Mairie de Clichy (L13) — 5 min à pied. 10 min de la Porte de Clichy en voiture. Parking gratuit à proximité.' },
];
