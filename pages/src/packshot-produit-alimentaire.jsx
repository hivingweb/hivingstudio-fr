// Source du composant React de pages/packshot-produit-alimentaire.html.
// Après modification : node scripts/build-jsx.mjs (voir docs/build-jsx.md).
const P = window.HIVING_PALETTE;

// Détecter le service à partir du nom de fichier
function detectSlug() {
  const path = window.location.pathname;
  const file = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
  return file || 'photo-culinaire-paris';
}

function ServiceDetail() {
  const narrow = window.useHivingNarrow(900);
  const slug = detectSlug();
  const services = window.HIVING_SERVICES;
  const service = services.find(s => s.slug === slug) || services[0];
  const others = services.filter(s => s.slug !== service.slug);

  // Inject Schema.org
  React.useEffect(() => {
    const ldService = document.getElementById('ld-service');
    if (ldService) {
      ldService.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.title,
        "description": service.desc,
        "provider": { "@type": "LocalBusiness", "name": "HIVING FOOD", "url": "https://hivingstudio.fr", "address": { "@type": "PostalAddress", "streetAddress": "4 rue Mozart", "addressLocality": "Clichy", "postalCode": "92110", "addressCountry": "FR" } },
        "areaServed": { "@type": "City", "name": "Paris" },
        "offers": { "@type": "Offer", "price": String(service.from), "priceCurrency": "EUR" }
      });
    }
    const ldFaq = document.getElementById('ld-faq');
    if (ldFaq && service.faq) {
      ldFaq.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": service.faq.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      });
    }
  }, [service.slug]);

  return (
    <window.PageShell active="services">
      <window.Breadcrumb items={[
        { label: 'Services', href: 'services.html' },
        { label: service.title },
      ]} />

      {/* Hero */}
      <section style={{ padding: narrow ? '40px 20px 60px' : '60px 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: narrow ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) 380px', gap: narrow ? 40 : 80, alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>
              ¶ {service.eyebrow}
            </div>
            <h1 style={{
              fontFamily: P.display, fontSize: 'clamp(48px, 7vw, 110px)',
              fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 0.94, margin: 0,
            }}>
              {service.title}
            </h1>
            <p style={{
              fontFamily: P.serif, fontSize: 'clamp(22px, 2.2vw, 32px)', lineHeight: 1.35,
              color: P.ink, marginTop: 40, maxWidth: 720, fontStyle: 'italic',
            }}>
              « {service.hero} »
            </p>
            <p style={{ fontFamily: P.sans, fontSize: 18, lineHeight: 1.6, color: P.inkSoft, marginTop: 24, maxWidth: 720 }}>
              {service.desc}
            </p>
          </div>
          <div style={{
            background: P.lime, padding: 32, borderRadius: 24,
            border: `1.5px solid ${P.ink}`, position: narrow ? 'static' : 'sticky', top: 120,
          }}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.18em', color: P.ink, opacity: 0.7, textTransform: 'uppercase', marginBottom: 8 }}>
              À partir de
            </div>
            <div style={{ fontFamily: P.display, fontSize: 56, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1 }}>
              {service.from.toLocaleString('fr-FR')}&nbsp;€
            </div>
            <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.12em', marginTop: 4, opacity: 0.7 }}>
              HT / journée
            </div>
            <div style={{ height: 1, background: `${P.ink}30`, margin: '20px 0' }} />
            <a href="devis.html" style={{
              display: 'block', background: P.ink, color: P.bg,
              padding: '16px 22px', borderRadius: 999, textAlign: 'center',
              fontFamily: P.sans, fontSize: 15, fontWeight: 600, textDecoration: 'none',
              marginBottom: 10,
            }}>
              Devis instantané →
            </a>
            <a href="../pro/" style={{
              display: 'block', background: 'transparent', color: P.ink,
              padding: '14px 22px', borderRadius: 999, textAlign: 'center',
              fontFamily: P.sans, fontSize: 14, fontWeight: 500, textDecoration: 'none',
              border: `1.5px solid ${P.ink}`,
            }}>
              Réserver un plateau
            </a>
          </div>
        </div>
      </section>

      {/* Bullets */}
      <section style={{ background: P.ink, color: P.bg, padding: '100px 40px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', opacity: 0.5, marginBottom: 24, textTransform: 'uppercase' }}>
            ¶ Sur place
          </div>
          <h2 style={{
            fontFamily: P.display, fontSize: 'clamp(40px, 5.5vw, 76px)',
            fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.96, margin: 0,
          }}>
            Une cuisine équipée,<br />
            <span style={{ fontFamily: P.hand, color: P.lime }}>prête à tourner.</span>
          </h2>
          <div style={{
            marginTop: 64, display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32,
          }}>
            {service.bullets.map((b, i) => (
              <div key={i} style={{
                paddingTop: 20, borderTop: `1px solid ${P.bg}25`,
              }}>
                <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.18em', opacity: 0.5, marginBottom: 12 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p style={{ fontFamily: P.serif, fontSize: 21, lineHeight: 1.4, margin: 0 }}>
                  {b}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {service.faq && (
        <section style={{ padding: '120px 40px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>
            ¶ Questions fréquentes
          </div>
          <h2 style={{
            fontFamily: P.display, fontSize: 'clamp(40px, 5vw, 64px)',
            fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 48px',
          }}>
            Vos questions,<br />
            <span style={{ ...window.HIVING_HAND_ON_LIGHT }}>nos réponses.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {service.faq.map((f, i) => (
              <details key={i} style={{
                background: P.cream, padding: '24px 28px', borderRadius: 16,
                cursor: 'pointer',
              }}>
                <summary style={{
                  fontFamily: P.display, fontSize: 22, fontWeight: 600,
                  letterSpacing: '-0.01em', listStyle: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span>{f.q}</span>
                  <span aria-hidden="true" style={{ fontSize: 28, color: P.ink, marginLeft: 16 }}>+</span>
                </summary>
                <p style={{ fontFamily: P.serif, fontSize: 18, lineHeight: 1.6, color: P.inkSoft, marginTop: 16, marginBottom: 0 }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Other services */}
      <section style={{ padding: '80px 40px 120px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>
          ¶ Autres services
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {others.map((s, i) => (
            <a key={s.slug} href={`${s.slug}.html`} style={{
              display: 'block', textDecoration: 'none', color: P.ink,
              background: i === 0 ? P.lime : P.cream,
              padding: '28px 26px', borderRadius: 20,
            }}>
              <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.18em', opacity: 0.6, marginBottom: 10, textTransform: 'uppercase' }}>
                {s.eyebrow}
              </div>
              <div style={{ fontFamily: P.display, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
                {s.title} →
              </div>
            </a>
          ))}
        </div>
      </section>

      <window.BigCTA
        eyebrow="Prêt à shooter ?"
        title="On démarre"
        hand="quand vous voulez."
        ctaLabel="Devis instantané"
        ctaHref="devis.html"
        ctaSecondaryLabel="Voir les plateaux"
        ctaSecondaryHref="plateaux.html"
      />
    </window.PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ServiceDetail />);
