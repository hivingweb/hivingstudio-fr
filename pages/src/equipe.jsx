// Source du composant React de pages/equipe.html.
// Après modification : node scripts/build-jsx.mjs (voir docs/build-jsx.md).
const P = window.HIVING_PALETTE;

function EquipePage() {
  const team = window.HIVING_TEAM_FULL;
  const certs = window.HIVING_CERTS;

  return (
    <window.PageShell active="equipe">
      <window.Breadcrumb items={[{ label: 'Équipe' }]} />

      <section style={{ padding: '60px 40px 60px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>¶ Équipe · {team.length} personnes</div>
        <h1 style={{ fontFamily: P.display, fontSize: 'clamp(50px, 8vw, 130px)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 0.92, margin: 0 }}>
          Une équipe<br /><span style={{ fontFamily: P.hand, color: P.lime, transform: 'rotate(-2deg)', display: 'inline-block' }}>réunie ici.</span>
        </h1>
        <p style={{ fontFamily: P.serif, fontSize: 22, lineHeight: 1.5, color: P.inkSoft, marginTop: 24, maxWidth: 720 }}>
          Direction, stylisme, cuisine, lumière, coordination — six expert·es qui font tourner le studio.
        </p>
      </section>

      <section style={{ padding: '0 40px 100px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {team.map((p, i) => (
            <article key={p.id} style={{
              background: i === 0 ? P.lime : P.paper,
              padding: '28px 28px 24px', borderRadius: 24,
              border: `1px solid ${P.ink}10`,
            }}>
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                background: P.cream, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: P.display, fontSize: 32, fontWeight: 700,
                color: P.ink, marginBottom: 20, border: `1.5px solid ${P.ink}`,
              }}>
                {p.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', opacity: 0.6, marginBottom: 6, textTransform: 'uppercase' }}>{p.role}</div>
              <h3 style={{ fontFamily: P.display, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>{p.name}</h3>
              <p style={{ fontFamily: P.serif, fontSize: 16, lineHeight: 1.5, color: P.inkSoft, marginTop: 14 }}>{p.bio}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
                {p.tags.map(t => (
                  <span key={t} style={{ padding: '4px 10px', background: i === 0 ? P.ink : P.cream, color: i === 0 ? P.bg : P.ink, borderRadius: 999, fontFamily: P.mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Certifs */}
      <section style={{ background: P.ink, color: P.bg, padding: '100px 40px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', opacity: 0.5, marginBottom: 24, textTransform: 'uppercase' }}>¶ Garanties & certifications</div>
          <h2 style={{ fontFamily: P.display, fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.96, margin: '0 0 56px' }}>
            On bosse <span style={{ fontFamily: P.hand, color: P.lime }}>cadré.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {certs.map((c, i) => (
              <div key={i} style={{ paddingTop: 16, borderTop: `1px solid ${P.bg}25` }}>
                <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', opacity: 0.6, marginBottom: 10, textTransform: 'uppercase' }}>{c.name}</div>
                <div style={{ fontFamily: P.serif, fontSize: 22, lineHeight: 1.3 }}>{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <window.BigCTA eyebrow="On bosse ensemble ?" title="Discutons" hand="de votre projet." ctaLabel="Devis instantané" ctaHref="devis.html" />
    </window.PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<EquipePage />);
