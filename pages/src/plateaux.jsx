// Source du composant React de pages/plateaux.html.
// Après modification : node scripts/build-jsx.mjs (voir docs/build-jsx.md).
const P = window.HIVING_PALETTE;

function PlateauxHub() {
  const plateaux = window.HIVING_PLATEAUX;

  return (
    <window.PageShell active="plateaux">
      <window.Breadcrumb items={[{ label: 'Plateaux' }]} />

      <section style={{ padding: '60px 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>
          ¶ Nos plateaux · Clichy 92
        </div>
        <h1 style={{
          fontFamily: P.display, fontSize: 'clamp(54px, 9vw, 150px)',
          fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.9, margin: 0,
        }}>
          Deux plateaux,<br />
          <span style={{ fontFamily: P.hand, color: P.lime, transform: 'rotate(-2deg)', display: 'inline-block', marginLeft: '-0.05em' }}>un toit.</span>
        </h1>
        <p style={{ fontFamily: P.serif, fontSize: 22, lineHeight: 1.5, color: P.inkSoft, marginTop: 24, maxWidth: 720 }}>
          Deux plateaux, deux ambiances, le même immeuble à Clichy. Vous réservez votre journée en ligne, tout est déjà installé quand vous arrivez.
        </p>
        <div style={{ marginTop: 36, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <a href="../index.html#plateaux" style={{
            background: P.lime, color: P.ink,
            padding: '14px 22px', borderRadius: 999, textDecoration: 'none',
            fontFamily: P.sans, fontSize: 14, fontWeight: 600,
            border: `1.5px solid ${P.ink}`,
          }}>Voir les photos des plateaux →</a>
          <a href="../index.html#visite" style={{
            background: 'transparent', color: P.ink,
            padding: '14px 22px', borderRadius: 999, textDecoration: 'none',
            fontFamily: P.sans, fontSize: 14, fontWeight: 600,
            border: `1.5px solid ${P.ink}`,
          }}>Visite virtuelle 360°</a>
        </div>
      </section>

      {/* Cards full-width per plateau */}
      <section style={{ padding: '0 40px 120px', maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {plateaux.map((p, i) => {
          const dark = p.dark;
          return (
            <a key={p.slug} href={`../${p.book}`} style={{
              display: 'grid', gridTemplateColumns: '1fr 380px', gap: 0, alignItems: 'stretch',
              textDecoration: 'none', color: dark ? P.bg : P.ink,
              background: dark ? P.ink : P.lime, borderRadius: 28, overflow: 'hidden',
              border: `1.5px solid ${P.ink}`, minHeight: 320,
            }}>
              <div style={{ padding: '40px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.18em', opacity: 0.6, marginBottom: 20, textTransform: 'uppercase' }}>
                    Plateau {p.num}
                  </div>
                  <div style={{ fontFamily: P.display, fontSize: 'clamp(44px, 5.5vw, 80px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.95 }}>
                    {p.name}
                  </div>
                  <div style={{ fontFamily: P.hand, fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 700, color: dark ? P.lime : P.ink, transform: 'rotate(-2deg)', display: 'inline-block', marginTop: 4 }}>
                    {p.tagline}
                  </div>
                  <p style={{ fontFamily: P.serif, fontSize: 18, lineHeight: 1.5, color: dark ? `${P.bg}d0` : P.inkSoft, marginTop: 20, maxWidth: 520 }}>
                    {p.desc}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24 }}>
                  {p.tags.map(t => (
                    <span key={t} style={{
                      padding: '5px 12px',
                      background: dark ? `${P.bg}20` : `${P.ink}15`,
                      borderRadius: 999, fontFamily: P.mono, fontSize: 10,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{
                padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                borderLeft: `1.5px solid ${dark ? `${P.bg}30` : `${P.ink}20`}`,
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { l: 'Surface', v: p.surface },
                    { l: 'Plafond', v: p.ceiling },
                  ].map((s, j) => (
                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', opacity: 0.6, textTransform: 'uppercase' }}>{s.l}</span>
                      <span style={{ fontFamily: P.serif, fontSize: 18, fontWeight: 600 }}>{s.v}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', opacity: 0.6, textTransform: 'uppercase' }}>La journée</div>
                  <div style={{ fontFamily: P.display, fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, marginTop: 4 }}>
                    {p.price.toLocaleString('fr-FR')}&nbsp;€<span style={{ fontSize: 14, fontWeight: 400, opacity: 0.6, marginLeft: 6 }}>HT / jour</span>
                  </div>
                  <div style={{
                    marginTop: 20, padding: '12px 16px',
                    background: dark ? P.lime : P.ink,
                    color: dark ? P.ink : P.bg,
                    borderRadius: 999, textAlign: 'center',
                    fontFamily: P.sans, fontSize: 13, fontWeight: 600,
                  }}>
                    Réserver ce plateau →
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </section>

      <window.BigCTA
        eyebrow="Plus simple à choisir"
        title="On vous aide"
        hand="à choisir."
        ctaLabel="Devis instantané"
        ctaHref="devis.html"
        ctaSecondaryLabel="Voir les plateaux →"
        ctaSecondaryHref="../index.html#plateaux"
      />
    </window.PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PlateauxHub />);
