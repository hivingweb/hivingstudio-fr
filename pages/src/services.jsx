// Source du composant React de pages/services.html.
// Après modification : node scripts/build-jsx.mjs (voir docs/build-jsx.md).
const P = window.HIVING_PALETTE;

function ServicesPage() {
  const { t } = window.useT();
  const services = window.HIVING_SERVICES;

  return (
    <window.PageShell active="services">
      <window.Breadcrumb items={[{ label: 'Services' }]} />

      {/* Hero */}
      <section style={{ padding: '80px 40px 100px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>
          ¶ Services · 4 expertises
        </div>
        <h1 style={{
          fontFamily: P.display, fontSize: 'clamp(54px, 8.5vw, 140px)',
          fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 0.92, margin: 0,
        }}>
          Photographier<br />
          <span style={{ fontFamily: P.hand, color: P.lime, fontWeight: 700, transform: 'rotate(-2deg)', display: 'inline-block', marginRight: '0.2em' }}>&</span>
          filmer<br />
          la nourriture.
        </h1>
        <p style={{
          fontFamily: P.serif, fontSize: 'clamp(20px, 1.8vw, 26px)', lineHeight: 1.45,
          color: P.inkSoft, marginTop: 40, maxWidth: 720,
        }}>
          Quatre métiers, deux plateaux, une équipe.
          De la photo packshot e-commerce au spot TV chef étoilé,
          on a outillé chaque scénario pour que vous n'ayez plus qu'à créer.
        </p>
      </section>

      {/* Services grid */}
      <section style={{ padding: '40px 40px 120px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
          {services.map((s, i) => (
            <a key={s.slug} href={`${s.slug}.html`} data-cursor="" style={{
              display: 'block', textDecoration: 'none', color: P.ink,
              background: i % 3 === 1 ? P.ink : (i % 3 === 2 ? P.lime : P.cream),
              padding: '40px 36px 36px', borderRadius: 28,
              position: 'relative', overflow: 'hidden',
              transition: 'transform 0.3s cubic-bezier(.34,1.56,.64,1)',
              minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = ''}
            >
              <div>
                <div style={{
                  fontFamily: P.mono, fontSize: 10, letterSpacing: '0.18em',
                  color: i % 3 === 1 ? `${P.bg}aa` : `${P.ink}aa`,
                  textTransform: 'uppercase', marginBottom: 24,
                }}>
                  {s.eyebrow} · {String(i + 1).padStart(2, '0')}
                </div>
                <h2 style={{
                  fontFamily: P.display, fontSize: 'clamp(36px, 4vw, 52px)',
                  fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1,
                  margin: 0, color: i % 3 === 1 ? P.bg : P.ink,
                }}>
                  {s.title}
                </h2>
                <p style={{
                  fontFamily: P.serif, fontSize: 19, lineHeight: 1.5,
                  marginTop: 20, color: i % 3 === 1 ? `${P.bg}d0` : P.inkSoft, maxWidth: 480,
                }}>
                  {s.hero}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 32 }}>
                <div>
                  <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', opacity: 0.6, textTransform: 'uppercase' }}>à partir de</div>
                  <div style={{ fontFamily: P.display, fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, marginTop: 6 }}>
                    {s.from.toLocaleString('fr-FR')}&nbsp;€
                    <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.6, marginLeft: 6 }}>HT</span>
                  </div>
                </div>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  border: `1.5px solid ${i % 3 === 1 ? P.bg : P.ink}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, color: i % 3 === 1 ? P.bg : P.ink,
                }}>→</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <window.BigCTA
        eyebrow="Pas sûr de quel service ?"
        title="On en parle"
        hand="ensemble."
        ctaLabel={t('cta.devis')}
        ctaHref="devis.html"
        ctaSecondaryLabel={t('cta.visite')}
        ctaSecondaryHref="../index.html#reserver"
      />
    </window.PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ServicesPage />);
