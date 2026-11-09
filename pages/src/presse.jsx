// Source du composant React de pages/presse.html.
// Après modification : node scripts/build-jsx.mjs (voir docs/build-jsx.md).
const P = window.HIVING_PALETTE;

function PressePage() {
  const press = window.HIVING_PRESS;
  const clients = window.HIVING_CLIENTS;
  const fmtDate = d => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <window.PageShell active="presse">
      <window.Breadcrumb items={[{ label: 'Presse' }]} />

      <section style={{ padding: '60px 40px 60px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>¶ Press · Médias · Clients</div>
        <h1 style={{ fontFamily: P.display, fontSize: 'clamp(50px, 8vw, 130px)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 0.92, margin: 0 }}>
          On en parle.<br /><span style={{ fontFamily: P.hand, color: P.lime, transform: 'rotate(-2deg)', display: 'inline-block' }}>Pas qu'à nous.</span>
        </h1>
      </section>

      {/* Clients */}
      <section style={{ padding: '20px 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>Ils nous font confiance</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 0, border: `1px solid ${P.ink}15`, borderRadius: 24, overflow: 'hidden', background: P.paper }}>
          {clients.map((c, i) => (
            <div key={c} style={{
              padding: '32px 24px', textAlign: 'center',
              fontFamily: P.display, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em',
              borderRight: (i + 1) % 4 !== 0 ? `1px solid ${P.ink}10` : 'none',
              borderBottom: i < clients.length - 4 ? `1px solid ${P.ink}10` : 'none',
              color: P.ink, opacity: 0.85,
            }}>{c}</div>
          ))}
        </div>
      </section>

      {/* Press articles */}
      <section style={{ background: P.ink, color: P.bg, padding: '100px 40px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', opacity: 0.5, marginBottom: 24, textTransform: 'uppercase' }}>¶ Articles & retombées</div>
          <h2 style={{ fontFamily: P.display, fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.96, margin: '0 0 56px' }}>
            Dans la <span style={{ fontFamily: P.hand, color: P.lime }}>presse.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {press.map((p, i) => (
              <a key={p.id} href="#" style={{
                display: 'grid', gridTemplateColumns: '180px 1fr 120px auto', gap: 24,
                padding: '24px 0', borderBottom: `1px solid ${P.bg}20`,
                color: P.bg, textDecoration: 'none', alignItems: 'center',
              }}>
                <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.14em', opacity: 0.5, textTransform: 'uppercase' }}>{p.source}</div>
                <div style={{ fontFamily: P.display, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>{p.title}</div>
                <div style={{ fontFamily: P.mono, fontSize: 11, opacity: 0.5 }}>{fmtDate(p.date)}</div>
                <div style={{ fontSize: 22, opacity: 0.6 }}>↗</div>
              </a>
            ))}
          </div>

          <div style={{ marginTop: 60, padding: 32, background: `${P.bg}08`, border: `1px dashed ${P.bg}30`, borderRadius: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ fontFamily: P.display, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Press kit · 24 Mo</div>
              <div style={{ fontFamily: P.serif, fontSize: 16, opacity: 0.7, marginTop: 4 }}>Logos, photos HD, fact sheet, dossier presse.</div>
            </div>
            <a href="#" style={{ background: P.lime, color: P.ink, padding: '14px 22px', borderRadius: 999, fontFamily: P.sans, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Télécharger ↓</a>
          </div>
        </div>
      </section>

      <window.BigCTA eyebrow="Journaliste ?" title="Une question" hand="rapide ?" ctaLabel="contact@hivingfood.fr" ctaHref="mailto:contact@hivingfood.fr" />
    </window.PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PressePage />);
