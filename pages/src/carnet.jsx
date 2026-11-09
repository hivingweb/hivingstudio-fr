// Source du composant React de pages/carnet.html.
// Après modification : node scripts/build-jsx.mjs (voir docs/build-jsx.md).
const P = window.HIVING_PALETTE;

function CarnetPage() {
  const articles = window.HIVING_ARTICLES;
  const [feat, ...rest] = articles;

  return (
    <window.PageShell active="carnet">
      <window.Breadcrumb items={[{ label: 'Le Carnet' }]} />

      <section style={{ padding: '60px 40px 60px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>¶ Le Carnet · {articles.length} articles</div>
        <h1 style={{ fontFamily: P.display, fontSize: 'clamp(50px, 8vw, 130px)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 0.92, margin: 0 }}>
          Notes, méthodes,<br /><span style={{ ...window.HIVING_HAND_ON_LIGHT, transform: 'rotate(-2deg)', display: 'inline-block' }}>tendances.</span>
        </h1>
        <p style={{ fontFamily: P.serif, fontSize: 22, lineHeight: 1.5, color: P.inkSoft, marginTop: 24, maxWidth: 720 }}>
          Ce qu'on apprend en studio, on l'écrit ici. Par notre équipe.
        </p>
      </section>

      <section style={{ padding: '0 40px 40px', maxWidth: 1400, margin: '0 auto' }}>
        <a href={`${feat.slug}.html`} style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 0,
          background: P.lime, color: P.ink, borderRadius: 28, overflow: 'hidden',
          textDecoration: 'none', border: `1.5px solid ${P.ink}`, minHeight: 400,
        }}>
          <div style={{ padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.18em', opacity: 0.7, marginBottom: 16, textTransform: 'uppercase' }}>★ À la une · {feat.eyebrow}</div>
              <h2 style={{ fontFamily: P.display, fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.02, margin: 0 }}>{feat.title}</h2>
              <p style={{ fontFamily: P.serif, fontSize: 19, lineHeight: 1.5, color: P.ink, opacity: 0.8, marginTop: 20, maxWidth: 520 }}>{feat.excerpt}</p>
            </div>
            <div style={{ marginTop: 32, fontFamily: P.mono, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7 }}>
              {feat.author} · {feat.readTime} min de lecture
            </div>
          </div>
          <div style={{ background: P.ink, color: P.bg, padding: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: P.display, fontSize: 280, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.85, color: P.lime, opacity: 0.9 }}>
              {String(articles.indexOf(feat) + 1).padStart(2, '0')}
            </div>
          </div>
        </a>
      </section>

      <section style={{ padding: '40px 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {rest.map((a, i) => (
            <a key={a.slug} href={`${a.slug}.html`} style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              background: i % 2 === 0 ? P.cream : P.paper, padding: '32px 28px', borderRadius: 24,
              textDecoration: 'none', color: P.ink, minHeight: 280,
              border: `1px solid ${P.ink}10`,
            }}>
              <div>
                <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.18em', opacity: 0.6, textTransform: 'uppercase', marginBottom: 16 }}>
                  {a.eyebrow} · {a.readTime} min
                </div>
                <h3 style={{ fontFamily: P.display, fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0 }}>{a.title}</h3>
                <p style={{ fontFamily: P.serif, fontSize: 17, lineHeight: 1.5, color: P.inkSoft, marginTop: 16 }}>{a.excerpt}</p>
              </div>
              <div style={{ marginTop: 24, fontFamily: P.mono, fontSize: 11, letterSpacing: '0.12em', color: P.inkSoft, textTransform: 'uppercase' }}>
                Lire →
              </div>
            </a>
          ))}
        </div>
      </section>

      <window.BigCTA eyebrow="On reste en contact" title="Newsletter" hand="mensuelle." ctaLabel="S'abonner" ctaHref="#" ctaSecondaryLabel="Voir les plateaux" ctaSecondaryHref="plateaux.html" />
    </window.PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CarnetPage />);
