// HIVING FOOD — Composants partagés multi-pages
// Nav globale + Footer + Switcher FR/EN + helpers SEO
// Dépendances : React, useT (window), HIVING_PALETTE (window)

(function () {
  const PALETTE = {
    bg: '#f6f1e7',
    cream: '#ede5d3',
    ink: '#0e0d0a',
    inkSoft: '#5a544a',
    accent: '#0e0d0a',
    lime: '#d4e85a',
    butter: '#d4e85a',
    splash: '#9bb830',
    paper: '#ffffff',
    display: '"DM Serif Display", "Caslon", Georgia, serif',
    serif: '"DM Serif Display", Georgia, serif',
    sans: '"Inter", "Helvetica Neue", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    hand: '"Caveat", "Marker Felt", cursive',
  };
  window.HIVING_PALETTE = PALETTE;

  // Si pages relatives, base = "" sur la home, "../" depuis /pages/*
  function basePath() {
    const p = window.location.pathname;
    if (p.includes('/pages/')) return '../';
    return '';
  }
  window.hivingBase = basePath;

  // ─── Logo ─────────────────────────────────────────────
  function HivingLogo({ size = 72, onClick }) {
    const base = basePath();
    return (
      <a href={base + 'index.html'} onClick={(e) => {
        if (onClick) onClick(e);
        const img = e.currentTarget.querySelector('img');
        if (img) {
          img.style.transition = 'transform 0.6s cubic-bezier(.34,1.56,.64,1)';
          img.style.transform = 'rotate(-8deg) scale(1.08)';
          setTimeout(() => { img.style.transform = ''; }, 600);
        }
      }} style={{ display: 'block', textDecoration: 'none' }} data-cursor="">
        <picture>
          <source srcSet={base + 'assets/logo-hiving-studio-black.webp'} type="image/webp" />
          <img src={base + 'assets/logo-hiving-studio-black.png'} alt="Hiving Studio — Studio cuisine Paris"
            width="1024" height="683" decoding="async"
            style={{ height: size, width: 'auto', display: 'block' }} />
        </picture>
      </a>
    );
  }

  // ─── LangSwitcher ─────────────────────────────────────
  function LangSwitcher() {
    const { lang, setLang } = window.useT();
    return (
      <div style={{
        display: 'inline-flex', gap: 0, fontFamily: PALETTE.mono,
        fontSize: 11, letterSpacing: '0.14em', alignItems: 'center',
        border: `1px solid ${PALETTE.ink}20`, borderRadius: 999, padding: 2,
      }}>
        {['fr', 'en'].map((l) => (
          <button key={l} onClick={() => setLang(l)} data-cursor=""
            style={{
              border: 'none', background: lang === l ? PALETTE.ink : 'transparent',
              color: lang === l ? PALETTE.bg : PALETTE.inkSoft,
              padding: '5px 10px', borderRadius: 999, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit',
              textTransform: 'uppercase', fontWeight: 600,
            }}>
            {l}
          </button>
        ))}
      </div>
    );
  }

  // ─── GlobalNav ────────────────────────────────────────
  function GlobalNav({ active }) {
    const { t } = window.useT();
    const [scrolled, setScrolled] = React.useState(false);
    React.useEffect(() => {
      const h = () => setScrolled(window.scrollY > 30);
      window.addEventListener('scroll', h, { passive: true });
      h();
      return () => window.removeEventListener('scroll', h);
    }, []);

    const base = basePath();
    const items = [
      { id: 'plateaux', label: t('nav.plateaux'), href: base + 'pages/plateaux.html' },
      { id: 'services', label: t('nav.services'), href: base + 'pages/services.html' },
      { id: 'tarifs', label: t('nav.tarifs'), href: base + 'pages/tarifs.html' },
      { id: 'travaux', label: t('nav.travaux'), href: base + 'pages/travaux.html' },
      { id: 'carnet', label: t('nav.carnet'), href: base + 'pages/carnet.html' },
      { id: 'equipe', label: t('nav.equipe'), href: base + 'pages/equipe.html' },
      { id: 'presse', label: t('nav.presse'), href: base + 'pages/presse.html' },
    ];

    return (
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? `${PALETTE.bg}f5` : PALETTE.bg,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${PALETTE.ink}10` : '1px solid transparent',
        padding: scrolled ? '12px 32px' : '20px 32px',
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 32,
        transition: 'padding 0.3s, background 0.3s',
      }}>
        <HivingLogo size={scrolled ? 48 : 64} />

        <div style={{
          display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center',
          fontFamily: PALETTE.sans, fontSize: 14, fontWeight: 500, flexWrap: 'wrap',
        }}>
          {items.map((it) => (
            <a key={it.id} href={it.href} data-cursor=""
              style={{
                color: active === it.id ? PALETTE.ink : PALETTE.inkSoft,
                fontWeight: active === it.id ? 600 : 500,
                textDecoration: 'none', cursor: 'pointer',
                padding: '8px 12px', borderRadius: 999,
                background: active === it.id ? PALETTE.cream : 'transparent',
                whiteSpace: 'nowrap',
              }}>
              {it.label}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <LangSwitcher />
          <a href={base + 'pages/devis.html'} data-cursor=""
            style={{
              background: PALETTE.lime, color: PALETTE.ink, padding: '10px 18px',
              borderRadius: 999, textDecoration: 'none', fontFamily: PALETTE.sans,
              fontSize: 13, fontWeight: 600, letterSpacing: '0.02em',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              border: `1px solid ${PALETTE.ink}`,
            }}>
            {t('cta.devis')} <span>→</span>
          </a>
        </div>
      </nav>
    );
  }

  // ─── GlobalFooter ─────────────────────────────────────
  function GlobalFooter() {
    const { t } = window.useT();
    const base = basePath();
    return (
      <footer style={{
        background: PALETTE.ink, color: PALETTE.bg,
        padding: '80px 40px 40px', position: 'relative',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 48, marginBottom: 64, maxWidth: 1400, margin: '0 auto 64px',
        }}>
          <div>
            <div style={{
              fontFamily: PALETTE.display, fontSize: 28, fontWeight: 700,
              letterSpacing: '-0.02em', marginBottom: 12,
            }}>
              hiving<span style={{ fontFamily: PALETTE.hand, color: PALETTE.lime, marginLeft: 6, transform: 'rotate(-3deg)', display: 'inline-block' }}>food</span>
            </div>
            <p style={{ fontFamily: PALETTE.serif, fontSize: 16, lineHeight: 1.5, opacity: 0.7, margin: 0 }}>
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <div style={{ fontFamily: PALETTE.mono, fontSize: 10, letterSpacing: '0.18em', opacity: 0.5, marginBottom: 16, textTransform: 'uppercase' }}>{t('footer.contact')}</div>
            <div style={{ fontFamily: PALETTE.sans, fontSize: 14, lineHeight: 1.8 }}>
              {t('footer.address')}<br />
              contact@hivingfood.fr<br />
              <span style={{ opacity: 0.6 }}>{t('footer.hours')}</span>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: PALETTE.mono, fontSize: 10, letterSpacing: '0.18em', opacity: 0.5, marginBottom: 16, textTransform: 'uppercase' }}>Pages</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: PALETTE.sans, fontSize: 14, lineHeight: 2 }}>
              <li><a href={base + 'pages/plateaux.html'} style={{ color: PALETTE.bg, textDecoration: 'none', opacity: 0.8 }}>{t('nav.plateaux')}</a></li>
              <li><a href={base + 'pages/services.html'} style={{ color: PALETTE.bg, textDecoration: 'none', opacity: 0.8 }}>{t('nav.services')}</a></li>
              <li><a href={base + 'pages/tarifs.html'} style={{ color: PALETTE.bg, textDecoration: 'none', opacity: 0.8 }}>{t('nav.tarifs')}</a></li>
              <li><a href={base + 'pages/devis.html'} style={{ color: PALETTE.bg, textDecoration: 'none', opacity: 0.8 }}>{t('nav.devis')}</a></li>
              <li><a href={base + 'pages/carnet.html'} style={{ color: PALETTE.bg, textDecoration: 'none', opacity: 0.8 }}>{t('nav.carnet')}</a></li>
            </ul>
          </div>

          <div>
            <div style={{ fontFamily: PALETTE.mono, fontSize: 10, letterSpacing: '0.18em', opacity: 0.5, marginBottom: 16, textTransform: 'uppercase' }}>Studio</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: PALETTE.sans, fontSize: 14, lineHeight: 2 }}>
              <li><a href={base + 'pages/equipe.html'} style={{ color: PALETTE.bg, textDecoration: 'none', opacity: 0.8 }}>{t('nav.equipe')}</a></li>
              <li><a href={base + 'pages/presse.html'} style={{ color: PALETTE.bg, textDecoration: 'none', opacity: 0.8 }}>{t('nav.presse')}</a></li>
              <li><a href={base + 'pages/case-picard.html'} style={{ color: PALETTE.bg, textDecoration: 'none', opacity: 0.8 }}>Case study Picard</a></li>
              <li><a href={base + 'admin.html'} style={{ color: PALETTE.bg, textDecoration: 'none', opacity: 0.4 }}>Admin ↗</a></li>
            </ul>
          </div>
        </div>

        <div style={{
          maxWidth: 1400, margin: '0 auto', paddingTop: 32,
          borderTop: `1px solid ${PALETTE.bg}20`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 16,
          fontFamily: PALETTE.mono, fontSize: 11, letterSpacing: '0.14em',
          opacity: 0.5, textTransform: 'uppercase',
        }}>
          <span>© 2026 HIVING FOOD · SIRET 921 478 350 00018</span>
          <span>{t('footer.legal')} · CGV · RGPD</span>
        </div>
      </footer>
    );
  }

  // ─── Section heading helper ───────────────────────────
  function SectionHeading({ eyebrow, title, hand, sub, light }) {
    const c = light ? PALETTE.bg : PALETTE.ink;
    const cs = light ? `${PALETTE.bg}99` : PALETTE.inkSoft;
    return (
      <div style={{ marginBottom: 56 }}>
        {eyebrow && (
          <div style={{ fontFamily: PALETTE.mono, fontSize: 11, letterSpacing: '0.18em', color: cs, marginBottom: 16, textTransform: 'uppercase' }}>
            {eyebrow}
          </div>
        )}
        <h2 style={{
          fontFamily: PALETTE.display, fontSize: 'clamp(40px, 6vw, 84px)',
          fontWeight: 700, letterSpacing: '-0.03em', margin: 0,
          lineHeight: 0.96, color: c,
          display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.25em',
        }}>
          <span>{title}</span>
          {hand && (
            <span style={{
              fontFamily: PALETTE.hand, color: PALETTE.lime,
              transform: 'rotate(-2deg)', display: 'inline-block',
              fontSize: '1.1em', lineHeight: 0.85,
            }}>
              {hand}
            </span>
          )}
        </h2>
        {sub && (
          <p style={{
            fontFamily: PALETTE.serif, fontSize: 22, lineHeight: 1.4,
            color: cs, marginTop: 24, maxWidth: 640,
          }}>
            {sub}
          </p>
        )}
      </div>
    );
  }

  // ─── PageShell : nav + main + footer + bg ─────────────
  function PageShell({ active, children, dark }) {
    return (
      <div style={{
        background: dark ? PALETTE.ink : PALETTE.bg,
        color: dark ? PALETTE.bg : PALETTE.ink,
        minHeight: '100vh', fontFamily: PALETTE.sans,
      }}>
        <GlobalNav active={active} />
        <main>{children}</main>
        <GlobalFooter />
      </div>
    );
  }

  // ─── Breadcrumb ──────────────────────────────────────
  function Breadcrumb({ items }) {
    const base = basePath();
    return (
      <nav style={{
        fontFamily: PALETTE.mono, fontSize: 11, letterSpacing: '0.14em',
        color: PALETTE.inkSoft, textTransform: 'uppercase',
        padding: '24px 40px 0', maxWidth: 1400, margin: '0 auto',
        display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
      }}>
        <a href={base + 'index.html'} style={{ color: PALETTE.inkSoft, textDecoration: 'none' }}>HIVING</a>
        {items.map((it, i) => (
          <React.Fragment key={i}>
            <span style={{ opacity: 0.4 }}>/</span>
            {it.href ? (
              <a href={it.href} style={{ color: PALETTE.inkSoft, textDecoration: 'none' }}>{it.label}</a>
            ) : (
              <span style={{ color: PALETTE.ink }}>{it.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  // ─── BigCTA ──────────────────────────────────────────
  function BigCTA({ eyebrow, title, hand, ctaLabel, ctaHref, ctaSecondaryLabel, ctaSecondaryHref }) {
    const base = basePath();
    return (
      <section style={{
        padding: '120px 40px', background: PALETTE.lime, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {eyebrow && (
            <div style={{ fontFamily: PALETTE.mono, fontSize: 11, letterSpacing: '0.18em', color: PALETTE.ink, marginBottom: 20, textTransform: 'uppercase', opacity: 0.7 }}>
              {eyebrow}
            </div>
          )}
          <h2 style={{
            fontFamily: PALETTE.display, fontSize: 'clamp(48px, 7vw, 110px)',
            fontWeight: 700, letterSpacing: '-0.03em', margin: 0,
            lineHeight: 0.95, color: PALETTE.ink,
          }}>
            {title}
            {hand && (
              <span style={{
                fontFamily: PALETTE.hand, display: 'block',
                transform: 'rotate(-2deg)', marginTop: 12,
              }}>
                {hand}
              </span>
            )}
          </h2>
          <div style={{ marginTop: 48, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={ctaHref || (base + 'pages/devis.html')} style={{
              background: PALETTE.ink, color: PALETTE.bg,
              padding: '18px 32px', borderRadius: 999, textDecoration: 'none',
              fontFamily: PALETTE.sans, fontSize: 16, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}>
              {ctaLabel} <span style={{ fontSize: 22 }}>→</span>
            </a>
            {ctaSecondaryLabel && (
              <a href={ctaSecondaryHref || '#'} style={{
                background: 'transparent', color: PALETTE.ink,
                padding: '18px 32px', borderRadius: 999, textDecoration: 'none',
                fontFamily: PALETTE.sans, fontSize: 16, fontWeight: 600,
                border: `2px solid ${PALETTE.ink}`,
              }}>
                {ctaSecondaryLabel}
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  Object.assign(window, {
    HivingLogo, LangSwitcher, GlobalNav, GlobalFooter,
    SectionHeading, PageShell, Breadcrumb, BigCTA,
  });
})();
