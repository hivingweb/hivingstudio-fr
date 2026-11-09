// Source du composant React de pages/article-tendances-2026.html.
// Après modification : node scripts/build-jsx.mjs (voir docs/build-jsx.md).
const P = window.HIVING_PALETTE;

function detectSlug() {
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf('/') + 1).replace('.html', '') || 'article-photo-food';
}

const BODIES = {
  'article-photo-food': [
    { h: '01 — Tirer sur de la lumière mixte', p: 'Mélanger lumière naturelle et tungstène, c\'est se condamner à 30 minutes de balance des blancs en post. Décidez une seule source dominante au moment du repérage. Au studio, on coupe le naturel avec des drapeaux black quand on shoote en LED.' },
    { h: '02 — Oublier le rôle de la vapeur', p: 'Une assiette qui fume, c\'est une assiette qui se vend. Mais la vraie vapeur dure 12 secondes. On la simule avec un coton chaud caché derrière le plat, ou de la fumée alimentaire au pistolet pour les vidéos.' },
    { h: '03 — Composer trop centré', p: 'La règle des tiers existe pour une raison. Décalez votre plat sur le tiers gauche ou droit, laissez respirer la nappe, ajoutez un props secondaire qui mène l\'œil. Le cerveau lit les compositions excentrées comme plus appétissantes.' },
    { h: '04 — Sur-styler', p: 'Trop de garniture = plat surchargé qui crie « c\'est pour la photo ». Gardez toujours 70 % de ce que vous savez faire, montrez 30 %. Le reste, c\'est de la suggestion.' },
    { h: '05 — Cadrer avant que le plat soit fini', p: 'Vous allez devoir le refaire 6 fois. Cadrage et lumière se valident sur un faux plat (un dummy). Le vrai n\'arrive en cadre que pour les 4 dernières prises, quand tout est déjà parfait.' },
    { h: '06 — Sous-estimer la post-prod', p: '40 % du résultat final se joue en retouche. Couleur, texture, propreté du fond, brillance. Si vous shootez en RAW + tethered avec un retoucheur sur place, vous validez le résultat final en direct, pas le cadrage seul.' },
    { h: '07 — Ne pas briefer votre équipe', p: 'Un brief écrit, avec moodboard, liste des plats, ordre de tournage et timeline. 30 min de prep = 3h gagnées en studio. C\'est le secret de notre cadence à 40 visuels/jour.' },
  ],
  'article-styliste': [
    { h: 'Le moodboard avant tout', p: 'Avant même de parler vaisselle, partagez 8-10 références visuelles qui collent à votre univers de marque. Le styliste construira sa direction à partir de là — pas de l\'inverse.' },
    { h: 'Liste de plats hiérarchisée', p: 'Vous n\'avez jamais autant de temps que vous le croyez. Hiérarchisez : 5 plats hero, 10 secondaires, 5 nice-to-have. Le styliste shootera dans cet ordre. Si on dépasse, on dépasse en bas de liste.' },
    { h: 'Budget props honnête', p: '15 à 25 % du budget shoot doit aller aux props. Vaisselle, textile, fonds. Si vous serrez trop, le styliste ressort 3 fois la même nappe — et ça se voit sur votre catalogue.' },
    { h: 'Une marge de 20 % sur le food cost', p: 'Pour 1 assiette qui passe en photo, on prépare 3 à 5 versions. Prévoyez ce buffer dans le devis. C\'est invisible jusqu\'à ce que vous en manquiez.' },
    { h: 'Référence vs créativité', p: 'Décidez à l\'avance : on reste fidèle aux références à 90 %, ou on laisse 30 % de liberté créative ? Les deux marchent. Mais flou = friction en plateau.' },
  ],
  'article-tendances-2026': [
    { h: 'Le contraste haut-clé revient', p: 'Après 5 ans de pastels, le contraste fort revient en force. Fonds noirs profonds, lumière unique très dirigée, ombres assumées. On le voit chez les chefs étoilés et les marques craft.' },
    { h: 'Compositions verticales 9:16', p: 'Le format reels/TikTok a tué le 1:1. Tout se shoote en vertical, et la photo print suit. Penser ses cadrages dès le départ pour les deux formats économise 30 % de temps en post.' },
    { h: 'Frame within the frame', p: 'Cadres dans le cadre — fenêtre, porte, table dressée vue d\'en haut. Effet « peeking » qui fait scroller plus longtemps sur les feeds.' },
    { h: 'Le retour du tungstène chaud', p: 'Le 3200K assumé, avec ses dominantes oranges. Plus chaud, plus rétro, plus appétissant. Particulièrement fort en cooking show et film de geste.' },
    { h: 'Imperfection visible', p: 'Miettes, traces de doigts, plats à moitié finis. La perfection léchée ne convertit plus. Les marques qui osent l\'imperfection contrôlée gagnent en authenticité.' },
    { h: 'Nature morte XXL', p: 'Tables longues, accumulation, abondance. Réaction au minimalisme nordique des années 2020. Les marques B Corp et bio mènent la danse.' },
  ],
};

const META = {
  'article-photo-food': { eyebrow: 'Pratique', title: '7 erreurs à éviter en photo culinaire', author: 'Léa Marchand · Cheffe styliste', date: '22 avril 2026', read: 6, hand: 'à éviter.' },
  'article-styliste': { eyebrow: 'Méthode', title: 'Comment bien briefer un styliste culinaire', author: 'Camille Dorsay · Directrice studio', date: '8 avril 2026', read: 5, hand: 'au styliste.' },
  'article-tendances-2026': { eyebrow: 'Tendances', title: 'Tendances food photography 2026', author: 'Studio Hiving', date: '30 mars 2026', read: 8, hand: 'cette année.' },
};

function ArticlePage() {
  const slug = detectSlug();
  const m = META[slug] || META['article-photo-food'];
  const body = BODIES[slug] || BODIES['article-photo-food'];

  React.useEffect(() => {
    const ld = document.getElementById('ld-article');
    if (ld) ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": m.title,
      "datePublished": m.date,
      "author": { "@type": "Person", "name": m.author.split(' · ')[0] },
      "publisher": { "@type": "Organization", "name": "HIVING FOOD", "url": "https://hivingstudio.fr" }
    });
  }, [slug]);

  return (
    <window.PageShell active="carnet">
      <window.Breadcrumb items={[{ label: 'Le Carnet', href: 'carnet.html' }, { label: m.title }]} />

      <article style={{ padding: '60px 40px 40px', maxWidth: 880, margin: '0 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>
          ¶ {m.eyebrow} · {m.read} min de lecture
        </div>
        <h1 style={{ fontFamily: P.display, fontSize: 'clamp(40px, 6vw, 84px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.98, margin: 0 }}>
          {m.title.split(' ').slice(0, -1).join(' ')} <span style={{ fontFamily: P.hand, color: P.lime, transform: 'rotate(-2deg)', display: 'inline-block' }}>{m.hand}</span>
        </h1>
        <div style={{ marginTop: 32, paddingBottom: 24, borderBottom: `1px solid ${P.ink}15`, fontFamily: P.mono, fontSize: 11, letterSpacing: '0.14em', color: P.inkSoft, textTransform: 'uppercase', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <span>Publié le {m.date}</span>
          <span>·</span>
          <span>{m.author}</span>
        </div>

        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 36 }}>
          {body.map((b, i) => (
            <section key={i}>
              <h2 style={{ fontFamily: P.display, fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 12px' }}>{b.h}</h2>
              <p style={{ fontFamily: P.serif, fontSize: 19, lineHeight: 1.65, color: P.ink, margin: 0 }}>{b.p}</p>
            </section>
          ))}
        </div>
      </article>

      <section style={{ padding: '60px 40px 80px', maxWidth: 880, margin: '0 auto' }}>
        <div style={{ background: P.lime, padding: 32, borderRadius: 24, border: `1.5px solid ${P.ink}` }}>
          <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.16em', color: P.ink, opacity: 0.7, textTransform: 'uppercase', marginBottom: 12 }}>Vous voulez qu'on s'en occupe ?</div>
          <div style={{ fontFamily: P.display, fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }}>Demandez un devis instantané · 2 min</div>
          <a href="devis.html" style={{ display: 'inline-block', marginTop: 16, padding: '14px 22px', background: P.ink, color: P.bg, borderRadius: 999, textDecoration: 'none', fontFamily: P.sans, fontSize: 14, fontWeight: 600 }}>Configurer mon devis →</a>
        </div>
      </section>

      <window.BigCTA eyebrow="Le Carnet" title="Lire d'autres" hand="articles." ctaLabel="Tous les articles" ctaHref="carnet.html" />
    </window.PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ArticlePage />);
