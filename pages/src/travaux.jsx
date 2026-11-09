// Source du composant React de pages/travaux.html.
// Après modification : node scripts/build-jsx.mjs (voir docs/build-jsx.md).
const P = window.HIVING_PALETTE;

const WORKS = [
  { id: 'picard', client: 'Picard', cat: 'Packshot · Print', year: 2025, count: '480 visuels', featured: true, href: 'case-picard.html' },
  { id: 'bonne-maman', client: 'Bonne Maman', cat: 'Lifestyle · Social', year: 2025, count: '120 visuels' },
  { id: 'laduree', client: 'Ladurée', cat: 'Éditorial · Catalogue', year: 2025, count: '95 visuels' },
  { id: 'bordier', client: 'Bordier', cat: 'Stop motion · Social', year: 2024, count: '8 spots' },
  { id: 'maille', client: 'Maille', cat: 'Spot TV · 30s', year: 2024, count: '1 film' },
  { id: 'septime', client: 'Septime', cat: 'Éditorial chef', year: 2024, count: '40 visuels' },
];

function TravauxPage() {
  const [feat, ...rest] = WORKS;
  return (
    <window.PageShell active="travaux">
      <window.Breadcrumb items={[{ label: 'Travaux' }]} />

      <section style={{ padding: '60px 40px 60px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>¶ Travaux · Sélection</div>
        <h1 style={{ fontFamily: P.display, fontSize: 'clamp(50px, 8vw, 130px)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 0.92, margin: 0 }}>
          Quelques-uns<br /><span style={{ fontFamily: P.hand, color: P.lime, transform: 'rotate(-2deg)', display: 'inline-block' }}>de nos shoots.</span>
        </h1>
      </section>

      <section style={{ padding: '0 40px 40px', maxWidth: 1400, margin: '0 auto' }}>
        <a href={feat.href} style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 0,
          background: P.lime, color: P.ink, borderRadius: 28, overflow: 'hidden',
          textDecoration: 'none', border: `1.5px solid ${P.ink}`, minHeight: 380,
        }}>
          <div style={{ padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.18em', opacity: 0.7, marginBottom: 16, textTransform: 'uppercase' }}>★ Case study · {feat.year}</div>
              <h2 style={{ fontFamily: P.display, fontSize: 'clamp(48px, 6vw, 88px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.95, margin: 0 }}>{feat.client}</h2>
              <div style={{ fontFamily: P.serif, fontSize: 22, marginTop: 16, opacity: 0.8 }}>{feat.cat} · {feat.count}</div>
            </div>
            <div style={{ marginTop: 24, fontFamily: P.sans, fontSize: 14, fontWeight: 600 }}>Lire le case study →</div>
          </div>
          <div style={{ background: P.ink, color: P.bg, padding: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: P.display, fontSize: 240, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.85, color: P.lime }}>{feat.count.split(' ')[0]}</div>
          </div>
        </a>
      </section>

      <section style={{ padding: '20px 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {rest.map((w, i) => (
            <div key={w.id} style={{
              background: i % 2 === 0 ? P.cream : P.paper,
              padding: '28px 26px', borderRadius: 20,
              border: `1px solid ${P.ink}10`, minHeight: 220,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.18em', opacity: 0.6, textTransform: 'uppercase', marginBottom: 16 }}>{w.year} · {w.cat}</div>
                <div style={{ fontFamily: P.display, fontSize: 36, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1 }}>{w.client}</div>
                <div style={{ fontFamily: P.serif, fontSize: 17, color: P.inkSoft, marginTop: 14 }}>{w.count}</div>
              </div>
              <div style={{ marginTop: 24, fontFamily: P.mono, fontSize: 11, letterSpacing: '0.12em', opacity: 0.5, textTransform: 'uppercase' }}>Bientôt en case study</div>
            </div>
          ))}
        </div>
      </section>

      <window.BigCTA eyebrow="Le prochain ?" title="Le vôtre" hand="peut-être." ctaLabel="Devis instantané" ctaHref="devis.html" />
    </window.PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TravauxPage />);
