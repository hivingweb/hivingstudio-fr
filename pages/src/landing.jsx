// Source du composant React des pages d'atterrissage :
//   pages/location-studio-cuisine-paris.html, pages/studio-tournage-recette.html,
//   pages/studio-cuisine-createurs.html (contenu choisi d'après le nom du fichier).
// Après modification : node scripts/build-jsx.mjs (voir docs/build-jsx.md).
// Règle : uniquement des faits déjà publiés sur le site (accueil, plateaux, tarifs).
// Rien d'inventé (équipement, horaire, condition) : en cas de doute, renvoyer vers contact@hivingfood.fr.
const P = window.HIVING_PALETTE;

const CONTACT = 'contact@hivingfood.fr';

const ACCES = [
  '4 rue Mozart, 92110 Clichy',
  'À 8 min de Saint-Lazare',
  'Métro 13 & 14 : Mairie de Clichy · Saint-Ouen',
  'RER C : Porte de Clichy',
  '7j/7, de 8h à 22h, week-ends compris',
];

const INCLUS = [
  'Mobilier, café et wifi',
  'Aide à l\'installation (setup)',
  'Cuisines fonctionnelles : vous cuisinez, dressez et tournez dans la foulée',
  'Éclairage en package, à partir de 150 € HT',
  'Caméras, optiques, stabilisateurs et équipe technique (cadreur, chef op) en option, chiffrés avec vous',
];

const RESERVER = [
  'Devis instantané en ligne, indicatif et sans engagement',
  'Créneau bloqué après notre confirmation écrite, sous 24h ouvrées',
  'Date bloquée gratuitement 48h pendant qu\'on cale le brief',
  'Acompte 30 % à la confirmation, solde à J-7',
  'Tarifs HT, hors food cost, sans frais de dossier',
];

const PAGES = {
  'location-studio-cuisine-paris': {
    crumb: 'Location studio cuisine Paris',
    eyebrow: 'Location · Clichy, aux portes de Paris',
    h1: 'Location de studio cuisine',
    hand: 'aux portes de Paris.',
    intro: 'Hiving Studio loue deux plateaux cuisine entièrement équipés au 4 rue Mozart, à Clichy, à 8 minutes de Saint-Lazare : le Studio Pro (80 m²) et le Studio Famille (65 m²). Ouverts 7j/7 de 8h à 22h, ils se réservent en ligne, à la journée.',
    plateauxTitle: 'Deux plateaux, deux ambiances.',
    plateaux: ['studio-pro', 'studio-famille'],
    blocks: [
      { title: 'Inclus et en option', items: INCLUS },
      { title: 'Accès et horaires', items: ACCES },
      { title: 'Réservation', items: RESERVER },
    ],
    related: [
      { href: 'studio-tournage-recette.html', label: 'Studio de tournage de recettes' },
      { href: 'studio-cuisine-createurs.html', label: 'Studio cuisine pour créateurs' },
      { href: 'photo-culinaire-paris.html', label: 'Photo culinaire Paris' },
    ],
  },
  'studio-tournage-recette': {
    crumb: 'Studio tournage recette',
    eyebrow: 'Tournage de recettes · Clichy',
    h1: 'Studio de tournage',
    hand: 'de recettes.',
    intro: 'Pour filmer une recette, il faut une cuisine qui fonctionne vraiment. Les deux plateaux de Hiving Studio, à Clichy, sont des cuisines fonctionnelles et entièrement équipées : vous cuisinez, dressez et tournez dans la foulée, sans rien installer.',
    plateauxTitle: 'Deux cuisines, deux styles de recettes.',
    plateaux: ['studio-pro', 'studio-famille'],
    blocks: [
      { title: 'Côté cuisine', items: [
        'Studio Pro : plan inox, piano 6 feux, four UNOX',
        'Studio Pro : cellule de refroidissement jusqu\'à moins 40 °C, tour réfrigérée, Kitchen Aid, plonge et ustensiles complets',
        'Studio Famille : plaques 8 feux, hotte intégrée, four vapeur',
        'Studio Famille : îlot central mobile, plan bois, coin repas',
      ] },
      { title: 'Côté tournage', items: INCLUS.slice(3).concat(['Équipe de production sur demande, par e-mail']) },
      { title: 'Réservation', items: RESERVER },
    ],
    related: [
      { href: 'location-studio-cuisine-paris.html', label: 'Location de studio cuisine à Paris' },
      { href: 'studio-cuisine-createurs.html', label: 'Studio cuisine pour créateurs' },
      { href: 'spot-tv-cuisine.html', label: 'Spot TV cuisine' },
    ],
  },
  'studio-cuisine-createurs': {
    crumb: 'Studio cuisine créateurs',
    eyebrow: 'Créateurs de contenu · Clichy',
    h1: 'Studio cuisine',
    hand: 'pour créateurs.',
    intro: 'Contenus food, UGC, séries web : le Studio Famille est le décor de ces formats. Une cuisine habitée à la lumière douce, entièrement équipée et personnalisable sur mesure, à Clichy. Les plateaux sont ouverts à toutes les marques, agences et créateurs indépendants.',
    plateauxTitle: 'Le décor des créateurs.',
    plateaux: ['studio-famille', 'studio-pro'],
    blocks: [
      { title: 'Pour qui', items: [
        'Créateurs indépendants : devis instantané et réservation en ligne',
        'Créateurs de la maison Hiving : calendrier dédié dans l\'espace membres',
        'Marques et agences qui produisent avec des créateurs',
        'Pas besoin de passer par l\'agence Hiving pour réserver',
      ] },
      { title: 'Inclus et en option', items: INCLUS },
      { title: 'Accès et horaires', items: ACCES },
    ],
    members: true,
    related: [
      { href: 'location-studio-cuisine-paris.html', label: 'Location de studio cuisine à Paris' },
      { href: 'studio-tournage-recette.html', label: 'Studio de tournage de recettes' },
      { href: 'stop-motion-food.html', label: 'Stop motion food' },
    ],
  },
};

function detectSlug() {
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
}

function Landing() {
  const narrow = window.useHivingNarrow(760);
  const page = PAGES[detectSlug()] || PAGES['location-studio-cuisine-paris'];
  const all = window.HIVING_PLATEAUX;
  const plateaux = page.plateaux.map((s) => all.find((p) => p.slug === s)).filter(Boolean);
  const pad = narrow ? '20px' : '40px';

  return (
    <window.PageShell active="">
      <window.Breadcrumb items={[{ label: page.crumb }]} />

      {/* Hero */}
      <section style={{ padding: `${narrow ? 40 : 60}px ${pad} ${narrow ? 48 : 72}px`, maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>
          ¶ {page.eyebrow}
        </div>
        <h1 style={{
          fontFamily: P.display, fontSize: 'clamp(42px, 8vw, 120px)',
          fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 0.95, margin: 0,
        }}>
          {page.h1}<br />
          <span style={{ ...window.HIVING_HAND_ON_LIGHT, transform: 'rotate(-2deg)', display: 'inline-block' }}>{page.hand}</span>
        </h1>
        <p style={{ fontFamily: P.serif, fontSize: 'clamp(18px, 1.8vw, 24px)', lineHeight: 1.5, color: P.inkSoft, marginTop: 28, maxWidth: 760 }}>
          {page.intro}
        </p>
        <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="devis.html" style={{
            background: P.lime, color: P.ink, padding: '14px 22px', borderRadius: 999, textDecoration: 'none',
            fontFamily: P.sans, fontSize: 15, fontWeight: 600, border: `1.5px solid ${P.ink}`,
          }}>Devis instantané →</a>
          <a href="../pro/" style={{
            background: 'transparent', color: P.ink, padding: '14px 22px', borderRadius: 999, textDecoration: 'none',
            fontFamily: P.sans, fontSize: 15, fontWeight: 600, border: `1.5px solid ${P.ink}`,
          }}>Réserver un plateau</a>
          {page.members && (
            <a href="../app/" style={{
              background: 'transparent', color: P.ink, padding: '14px 22px', borderRadius: 999, textDecoration: 'none',
              fontFamily: P.sans, fontSize: 15, fontWeight: 600, border: `1.5px solid ${P.ink}`,
            }}>Espace membres</a>
          )}
        </div>
      </section>

      {/* Plateaux */}
      <section style={{ padding: `0 ${pad} ${narrow ? 64 : 100}px`, maxWidth: 1400, margin: '0 auto' }}>
        <h2 style={{ fontFamily: P.display, fontSize: 'clamp(32px, 4.5vw, 60px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 32px' }}>
          {page.plateauxTitle}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(420px, 100%), 1fr))', gap: 20 }}>
          {plateaux.map((p) => (
            <article key={p.slug} style={{
              background: p.dark ? P.ink : P.paper, color: p.dark ? P.bg : P.ink,
              borderRadius: 24, overflow: 'hidden', border: `1.5px solid ${P.ink}`,
              display: 'flex', flexDirection: 'column',
            }}>
              <picture>
                <source type="image/avif" srcSet={`../${p.img.replace('.jpg', '-400.avif')} 400w, ../${p.img.replace('.jpg', '-800.avif')} 800w`} sizes="(max-width: 760px) 100vw, 640px" />
                <source type="image/webp" srcSet={`../${p.img.replace('.jpg', '-400.webp')} 400w, ../${p.img.replace('.jpg', '-800.webp')} 800w`} sizes="(max-width: 760px) 100vw, 640px" />
                <img src={`../${p.img}`} alt={`${p.name === 'STUDIO PRO' ? 'Studio Pro' : 'Studio Famille'} de Hiving Studio à Clichy : ${p.tagline.toLowerCase()}`}
                  width="1600" height="1200" loading="lazy" decoding="async"
                  style={{ width: '100%', height: 'auto', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }} />
              </picture>
              <div style={{ padding: narrow ? '24px 22px' : '32px 32px 28px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.18em', opacity: 0.75, textTransform: 'uppercase' }}>
                  Plateau {p.num} · {p.surface} · plafond {p.ceiling}
                </div>
                <h3 style={{ fontFamily: P.display, fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
                  {p.name === 'STUDIO PRO' ? 'Studio Pro' : 'Studio Famille'} <span style={{ fontFamily: P.hand, fontWeight: 600, ...(p.dark ? { color: P.lime } : window.HIVING_HAND_ON_LIGHT) }}>{p.tagline.toLowerCase()}</span>
                </h3>
                <p style={{ fontFamily: P.serif, fontSize: 17, lineHeight: 1.55, margin: 0, opacity: 0.9 }}>{p.desc}</p>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', paddingTop: 12 }}>
                  <div style={{ fontFamily: P.display, fontSize: 28, fontWeight: 700 }}>
                    {p.price.toLocaleString('fr-FR')}&nbsp;€ <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.8 }}>HT / jour</span>
                  </div>
                  <a href={`../${p.book}`} style={{
                    background: p.dark ? P.lime : P.ink, color: p.dark ? P.ink : P.bg,
                    padding: '12px 18px', borderRadius: 999, textDecoration: 'none',
                    fontFamily: P.sans, fontSize: 14, fontWeight: 600,
                  }}>Réserver ce plateau →</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Blocs pratiques */}
      <section style={{ background: P.ink, color: P.bg, padding: `${narrow ? 64 : 100}px ${pad}` }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 40 }}>
          {page.blocks.map((b) => (
            <div key={b.title} style={{ borderTop: `1px solid ${P.bg}30`, paddingTop: 20 }}>
              <h2 style={{ fontFamily: P.display, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 18px', color: P.lime }}>{b.title}</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {b.items.map((it) => (
                  <li key={it} style={{ fontFamily: P.serif, fontSize: 17, lineHeight: 1.5, paddingLeft: 22, position: 'relative' }}>
                    <span aria-hidden="true" style={{ position: 'absolute', left: 0, color: P.lime }}>→</span>{it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Questions + liens */}
      <section style={{ padding: `${narrow ? 64 : 100}px ${pad}`, maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontFamily: P.display, fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, margin: 0 }}>
          Une question ?{' '}
          <span style={{ ...window.HIVING_HAND_ON_LIGHT }}>on vous répond.</span>
        </h2>
        <p style={{ fontFamily: P.serif, fontSize: 19, lineHeight: 1.55, color: P.inkSoft, marginTop: 20, maxWidth: 720 }}>
          Accès, horaires, matériel, annulation : les réponses sont dans notre <a href="faq.html" style={{ color: P.ink }}>FAQ</a>.
          Pour tout le reste, écrivez-nous à <a href={`mailto:${CONTACT}`} style={{ color: P.ink }}>{CONTACT}</a> (contact uniquement par e-mail).
        </p>
        <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 14 }}>
          {page.related.concat([{ href: 'tarifs.html', label: 'Tous les tarifs' }]).map((r) => (
            <a key={r.href} href={r.href} style={{
              display: 'block', background: P.cream, color: P.ink, padding: '20px 22px', borderRadius: 18,
              fontFamily: P.display, fontSize: 20, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.01em',
            }}>{r.label} →</a>
          ))}
        </div>
      </section>

      <window.BigCTA
        eyebrow="Prêt à tourner ?"
        title="On cale"
        hand="votre date."
        ctaLabel="Devis instantané"
        ctaHref="devis.html"
        ctaSecondaryLabel="Voir les plateaux"
        ctaSecondaryHref="plateaux.html"
      />
    </window.PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Landing />);
