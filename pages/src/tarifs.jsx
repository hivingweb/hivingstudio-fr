// Source du composant React de pages/tarifs.html.
// Après modification : node scripts/build-jsx.mjs (voir docs/build-jsx.md).
const P = window.HIVING_PALETTE;

function TarifsPage() {
  const plateaux = window.HIVING_PLATEAUX;
  const addons = window.HIVING_ADDONS_FULL;
  const cats = [...new Set(addons.map(a => a.cat))];

  return (
    <window.PageShell active="tarifs">
      <window.Breadcrumb items={[{ label: 'Tarifs' }]} />

      <section style={{ padding: '60px 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>
          ¶ Tarification publique · 2026
        </div>
        <h1 style={{ fontFamily: P.display, fontSize: 'clamp(54px, 9vw, 140px)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.9, margin: 0 }}>
          Tarifs<br />
          <span style={{ ...window.HIVING_HAND_ON_LIGHT, transform: 'rotate(-2deg)', display: 'inline-block' }}>transparents.</span>
        </h1>
        <p style={{ fontFamily: P.serif, fontSize: 22, lineHeight: 1.5, color: P.inkSoft, marginTop: 24, maxWidth: 720 }}>
          Pas de devis caché. Tous nos tarifs sont publics. HT, hors food cost, sans frais de dossier.
        </p>
      </section>

      {/* Plateaux pricing */}
      <section style={{ padding: '0 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {plateaux.map(p => {
            const dark = p.dark;
            return (
              <div key={p.slug} style={{ background: dark ? P.ink : P.lime, color: dark ? P.bg : P.ink, padding: 32, borderRadius: 24, border: `1.5px solid ${P.ink}` }}>
                <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.18em', opacity: 0.6, marginBottom: 12, textTransform: 'uppercase' }}>
                  Plateau {p.num}
                </div>
                <div style={{ fontFamily: P.display, fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>{p.name}</div>
                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: P.serif, fontSize: 18 }}>La journée</span>
                    <span style={{ fontFamily: P.display, fontSize: 28, fontWeight: 700 }}>{p.price.toLocaleString('fr-FR')}&nbsp;€ <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.7 }}>HT</span></span>
                  </div>
                </div>
                <a href={`../${p.book}`} style={{ display: 'block', marginTop: 24, padding: '12px 18px', background: dark ? P.lime : P.ink, color: dark ? P.ink : P.bg, borderRadius: 999, textAlign: 'center', textDecoration: 'none', fontFamily: P.sans, fontSize: 13, fontWeight: 600 }}>
                  Réserver ce plateau →
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add-ons */}
      <section style={{ background: P.ink, color: P.bg, padding: '100px 40px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', opacity: 0.5, marginBottom: 24, textTransform: 'uppercase' }}>¶ Options & add-ons</div>
          <h2 style={{ fontFamily: P.display, fontSize: 'clamp(40px, 5.5vw, 76px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.96, margin: '0 0 56px' }}>
            Vous réservez,<br /><span style={{ fontFamily: P.hand, color: P.lime }}>vous choisissez.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
            {cats.map(cat => (
              <div key={cat}>
                <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', opacity: 0.5, marginBottom: 16, textTransform: 'uppercase' }}>{cat}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 0, borderTop: `1px solid ${P.bg}25` }}>
                  {addons.filter(a => a.cat === cat).map(a => (
                    <div key={a.id} style={{ padding: '20px 0', borderBottom: `1px solid ${P.bg}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: P.serif, fontSize: 19, fontWeight: 600 }}>{a.name}</div>
                        <div style={{ fontFamily: P.sans, fontSize: 13, opacity: 0.6, marginTop: 2 }}>{a.desc}</div>
                      </div>
                      <div style={{ fontFamily: P.display, fontSize: 22, fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {a.price === 0 ? 'au coût' : `${a.price}\u00a0€ HT`}
                        <span style={{ fontFamily: P.mono, fontSize: 10, opacity: 0.5, marginLeft: 6 }}>/{a.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section style={{ padding: '100px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>¶ Conditions</div>
        <h2 style={{ fontFamily: P.display, fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 40px' }}>
          Les <span style={{ ...window.HIVING_HAND_ON_LIGHT }}>petites lignes</span> en gros.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
          {[
            { l: 'Réservation', v: 'Devis Pennylane, puis paiement en ligne. La date est confirmée à réception du paiement : sans paiement, pas de prestation.' },
            { l: 'Annulation', v: 'Gratuite jusqu\'à J-14. 50% J-7. 100% J-3.' },
            { l: 'Option 48 h', v: 'Votre date est bloquée 48 h, le temps de régler la facture.' },
            { l: 'Fidélité', v: '-10 % à partir du 3e tournage dans l\'année.' },
            { l: 'Pack matériel', v: '-15 % sur tout le matos quand vous réservez le plateau.' },
            { l: 'Paiement', v: 'Virement, CB, Stripe. Net 30 sur dossier.' },
          ].map((it, i) => (
            <div key={i} style={{ paddingTop: 16, borderTop: `1px solid ${P.ink}15` }}>
              <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 10, textTransform: 'uppercase' }}>{it.l}</div>
              <p style={{ fontFamily: P.serif, fontSize: 18, lineHeight: 1.5, margin: 0 }}>{it.v}</p>
            </div>
          ))}
        </div>
      </section>

      <window.BigCTA eyebrow="Estimation immédiate" title="Calculez votre" hand="devis." ctaLabel="Devis instantané" ctaHref="devis.html" ctaSecondaryLabel="Voir les plateaux →" ctaSecondaryHref="../index.html#plateaux" />
    </window.PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TarifsPage />);
