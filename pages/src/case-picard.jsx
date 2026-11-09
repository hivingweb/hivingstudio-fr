// Source du composant React de pages/case-picard.html.
// Après modification : node scripts/build-jsx.mjs (voir docs/build-jsx.md).
const P = window.HIVING_PALETTE;

const STEPS = [
  { num: '01', l: 'Brief & repérage', d: 'Réception du briefing créatif Publicis Conseil. 3 univers à shooter : pasta, pizza, desserts. Style "vu de dessus" + lifestyle table dressée.', dur: 'J-21' },
  { num: '02', l: 'Pré-prod', d: 'Casting props, achat 12 services de vaisselle, repérage Marché des Enfants Rouges pour les fonds frais. Validation moodboard.', dur: 'J-14' },
  { num: '03', l: 'Test shoot', d: 'Demi-journée test sur 6 produits-clés. Calibration light + workflow tethered. Validation client en direct.', dur: 'J-7' },
  { num: '04', l: 'Production', d: '12 jours sur 2 plateaux en parallèle. 2 photographes, 4 stylistes, 2 retoucheurs en post sur place. Cadence 40-45 visuels/jour.', dur: 'J0 → J+12' },
  { num: '05', l: 'Post-prod', d: 'Détourage + colorimétrie + retouche fine. Livraison J+18 en 4 formats (print, e-com, social, OOH).', dur: 'J+18' },
];

const KPIS = [
  { v: '480', l: 'packshots livrés' },
  { v: '12', l: 'jours plateau' },
  { v: '2', l: 'plateaux en parallèle' },
  { v: '+34%', l: 'CTR vs campagne 2024' },
];

function CasePicard() {
  return (
    <window.PageShell active="travaux">
      <window.Breadcrumb items={[{ label: 'Travaux', href: 'travaux.html' }, { label: 'Picard 2025' }]} />

      <section style={{ padding: '60px 40px 60px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>¶ Case study · 2025 · Picard</div>
        <h1 style={{ fontFamily: P.display, fontSize: 'clamp(50px, 8vw, 130px)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 0.92, margin: 0 }}>
          480 visuels<br /><span style={{ fontFamily: P.hand, color: P.lime, transform: 'rotate(-2deg)', display: 'inline-block' }}>en 12 jours.</span>
        </h1>
        <p style={{ fontFamily: P.serif, fontSize: 'clamp(20px, 1.8vw, 26px)', lineHeight: 1.5, color: P.inkSoft, marginTop: 24, maxWidth: 720 }}>
          Campagne print + digital pour la nouvelle gamme Picard. Pasta, pizza, desserts. 2 plateaux en simultané, 6 jours chaque.
        </p>
      </section>

      {/* KPIs */}
      <section style={{ padding: '0 40px 60px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {KPIS.map((k, i) => (
            <div key={i} style={{
              background: i === 0 ? P.lime : P.paper,
              padding: '32px 28px', borderRadius: 20,
              border: `1px solid ${P.ink}10`,
            }}>
              <div style={{ fontFamily: P.display, fontSize: 64, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, color: P.ink }}>{k.v}</div>
              <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.14em', color: P.inkSoft, marginTop: 8, textTransform: 'uppercase' }}>{k.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Brief */}
      <section style={{ padding: '60px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>¶ Le brief</div>
        <h2 style={{ fontFamily: P.display, fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.05, margin: 0 }}>
          « Refresher la <span style={{ fontFamily: P.hand, color: P.lime }}>signature visuelle</span> de Picard sur 3 univers, en gardant l'ADN. »
        </h2>
        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
          {[
            { l: 'Client', v: 'Picard Surgelés' },
            { l: 'Agence', v: 'Publicis Conseil' },
            { l: 'Période', v: 'Mars 2025' },
            { l: 'Univers', v: 'Pasta · Pizza · Desserts' },
            { l: 'Plateaux', v: '2 plateaux en parallèle' },
            { l: 'Diffusion', v: 'Print, e-com, social, OOH' },
          ].map((it, i) => (
            <div key={i} style={{ paddingTop: 14, borderTop: `1px solid ${P.ink}15` }}>
              <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 6, textTransform: 'uppercase' }}>{it.l}</div>
              <div style={{ fontFamily: P.serif, fontSize: 19, lineHeight: 1.3 }}>{it.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Méthode */}
      <section style={{ background: P.ink, color: P.bg, padding: '100px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', opacity: 0.5, marginBottom: 24, textTransform: 'uppercase' }}>¶ Notre méthode</div>
          <h2 style={{ fontFamily: P.display, fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.96, margin: '0 0 56px' }}>
            5 étapes, <span style={{ fontFamily: P.hand, color: P.lime }}>zéro surprise.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '120px 1fr 100px', gap: 32,
                padding: '32px 0', borderTop: `1px solid ${P.bg}20`, alignItems: 'flex-start',
              }}>
                <div style={{ fontFamily: P.display, fontSize: 56, fontWeight: 700, letterSpacing: '-0.02em', color: P.lime, lineHeight: 1 }}>{s.num}</div>
                <div>
                  <div style={{ fontFamily: P.display, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>{s.l}</div>
                  <p style={{ fontFamily: P.serif, fontSize: 17, lineHeight: 1.5, opacity: 0.8, margin: '8px 0 0', maxWidth: 640 }}>{s.d}</p>
                </div>
                <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.14em', opacity: 0.5, textTransform: 'uppercase', textAlign: 'right' }}>{s.dur}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section style={{ padding: '120px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontFamily: P.display, fontSize: 'clamp(36px, 4.5vw, 56px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, fontStyle: 'italic' }}>
          <span style={{ fontFamily: P.display, fontSize: '2em', color: P.lime, lineHeight: 0, verticalAlign: '-0.4em' }}>“</span>
          {' '}HIVING a tenu une cadence qu'aucun studio nous avait offert. 40 visuels jour, retouche live, brief respecté à la virgule. On y retourne.{' '}
          <span style={{ fontFamily: P.display, fontSize: '2em', color: P.lime, lineHeight: 0, verticalAlign: '-0.4em' }}>”</span>
        </div>
        <div style={{ marginTop: 32, fontFamily: P.mono, fontSize: 11, letterSpacing: '0.16em', color: P.inkSoft, textTransform: 'uppercase' }}>
          — Marie Lecomte · Direction artistique Picard
        </div>
      </section>

      <window.BigCTA eyebrow="Vous voulez la même cadence ?" title="On reproduit" hand="quand vous voulez." ctaLabel="Devis instantané" ctaHref="devis.html" ctaSecondaryLabel="Voir tous les travaux" ctaSecondaryHref="travaux.html" />
    </window.PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CasePicard />);
