// V3 — DA HIVING authentique
// Inspiré du logo : typographie manuscrite arrondie, swooshs peints,
// éclaboussures spray, croix +, esprit atelier/street mais premium

// PALETTE HIVING (depuis le brandbook)
// — Soft lime green (couleur signature)
// — Noir profond + Blanc cassé
// + neutres chauds pour la chaleur food
const v3Styles = {
  bg: '#fafaf5',         // blanc cassé chaud
  ink: '#0a0908',        // noir profond
  inkSoft: '#3a3a35',    // gris-noir
  cream: '#f0ecdf',      // crème ivoire
  lime: '#d4e85a',       // SOFT LIME GREEN — couleur signature HIVING
  limeDeep: '#b5d039',   // lime saturé pour accents
  accent: '#d4e85a',     // alias = lime (couleur principale)
  butter: '#d4e85a',     // alias compat
  accent2: '#0a0908',    // alias compat (noir profond)
  warm: '#e8dcc4',       // tan chaud (food)
  hand: '"Caveat", "Bradley Hand", cursive',
  display: '"Familjen Grotesk", "Archivo", "Inter", sans-serif',
  serif: '"Fraunces", Georgia, serif',
  sans: '"Inter", -apple-system, sans-serif',
  mono: '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
};

// ─── LINK SVG — le « V » signature HIVING ──────────────────────────
// Élément graphique central : le « V » qui lie deux mondes
function Link({ color = '#0a0908', size = 80, style = {} }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block', ...style }} fill="none">
      {/* Le V/Link signature — arrondis friendly + pointes expertes */}
      <path d="M 18 22 Q 22 18 28 24 L 48 70 Q 50 76 52 70 L 72 24 Q 78 18 82 22 Q 84 26 80 32 L 56 86 Q 50 96 44 86 L 20 32 Q 16 26 18 22 Z" fill={color} />
    </svg>
  );
}

// ─── SWOOSH SVG (réutilisable) ─────────────────────────────────────
function Swoosh({ color = '#0a0908', width = 400, style = {} }) {
  return (
    <svg viewBox="0 0 400 80" width={width} style={{ display: 'block', ...style }} fill="none">
      <path d="M 12 42 Q 100 8 220 14 T 388 38 Q 320 52 200 50 T 28 38" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 24 50 Q 120 22 230 24 T 380 46" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.55" />
      {/* spray dots */}
      <circle cx="368" cy="22" r="1.2" fill={color} opacity="0.6" />
      <circle cx="378" cy="28" r="0.8" fill={color} opacity="0.4" />
      <circle cx="358" cy="14" r="0.6" fill={color} opacity="0.5" />
      <circle cx="385" cy="34" r="0.5" fill={color} opacity="0.3" />
      <circle cx="20" cy="58" r="0.7" fill={color} opacity="0.4" />
      <circle cx="14" cy="48" r="0.5" fill={color} opacity="0.3" />
    </svg>
  );
}

function Plus({ color = '#0a0908', size = 24, style = {} }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block', ...style }} fill="none">
      <path d="M 12 3 L 12 21 M 3 12 L 21 12" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="20" cy="5" r="0.6" fill={color} opacity="0.5" />
      <circle cx="4" cy="19" r="0.6" fill={color} opacity="0.5" />
    </svg>
  );
}

// Tâche / éclaboussure
function Splat({ color = '#d65a2c', size = 80, style = {} }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block', ...style }} fill={color}>
      <path d="M 50 10 Q 70 20 75 35 Q 90 40 88 55 Q 95 70 78 78 Q 75 92 58 88 Q 45 95 38 82 Q 20 88 18 70 Q 5 60 15 45 Q 8 28 25 25 Q 32 10 50 10 Z" opacity="0.92" />
      <circle cx="92" cy="22" r="3" />
      <circle cx="14" cy="86" r="2" />
      <circle cx="88" cy="84" r="1.5" />
      <circle cx="22" cy="14" r="1.2" />
    </svg>
  );
}

// Texture grain layer
function Grain({ opacity = 0.06 }) {
  return (
    <svg style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', opacity, mixBlendMode: 'multiply',
    }}>
      <filter id="grain-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-noise)" />
    </svg>
  );
}

function V3Page({ palette }) {
  const P = palette || v3Styles;
  return (
    <div style={{
      background: P.bg, color: P.ink, fontFamily: P.sans,
      minHeight: '100%', overflow: 'hidden', position: 'relative',
    }}>
      <V3Cursor P={P} />
      <V3HeroStatus P={P} />
      <V3Nav P={P} />
      <V3Hero P={P} />
      <V3Manifesto P={P} />
      <V3Studios P={P} />
      <V3Process P={P} />
      <V3VirtualTour P={P} />
      <V3Portfolio P={P} />
      <V3Testimonials P={P} />
      <V3Dishes P={P} />
      <V3Team P={P} />
      <V3Equipment P={P} />
      <V3Press P={P} />
      <div id="reserver" style={{ scrollMarginTop: 80 }}>
        {React.createElement(window.V3BookingPro, { P })}
      </div>
      <V3Faq P={P} />
      <V3Footer P={P} />
    </div>
  );
}

// ─── MARQUEE TOP ───────────────────────────────────────────────────
function V3Marquee({ P }) {
  const items = ['STUDIOS FOOD À CLICHY', '⊹ OUVERT 7J/7 ⊹', '2 PLATEAUX', 'CUISINE PRO', '155M² · 4 RUE MOZART'];
  return (
    <div style={{
      background: P.ink, color: P.bg, padding: '10px 0',
      overflow: 'hidden', whiteSpace: 'nowrap',
    }}>
      <div style={{
        display: 'inline-block', animation: 'v3-marquee 38s linear infinite',
        fontFamily: P.mono, fontSize: 11, letterSpacing: '0.16em',
      }}>
        {[...items, ...items, ...items, ...items].map((t, i) => (
          <span key={i} style={{ padding: '0 28px' }}>
            {t}<span style={{ marginLeft: 28, opacity: 0.5 }}>+</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes v3-marquee { from { transform: translateX(0) } to { transform: translateX(-25%) } }`}</style>
    </div>
  );
}

// ─── NAV ───────────────────────────────────────────────────────────
function V3Nav({ P }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50, background: P.bg,
      padding: scrolled ? '14px 40px' : '24px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: `1px dashed ${P.ink}30`,
      transition: 'padding 0.3s',
    }}>
      <a href="#top" data-cursor="accueil"
        onClick={(e) => {
          const img = e.currentTarget.querySelector('.hiving-logo-img');
          if (img) {
            img.classList.remove('is-clicked');
            void img.offsetWidth;
            img.classList.add('is-clicked');
          }
        }}
        style={{
        display: 'inline-flex', alignItems: 'center', gap: 14,
        textDecoration: 'none', color: 'inherit',
        position: 'relative',
      }}
      className="hiving-logo-mark"
      >
        <picture>
          <source srcSet="assets/logo-hiving-studio-black.webp" type="image/webp" />
          <img
            src="assets/logo-hiving-studio-black.png"
            alt="Hiving Studio — Studio cuisine à Clichy, Paris 92"
            className="hiving-logo-img"
            width="1024"
            height="683"
            fetchpriority="high"
            decoding="async"
            style={{
              height: scrolled ? 72 : 100, width: 'auto', display: 'block',
              transition: 'height 0.3s cubic-bezier(.2,.9,.3,1.4)',
              transformOrigin: 'left center',
            }}
          />
        </picture>
      </a>
      <div className="v3-nav-links" style={{
        display: 'flex', gap: 4, alignItems: 'center',
        fontFamily: P.display, fontSize: 14, fontWeight: 500,
      }}>
        {[
          { l: 'Plateaux', id: 'plateaux' },
          { l: 'Visite', id: 'visite' },
          { l: 'Travaux', id: 'portfolio' },
          { l: 'Cuisine', id: 'cuisine' },
          { l: 'Matériel', id: 'materiel' },
          { l: 'Réserver', id: 'reserver' },
        ].map(({ l, id }) => (
          <a key={id} href={`#${id}`} data-cursor=""
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(id);
              if (el) {
                const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }}
            style={{
              color: P.ink, textDecoration: 'none', cursor: 'pointer',
              padding: '8px 14px', borderRadius: 999,
            }}>{l}</a>
        ))}
      </div>
      <button
        className="v3-mobile-toggle"
        onClick={() => {
          const m = document.getElementById('v3-mobile-menu');
          if (m) m.style.transform = m.style.transform === 'translateX(0%)' ? 'translateX(100%)' : 'translateX(0%)';
        }}
        style={{
          display: 'none', alignItems: 'center', justifyContent: 'center',
          width: 44, height: 44, border: `1.5px solid ${P.ink}`, borderRadius: 999,
          background: P.bg, cursor: 'pointer', padding: 0,
        }}>
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
          <line x1="0" y1="2" x2="20" y2="2" stroke={P.ink} strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="7" x2="20" y2="7" stroke={P.ink} strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="12" x2="20" y2="12" stroke={P.ink} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <div id="v3-mobile-menu" style={{
        position: 'fixed', top: 0, right: 0, width: '85vw', maxWidth: 360, height: '100vh',
        background: P.ink, color: P.bg, zIndex: 100,
        transform: 'translateX(100%)', transition: 'transform 0.4s cubic-bezier(.2,.9,.3,1)',
        padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <button
          onClick={() => { const m = document.getElementById('v3-mobile-menu'); if (m) m.style.transform = 'translateX(100%)'; }}
          style={{
            alignSelf: 'flex-end', width: 40, height: 40, borderRadius: 999,
            background: 'transparent', border: `1px solid ${P.bg}40`, color: P.bg,
            cursor: 'pointer', fontSize: 22, lineHeight: 1, marginBottom: 32,
          }}>×</button>
        {[
          { l: 'Plateaux', id: 'plateaux' },
          { l: 'Visite', id: 'visite' },
          { l: 'Travaux', id: 'portfolio' },
          { l: 'Cuisine', id: 'cuisine' },
          { l: 'Matériel', id: 'materiel' },
          { l: 'Réserver', id: 'reserver' },
        ].map(({ l, id }) => (
          <a key={id} href={`#${id}`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(id);
              const m = document.getElementById('v3-mobile-menu');
              if (m) m.style.transform = 'translateX(100%)';
              setTimeout(() => {
                if (el) {
                  const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }, 300);
            }}
            style={{
              color: P.bg, textDecoration: 'none',
              fontFamily: P.display, fontSize: 32, fontWeight: 600,
              padding: '14px 0', borderBottom: `1px solid ${P.bg}20`,
              letterSpacing: '-0.02em',
            }}>{l}</a>
        ))}
      </div>
      <div className="v3-nav-links" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <span style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.14em', color: P.inkSoft }}>FR</span>
        <a data-cursor="contact" style={{
          padding: '12px 22px', background: P.ink, color: P.bg,
          textDecoration: 'none', borderRadius: 999,
          fontFamily: P.display, fontSize: 14, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          Nous écrire
          <Plus color={P.bg} size={12} />
        </a>
      </div>
      <style>{`
        @keyframes hiving-spin-once {
          0%   { transform: rotate(0deg) scale(1); }
          50%  { transform: rotate(-8deg) scale(1.08); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .hiving-logo-img.is-clicked {
          animation: hiving-spin-once 0.6s cubic-bezier(.2,.9,.3,1.4);
        }
      `}</style>
    </div>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────
function V3Hero({ P }) {
  const [showreelOpen, setShowreelOpen] = React.useState(false);
  return (
    <div style={{ padding: '60px 40px 40px', position: 'relative' }}>
      {showreelOpen && (
        <div
          onClick={() => setShowreelOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 40,
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setShowreelOpen(false); }}
            style={{
              position: 'absolute', top: 24, right: 24,
              width: 56, height: 56, borderRadius: '50%',
              background: P.bg, color: P.ink, border: 'none', cursor: 'pointer',
              fontSize: 24, fontFamily: P.display, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 2,
            }}
          >×</button>
          <video
            src="/videos/hiving-showreel.mp4"
            controls
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw', maxHeight: '90vh',
              borderRadius: 20, boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
              cursor: 'default',
            }}
          />
        </div>
      )}
      {/* Floating accent shapes — Link signatures */}
      <div className="v3-floating-deco" style={{ position: 'absolute', top: 80, right: '8%', transform: 'rotate(15deg)' }}>
        <Link color={P.lime} size={140} />
      </div>
      <div className="v3-floating-deco" style={{ position: 'absolute', top: 280, left: '4%', transform: 'rotate(-12deg)' }}>
        <Link color={P.ink} size={36} />
      </div>
      <div className="v3-floating-deco" style={{ position: 'absolute', bottom: 340, right: '40%', transform: 'rotate(8deg)' }}>
        <Link color={P.lime} size={22} />
      </div>

      {/* Top meta */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: P.mono, fontSize: 11, letterSpacing: '0.14em',
        color: P.inkSoft, textTransform: 'uppercase', marginBottom: 60,
      }}>
        <span>↓ Bienvenue chez nous</span>
        <span>Studios food / Clichy 92</span>
        <span>2026</span>
      </div>

      {/* Massive headline w/ swoosh */}
      <div style={{ position: 'relative' }}>
        <h1 style={{
          fontFamily: P.display, fontWeight: 600,
          fontSize: 'clamp(96px, 14vw, 240px)', lineHeight: 0.88,
          letterSpacing: '-0.045em', margin: 0,
        }}>
          <div>Jouons</div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{
              fontFamily: P.hand, fontWeight: 700, fontStyle: 'italic',
              fontSize: '1em',
              display: 'inline-block', transform: 'rotate(-2deg)',
              background: P.lime, padding: '0.05em 0.3em 0.15em', borderRadius: '0.3em',
            }}>la cuisine,</span>
          </div>
          <div>créons</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2em' }}>
            <span>l'image</span>
            <span style={{ display: 'inline-block', transform: 'translateY(-0.05em)' }}>
              <Link color={P.ink} size={140} />
            </span>
            <span style={{ fontFamily: P.serif, fontStyle: 'italic' }}>.</span>
          </div>
        </h1>
      </div>

      {/* sub */}
      <div style={{
        marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 48,
        alignItems: 'end',
      }}>
        <p style={{
          fontFamily: P.serif, fontSize: 21, lineHeight: 1.4, margin: 0, color: P.inkSoft,
          maxWidth: 460,
        }}>
          Deux plateaux dédiés à la photo et au film culinaire, à 5 minutes de
          Paris. Pensés par et pour ceux qui font de la nourriture leur sujet.
        </p>
        <div style={{
          fontFamily: P.hand, fontSize: 28, lineHeight: 1.1,
          color: P.ink, transform: 'rotate(-3deg)', maxWidth: 220,
        }}>
          ← on prépare,<br />on shoote,<br />on mange.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 26px', background: P.ink, color: P.bg,
            textDecoration: 'none', fontFamily: P.display, fontSize: 15, fontWeight: 600,
            borderRadius: 999,
          }}>
            <span>Réserver une visite</span>
            <span style={{ fontSize: 20 }}>→</span>
          </a>
          <button
            onClick={() => setShowreelOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 26px', border: `2px solid ${P.ink}`, color: P.ink,
              fontFamily: P.display, fontSize: 15, fontWeight: 600,
              borderRadius: 999, background: 'transparent', cursor: 'pointer',
            }}>
            <span>Voir le showreel</span>
            <span style={{ fontSize: 16 }}>▶</span>
          </button>
        </div>
      </div>

      {/* Big hero video — ÇA COOK! montage */}
      <div style={{
        marginTop: 64, height: 600, position: 'relative',
        background: P.ink, overflow: 'hidden', borderRadius: 24,
      }}>
        <video
          src="/videos/ca-cook-montage.mp4"
          poster="/videos/ca-cook-montage.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            display: 'block',
          }}
        />
        {/* Subtle dark gradient overlay for text contrast */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 35%, transparent 60%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }} />
        {/* Big handwritten label inside */}
        <div style={{
          position: 'absolute', top: 32, left: 32,
          fontFamily: P.hand, fontSize: 56, color: P.ink,
          transform: 'rotate(-4deg)', lineHeight: 0.9,
          background: P.lime, padding: '8px 18px', borderRadius: 16,
          boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
        }}>
          ça cook<br />2026
        </div>
        <button
          onClick={() => setShowreelOpen(true)}
          style={{
            position: 'absolute', right: 32, bottom: 32,
            width: 120, height: 120, borderRadius: '50%',
            background: P.ink, color: P.bg, border: 'none',
            fontFamily: P.display, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexDirection: 'column', gap: 6,
            boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
          }}>
          <span style={{ fontSize: 24 }}>▶</span>
          <span>SHOWREEL</span>
        </button>
        <div style={{
          position: 'absolute', bottom: 32, left: 32,
          fontFamily: P.mono, fontSize: 11, letterSpacing: '0.16em',
          color: P.ink, padding: '8px 12px', background: P.bg,
          borderRadius: 999,
        }}>
          ● LIVE PLATEAU 02
        </div>
      </div>
    </div>
  );
}

// ─── MANIFESTO ─────────────────────────────────────────────────────
function V3Manifesto({ P }) {
  return (
    <div style={{ padding: '120px 40px', position: 'relative' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '180px 1fr', gap: 48, alignItems: 'start',
      }}>
        <div>
          <Splat color={P.butter} size={140} style={{ transform: 'rotate(-12deg)' }} />
          <div style={{
            fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em',
            color: P.inkSoft, textTransform: 'uppercase', marginTop: 16,
          }}>
            ¶ 01 — Notre métier
          </div>
        </div>
        <div>
          <p style={{
            fontFamily: P.display, fontSize: 'clamp(40px, 5.5vw, 80px)', lineHeight: 1.02,
            letterSpacing: '-0.03em', margin: 0, fontWeight: 500,
          }}>
            La nourriture <span style={{
              fontFamily: P.hand, color: P.accent, fontWeight: 700,
              display: 'inline-block', transform: 'rotate(-2deg)',
            }}>fond, transpire, refroidit.</span>{' '}
            Notre boulot : la figer pile au bon moment — quand elle a
            encore l'air d'avoir envie d'être mangée.
          </p>
        </div>
      </div>

      {/* Stats with hand-drawn vibe */}
      <div style={{
        marginTop: 96, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 0, position: 'relative',
      }}>
        {[
          ['380', 'm² total', P.accent],
          ['1200+', 'tournages', P.ink],
          ['07', 'années', P.accent2],
          ['24/7', 'accès', P.butter],
        ].map(([num, lbl, c], i) => (
          <div key={i} style={{
            padding: '20px 0', position: 'relative',
            borderRight: i < 3 ? `1px dashed ${P.ink}30` : 'none',
            paddingLeft: i > 0 ? 28 : 0,
          }}>
            <div style={{
              fontFamily: P.display, fontSize: 'clamp(80px, 9vw, 132px)',
              lineHeight: 0.95, letterSpacing: '-0.05em', fontWeight: 600,
              position: 'relative', display: 'inline-block',
            }}>
              <span style={{ position: 'relative', zIndex: 2 }}>{num}</span>
              <Swoosh color={c} width={200} style={{
                position: 'absolute', left: -8, bottom: 8, width: 'calc(100% + 24px)',
                height: 'auto', zIndex: 1, opacity: 0.7,
              }} />
            </div>
            <div style={{
              fontFamily: P.hand, fontSize: 26, marginTop: 4, color: P.inkSoft,
              transform: 'rotate(-1deg)',
            }}>{lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STUDIOS ───────────────────────────────────────────────────────
function V3Studios({ P }) {
  const [active, setActive] = React.useState(0);
  const studios = HIVING_STUDIOS;

  const accentMap = [P.accent, P.ink, P.butter];

  return (
    <div id="plateaux" style={{
      padding: '120px 40px', background: P.ink, color: P.bg, position: 'relative', scrollMarginTop: 80,
      borderTopLeftRadius: 40, borderTopRightRadius: 40,
    }}>
      {/* Floating + */}
      <div style={{ position: 'absolute', top: 60, right: 60 }}><Plus color={P.accent} size={32} /></div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32,
      }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', opacity: 0.6, textTransform: 'uppercase' }}>
          ¶ 02 — Les plateaux
        </div>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', opacity: 0.6 }}>
          [{String(active + 1).padStart(2, '0')} / 03]
        </div>
      </div>

      <h2 style={{
        fontFamily: P.display, fontSize: 'clamp(72px, 11vw, 180px)',
        lineHeight: 0.9, letterSpacing: '-0.045em', margin: '0 0 80px',
        fontWeight: 600, position: 'relative', display: 'inline-block',
      }}>
        Deux plateaux —<br />
        <span style={{
          fontFamily: P.hand, color: P.accent, fontWeight: 700,
          fontSize: '0.85em', display: 'inline-block', transform: 'rotate(-2deg)',
        }}>deux ambiances.</span>
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'start' }}>
        {/* Sticky preview */}
        <div style={{ position: 'sticky', top: 100 }}>
          <div style={{
            position: 'relative', height: 580, background: studios[active].color,
            overflow: 'hidden', borderRadius: 24, transition: 'background 0.5s',
          }}>
            <V3Placeholder
              label={`Plateau ${studios[active].num} ${studios[active].name} — Studio cuisine à louer Paris Clichy`}
              tone={studios[active].color}
              dark={studios[active].color === '#2d2520'}
              src={studios[active].image}
              priority={active === 0}
              P={P}
            />
            <div style={{
              position: 'absolute', top: 24, left: 24,
              fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em',
              color: P.bg, padding: '8px 12px', background: 'rgba(10,9,8,0.5)',
              backdropFilter: 'blur(8px)', borderRadius: 999,
            }}>
              VUE 360° ↗
            </div>
            <div style={{
              position: 'absolute', bottom: 32, right: 32,
              fontFamily: P.hand, fontSize: 96, fontWeight: 700,
              color: P.bg, opacity: 0.25, lineHeight: 0.9,
              transform: 'rotate(-4deg)',
            }}>
              {studios[active].num}
            </div>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
            marginTop: 20, paddingTop: 20, borderTop: `1px dashed ${P.bg}30`,
          }}>
            {[
              ['Surface', studios[active].surface],
              ['Hauteur', studios[active].height],
              ['Lumière', 'oui'],
            ].map(([k, v], i) => (
              <div key={i}>
                <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.14em', opacity: 0.5, textTransform: 'uppercase' }}>{k}</div>
                <div style={{ fontFamily: P.display, fontSize: 22, fontWeight: 500, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* List */}
        <div>
          {studios.map((s, i) => (
            <div
              key={s.id}
              onMouseEnter={() => setActive(i)}
              style={{
                padding: '36px 0', borderTop: `1px dashed ${P.bg}30`,
                cursor: 'pointer', transition: 'opacity 0.2s, padding-left 0.3s',
                opacity: active === i ? 1 : 0.55,
                paddingLeft: active === i ? 16 : 0,
                position: 'relative',
              }}
            >
              {active === i && (
                <Plus color={accentMap[i]} size={20} style={{
                  position: 'absolute', left: -8, top: 44,
                }} />
              )}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginBottom: 12 }}>
                <span style={{ fontFamily: P.hand, fontSize: 36, fontWeight: 700, color: accentMap[i], transform: 'rotate(-3deg)', display: 'inline-block' }}>
                  №{s.num}
                </span>
                <a href={`pages/${s.slug}.html`} style={{
                  fontFamily: P.display, fontSize: 60, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1,
                  color: P.bg, textDecoration: 'none',
                }}>
                  {s.name}
                </a>
              </div>
              <p style={{
                fontFamily: P.serif, fontSize: 19, lineHeight: 1.45, margin: '0 0 20px',
                opacity: 0.78, maxWidth: 540,
              }}>
                {s.desc}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {s.features.map(f => (
                  <span key={f} style={{
                    padding: '7px 14px', border: `1px solid ${P.bg}30`, borderRadius: 999,
                    fontFamily: P.mono, fontSize: 10, letterSpacing: '0.1em',
                    textTransform: 'uppercase', opacity: 0.85,
                  }}>+ {f}</span>
                ))}
              </div>
              <a href={`pages/${s.slug}.html`} style={{
                marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 10,
                fontFamily: P.display, fontSize: 14, fontWeight: 600, color: accentMap[i],
                textDecoration: 'none',
              }}>
                Découvrir {s.name} · Réserver
                <span>→</span>
              </a>
            </div>
          ))}
          <div style={{ borderTop: `1px dashed ${P.bg}30` }}></div>
        </div>
      </div>
    </div>
  );
}

// ─── VIRTUAL TOUR ──────────────────────────────────────────────────
function V3VirtualTour({ P }) {
  const [angle, setAngle] = React.useState(45);
  const [studio, setStudio] = React.useState(0);
  const [tourOpen, setTourOpen] = React.useState(false);
  const [snapping, setSnapping] = React.useState(false);
  const dragRef = React.useRef({ down: false, startX: 0, startAngle: 0, w: 1 });

  const studioImages = (HIVING_STUDIOS[studio].images || []).filter(Boolean);
  const N = Math.max(1, studioImages.length);
  // Smooth wrap-around: full 360° = back to start by extending the strip by 1 image (last → repeat first)
  const stripCount = N + 1;
  const translatePct = -(angle / 360) * (stripCount - 1) * 100 / stripCount;

  // Reset angle on studio switch (different N → stale angle would jump the frame).
  React.useEffect(() => {
    setSnapping(true);
    setAngle(0);
    const id = requestAnimationFrame(() => setSnapping(false));
    return () => cancelAnimationFrame(id);
  }, [studio]);

  const onDown = (clientX, target) => {
    dragRef.current = {
      down: true, startX: clientX, startAngle: angle,
      w: (target && target.clientWidth) || window.innerWidth,
    };
  };
  const onMove = (clientX) => {
    if (!dragRef.current.down) return;
    const dx = clientX - dragRef.current.startX;
    const deltaAngle = -(dx / dragRef.current.w) * 360;
    let next = (dragRef.current.startAngle + deltaAngle) % 360;
    if (next < 0) next += 360;
    setAngle(next);
  };
  const onUp = () => { dragRef.current.down = false; };

  return (
    <div id="visite" style={{ padding: '120px 40px', background: P.ink, color: P.bg, position: 'relative', scrollMarginTop: 80 }}>
      {tourOpen && (
        <div
          onClick={() => setTourOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 40,
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setTourOpen(false); }}
            style={{
              position: 'absolute', top: 24, right: 24,
              width: 56, height: 56, borderRadius: '50%',
              background: P.bg, color: P.ink, border: 'none', cursor: 'pointer',
              fontSize: 24, fontFamily: P.display, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
          <video
            src="/videos/visite-showroom.mp4"
            controls
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw', maxHeight: '90vh',
              borderRadius: 20, boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            }}
          />
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
        <div>
          <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', opacity: 0.6, textTransform: 'uppercase', marginBottom: 16 }}>
            ¶ 03 — Visite virtuelle
          </div>
          <h2 style={{
            fontFamily: P.display, fontSize: 'clamp(56px, 8vw, 120px)',
            lineHeight: 0.95, letterSpacing: '-0.04em', margin: 0, fontWeight: 600,
          }}>
            Avant de venir,<br />
            <span style={{
              fontFamily: P.hand, color: P.butter, fontWeight: 700,
              transform: 'rotate(-2deg)', display: 'inline-block',
            }}>jetez un œil.</span>
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-end' }}>
          <button
            onClick={() => setTourOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 22px', background: P.butter, color: P.ink,
              border: 'none', borderRadius: 999, cursor: 'pointer',
              fontFamily: P.display, fontSize: 14, fontWeight: 700,
              boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ fontSize: 14 }}>▶</span> Voir le studio en vidéo
          </button>
          <div style={{
            fontFamily: P.hand, fontSize: 24, color: P.bg, opacity: 0.7,
            transform: 'rotate(-2deg)', maxWidth: 240, textAlign: 'right',
          }}>
            ← glissez pour<br />pivoter à 360°
          </div>
        </div>
      </div>

      <div
        onMouseDown={(e) => { e.preventDefault(); onDown(e.clientX, e.currentTarget); }}
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={(e) => onDown(e.touches[0].clientX, e.currentTarget)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onUp}
        style={{
          position: 'relative', height: 620, borderRadius: 24, overflow: 'hidden',
          cursor: dragRef.current.down ? 'grabbing' : 'grab',
          userSelect: 'none', touchAction: 'pan-y',
        }}>
        <div style={{
          position: 'absolute', inset: 0, width: `${stripCount * 100}%`,
          transform: `translateX(${translatePct}%)`,
          transition: (dragRef.current.down || snapping) ? 'none' : 'transform 0.18s ease-out',
          display: 'flex', pointerEvents: 'none',
        }}>
          {Array.from({ length: stripCount }).map((_, i) => {
            const imgIdx = i % N;
            return (
              <div key={i} style={{ flex: 1, position: 'relative', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                <V3Placeholder
                  label={`PANO · ${HIVING_STUDIOS[studio].name} · VUE ${imgIdx + 1}/${N}`}
                  tone="#1a1612" dark P={P}
                  src={studioImages[imgIdx]}
                />
              </div>
            );
          })}
        </div>

        {/* Crosshair */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', pointerEvents: 'none',
          width: 64, height: 64, opacity: 0.5,
        }}>
          <Plus color={P.bg} size={64} />
        </div>

        {/* HUD */}
        <div style={{
          position: 'absolute', top: 24, left: 24,
          fontFamily: P.mono, fontSize: 11, letterSpacing: '0.16em',
          padding: '10px 14px', background: 'rgba(10,9,8,0.6)',
          backdropFilter: 'blur(8px)', borderRadius: 999,
          color: P.bg,
        }}>
          {Math.round(angle)}° · {['NORD', 'EST', 'SUD', 'OUEST'][Math.floor(((angle + 45) % 360) / 90)]}
          <span style={{ opacity: 0.5, marginLeft: 10 }}>· {Math.min(N, Math.floor((angle / 360) * N) + 1)}/{N}</span>
        </div>

        {/* Studio switch */}
        <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', gap: 6 }}>
          {HIVING_STUDIOS.map((s, i) => (
            <button key={s.id} onClick={() => { setStudio(i); setAngle(0); setSnapping(true); }} style={{
              padding: '10px 16px',
              background: studio === i ? P.bg : 'rgba(10,9,8,0.5)',
              color: studio === i ? P.ink : P.bg,
              border: 'none', borderRadius: 999,
              fontFamily: P.display, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', backdropFilter: 'blur(8px)',
            }}>{s.num} · {s.name}</button>
          ))}
        </div>

        {/* Hotspots — per-studio */}
        {(HIVING_STUDIOS[studio].hotspots || []).map((h, i) => (
          <div key={`${studio}-${i}`} style={{
            position: 'absolute', top: h.top, left: h.left,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              border: `2px solid ${P.accent}`, background: P.accent + '40',
              animation: 'v3-pulse 1.6s infinite ease-in-out',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: P.bg, fontSize: 12, fontFamily: P.display, fontWeight: 700 }}>+</span>
            </div>
            <span style={{
              fontFamily: P.hand, fontSize: 18, color: P.bg, fontWeight: 600,
              padding: '4px 10px', background: 'rgba(10,9,8,0.6)',
              borderRadius: 999, transform: 'rotate(-2deg)',
            }}>{h.label}</span>
          </div>
        ))}
        <style>{`@keyframes v3-pulse { 0%,100% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.5); opacity: 0.4 } }`}</style>

        {/* Slider */}
        <div style={{
          position: 'absolute', bottom: 32, left: 32, right: 32,
          display: 'flex', alignItems: 'center', gap: 20,
          padding: '14px 20px', background: 'rgba(10,9,8,0.6)',
          backdropFilter: 'blur(8px)', borderRadius: 999,
        }}>
          <span style={{ fontFamily: P.mono, fontSize: 10, color: P.bg, letterSpacing: '0.14em' }}>0°</span>
          <input
            type="range" min="0" max="360" value={angle}
            onChange={e => setAngle(+e.target.value)}
            style={{ flex: 1, accentColor: P.accent, cursor: 'grab' }}
          />
          <span style={{ fontFamily: P.mono, fontSize: 10, color: P.bg, letterSpacing: '0.14em' }}>360°</span>
        </div>
      </div>

      <div style={{
        marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
      }}>
        {[
          ['Coin lumière jour', '12:34 · Nord'],
          ['Cuisine technique', 'Piano 6 feux'],
          ['Régie son', 'Calibrage écrans'],
          ['Terrasse', 'Pause / catering'],
        ].map(([t, sub], i) => (
          <button key={i} style={{
            padding: '20px 22px', background: 'transparent',
            border: `1px dashed ${P.bg}30`, borderRadius: 16,
            textAlign: 'left', cursor: 'pointer', color: 'inherit',
          }}>
            <div style={{ fontFamily: P.display, fontSize: 19, fontWeight: 600, marginBottom: 4 }}>↳ {t}</div>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.14em', opacity: 0.6, textTransform: 'uppercase' }}>{sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── PORTFOLIO ─────────────────────────────────────────────────────
function V3Portfolio({ P }) {
  const [filter, setFilter] = React.useState('Tous');
  const filtered = filter === 'Tous' ? HIVING_PORTFOLIO : HIVING_PORTFOLIO.filter(p => p.cat === filter);

  return (
    <div id="portfolio" style={{
      padding: '120px 40px', background: P.bg, position: 'relative',
      borderBottomLeftRadius: 40, borderBottomRightRadius: 40, scrollMarginTop: 80,
    }}>
      <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, textTransform: 'uppercase', marginBottom: 16 }}>
        ¶ 04 — Travaux récents
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56 }}>
        <h2 style={{
          fontFamily: P.display, fontSize: 'clamp(72px, 10vw, 160px)',
          lineHeight: 0.9, letterSpacing: '-0.045em', margin: 0, fontWeight: 600,
        }}>
          Ils sont <span style={{
            fontFamily: P.hand, color: P.accent, fontWeight: 700,
            display: 'inline-block', transform: 'rotate(-2deg)',
          }}>passés</span> ici.
        </h2>
        <div style={{ display: 'flex', gap: 4, padding: 4, background: P.ink, borderRadius: 999 }}>
          {['Tous', 'Print', 'Vidéo', 'YouTube'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '10px 20px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: filter === f ? P.accent : 'transparent',
              color: filter === f ? P.bg : P.bg,
              fontFamily: P.display, fontSize: 13, fontWeight: 600,
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
      }}>
        {filtered.map((p, i) => {
          const isYouTube = p.cat === 'YouTube';
          const handleClick = isYouTube && p.youtube ? () => window.open(p.youtube, '_blank', 'noopener') : undefined;
          const badge = p.cat === 'YouTube' ? '▶ YOUTUBE' : (p.cat === 'Vidéo' ? '▶ VIDÉO' : '◇ PRINT');
          const badgeBg = p.cat === 'YouTube' ? '#ff0000' : P.bg;
          const badgeColor = p.cat === 'YouTube' ? '#fff' : P.ink;
          return (
          <div key={i} style={{
            cursor: 'pointer', transition: 'transform 0.3s',
            gridColumn: isYouTube ? 'span 2' : 'span 1',
          }}
          onClick={handleClick}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              aspectRatio: isYouTube ? '16/9' : '4/5', background: p.tone, position: 'relative',
              overflow: 'hidden', borderRadius: 16,
            }}>
              <V3Placeholder label={`${p.brand}\n${p.cat.toUpperCase()}`} tone={p.tone} P={P} dark src={p.image} />
              {isYouTube && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(180deg, transparent 0%, transparent 50%, rgba(0,0,0,0.45) 100%)',
                  pointerEvents: 'none',
                }}>
                  <div style={{
                    width: 84, height: 84, borderRadius: '50%',
                    background: 'rgba(255,0,0,0.95)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 18px 40px rgba(0,0,0,0.4)',
                  }}>
                    <div style={{
                      width: 0, height: 0,
                      borderLeft: '24px solid #fff',
                      borderTop: '15px solid transparent',
                      borderBottom: '15px solid transparent',
                      marginLeft: 6,
                    }} />
                  </div>
                </div>
              )}
              <div style={{
                position: 'absolute', top: 14, left: 14,
                padding: '6px 12px', background: badgeBg, color: badgeColor,
                fontFamily: P.mono, fontSize: 10, letterSpacing: '0.14em',
                borderRadius: 999, fontWeight: isYouTube ? 700 : 400,
              }}>{badge}{isYouTube && p.duration ? ` · ${p.duration}` : ''}</div>
              <div style={{
                position: 'absolute', top: 14, right: 14,
                width: 36, height: 36, borderRadius: '50%', background: P.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Plus color={P.ink} size={14} />
              </div>
            </div>
            <div style={{ padding: '16px 4px 0' }}>
              <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 6, textTransform: 'uppercase' }}>
                {p.year}
              </div>
              <div style={{ fontFamily: P.display, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.05 }}>
                {p.brand}
              </div>
              <div style={{ fontFamily: P.serif, fontSize: 15, color: P.inkSoft, marginTop: 4, fontStyle: 'italic' }}>
                {p.project}
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DISHES ────────────────────────────────────────────────────────
function V3Dishes({ P }) {
  return (
    <div id="cuisine" style={{ padding: '120px 40px', background: P.bg, position: 'relative', scrollMarginTop: 80 }}>
      <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, textTransform: 'uppercase', marginBottom: 16 }}>
        ¶ 05 — Carnet de cuisine
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'baseline', marginBottom: 64 }}>
        <h2 style={{
          fontFamily: P.display, fontSize: 'clamp(60px, 9vw, 140px)',
          lineHeight: 0.92, letterSpacing: '-0.04em', margin: 0, fontWeight: 600,
        }}>
          <span style={{
            fontFamily: P.hand, color: P.accent, fontWeight: 700,
            display: 'inline-block', transform: 'rotate(-2deg)',
          }}>Cuisinés ici,</span><br />photographiés ici.
        </h2>
        <p style={{ fontFamily: P.serif, fontSize: 21, lineHeight: 1.4, color: P.inkSoft, margin: 0, maxWidth: 480 }}>
          Notre cuisine de tournage produit des plats <em>réels, comestibles</em>, signés
          par nos chefs résidents. Aucun trucage, aucune colle, aucune laque.
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoRows: '320px', gap: 14,
      }}>
        {HIVING_DISHES.map((d, i) => (
          <div key={i} style={{
            background: d.tone, position: 'relative', borderRadius: 16,
            overflow: 'hidden',
            gridColumn: i === 0 ? 'span 2' : 'span 1',
            gridRow: i === 0 || i === 3 ? 'span 2' : 'span 1',
          }}>
            <V3Placeholder label={d.name} tone={d.tone} P={P} dark />
            <div style={{
              position: 'absolute', top: 16, left: 16,
              fontFamily: P.hand, fontSize: 26, color: P.bg, fontWeight: 700,
              transform: 'rotate(-3deg)', opacity: 0.9,
            }}>
              №{String(i + 1).padStart(2, '0')}
            </div>
            <div style={{
              position: 'absolute', bottom: 20, left: 20, right: 20, color: P.bg,
            }}>
              <div style={{ fontFamily: P.display, fontSize: 22, fontWeight: 600, marginBottom: 6, lineHeight: 1.1 }}>
                {d.name}
              </div>
              <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.14em', opacity: 0.8, textTransform: 'uppercase' }}>
                {d.chef}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EQUIPMENT ─────────────────────────────────────────────────────
function V3Equipment({ P }) {
  const [open, setOpen] = React.useState(0);

  return (
    <div id="materiel" style={{ padding: '120px 40px', background: P.cream, position: 'relative', scrollMarginTop: 80 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80, alignItems: 'baseline', marginBottom: 64 }}>
        <div>
          <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, textTransform: 'uppercase', marginBottom: 16 }}>
            ¶ 06 — Inventaire
          </div>
          <h2 style={{
            fontFamily: P.display, fontSize: 'clamp(60px, 9vw, 140px)',
            lineHeight: 0.9, letterSpacing: '-0.045em', margin: 0, fontWeight: 600,
          }}>
            Le matos —<br />
            <span style={{
              fontFamily: P.hand, color: P.accent, fontWeight: 700,
              display: 'inline-block', transform: 'rotate(-2deg)',
            }}>jusqu'au dernier objectif.</span>
          </h2>
        </div>
        <p style={{ fontFamily: P.serif, fontSize: 19, lineHeight: 1.5, color: P.inkSoft, margin: 0 }}>
          Plus de 800 références sur place. Réservez avec votre plateau, ou louez à la pièce.
          <strong style={{ color: P.ink }}> Décote -15%</strong> sur le matériel quand vous bookez le studio.
        </p>
      </div>

      <div style={{ borderTop: `2px solid ${P.ink}` }}>
        {HIVING_EQUIPMENT.map((cat, i) => (
          <div key={i} style={{ borderBottom: `1px dashed ${P.ink}40` }}>
            <button onClick={() => setOpen(open === i ? -1 : i)} style={{
              width: '100%', padding: '32px 0', background: 'transparent',
              border: 'none', color: P.ink, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: P.display, fontSize: 'clamp(32px, 4.5vw, 60px)',
              fontWeight: 600, letterSpacing: '-0.02em', textAlign: 'left',
            }}>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 28 }}>
                <span style={{ fontFamily: P.hand, fontSize: 28, color: P.accent, fontWeight: 700, transform: 'rotate(-3deg)', display: 'inline-block' }}>
                  №{String(i + 1).padStart(2, '0')}
                </span>
                {cat.cat}
              </span>
              <span style={{
                width: 48, height: 48, borderRadius: '50%',
                border: `2px solid ${P.ink}`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                background: open === i ? P.accent : 'transparent',
                transition: 'background 0.2s',
              }}>
                <span style={{ fontFamily: P.display, fontSize: 24, fontWeight: 600, color: open === i ? P.bg : P.ink }}>
                  {open === i ? '×' : '+'}
                </span>
              </span>
            </button>
            {open === i && (
              <div style={{
                paddingBottom: 32, display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
              }}>
                {cat.items.map((it, j) => (
                  <div key={j} style={{
                    fontFamily: P.serif, fontSize: 17, padding: '14px 16px',
                    background: P.bg, borderRadius: 12,
                    display: 'flex', gap: 12, alignItems: 'baseline',
                  }}>
                    <span style={{ fontFamily: P.mono, fontSize: 11, color: P.accent, fontWeight: 600 }}>
                      +{String(j + 1).padStart(2, '0')}
                    </span>
                    {it}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BOOKING ───────────────────────────────────────────────────────
function V3Booking({ P }) {
  const [selStudio, setSelStudio] = React.useState(0);
  const [selDate, setSelDate] = React.useState(12);
  const [selSlot, setSelSlot] = React.useState('day');

  const days = Array.from({ length: 35 }, (_, i) => {
    const d = i - 2;
    return { d, label: d > 0 && d <= 31 ? d : '' };
  });
  const booked = [3, 7, 8, 14, 19, 22, 23, 28];

  const slots = {
    day: { label: 'Journée 9h–19h', price: '1 800' },
    half: { label: 'Demi-journée 4h', price: '1 050' },
    night: { label: 'Nuit 19h–9h', price: '1 400' },
  };

  return (
    <div style={{ padding: '120px 40px', background: P.bg, position: 'relative' }}>
      {/* big splat in background */}
      <div style={{ position: 'absolute', top: 60, right: 80, opacity: 0.8 }}>
        <Splat color={P.butter} size={180} style={{ transform: 'rotate(20deg)' }} />
      </div>

      <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, textTransform: 'uppercase', marginBottom: 16 }}>
        ¶ 07 — Réservation
      </div>
      <h2 style={{
        fontFamily: P.display, fontSize: 'clamp(80px, 12vw, 200px)',
        lineHeight: 0.88, letterSpacing: '-0.045em', margin: '0 0 80px',
        fontWeight: 600, position: 'relative',
      }}>
        <span style={{
          fontFamily: P.hand, color: P.accent, fontWeight: 700,
          display: 'inline-block', transform: 'rotate(-2deg)',
        }}>Quand</span> venez-vous ?
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: P.hand, fontSize: 26, color: P.inkSoft, marginBottom: 12, transform: 'rotate(-1deg)', display: 'inline-block', fontWeight: 600 }}>
            01 — choisissez votre plateau
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 36 }}>
            {HIVING_STUDIOS.map((s, i) => (
              <button key={s.id} onClick={() => setSelStudio(i)} style={{
                textAlign: 'left', padding: '18px 22px', borderRadius: 16,
                background: selStudio === i ? P.ink : 'transparent',
                color: selStudio === i ? P.bg : P.ink,
                border: `2px solid ${P.ink}`, cursor: 'pointer',
                fontFamily: P.display, fontSize: 20, fontWeight: 600,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontFamily: P.hand, fontSize: 24, color: selStudio === i ? P.accent : P.accent, fontWeight: 700 }}>№{s.num}</span>
                  {s.name}
                </span>
                <span style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.12em', opacity: 0.7 }}>
                  {s.surface}
                </span>
              </button>
            ))}
          </div>

          <div style={{ fontFamily: P.hand, fontSize: 26, color: P.inkSoft, marginBottom: 12, transform: 'rotate(-1deg)', display: 'inline-block', fontWeight: 600 }}>
            02 — créneau
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
            {Object.entries(slots).map(([k, v]) => (
              <button key={k} onClick={() => setSelSlot(k)} style={{
                padding: '16px 22px', textAlign: 'left', borderRadius: 16,
                background: selSlot === k ? P.ink : 'transparent',
                color: selSlot === k ? P.bg : P.ink,
                border: `2px solid ${P.ink}`, cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontFamily: P.display, fontSize: 17, fontWeight: 500,
              }}>
                <span>{v.label}</span>
                <span style={{ fontFamily: P.mono, fontSize: 13 }}>{v.price} €</span>
              </button>
            ))}
          </div>

          <div style={{
            padding: '24px 28px', background: P.ink, color: P.bg, borderRadius: 20,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <Plus color={P.accent} size={24} style={{ position: 'absolute', top: 16, right: 16, opacity: 0.5 }} />
            <div>
              <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', opacity: 0.6, marginBottom: 4 }}>
                ESTIMATION HT
              </div>
              <div style={{ fontFamily: P.display, fontSize: 42, fontWeight: 600, letterSpacing: '-0.02em' }}>
                {slots[selSlot].price} €
              </div>
            </div>
            <button style={{
              padding: '14px 22px', background: P.accent, color: P.bg, border: 'none',
              fontFamily: P.display, fontSize: 14, fontWeight: 600, borderRadius: 999,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Demander un devis
              <span>→</span>
            </button>
          </div>
        </div>

        <div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 20, fontFamily: P.mono, fontSize: 12, letterSpacing: '0.14em',
            color: P.inkSoft, textTransform: 'uppercase',
          }}>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: P.display, fontSize: 14, fontWeight: 600, color: P.ink }}>← Mai</button>
            <span style={{ color: P.ink, fontFamily: P.display, fontSize: 32, letterSpacing: '-0.02em', textTransform: 'none', fontWeight: 600 }}>
              Juin <span style={{ fontFamily: P.hand, color: P.accent, fontWeight: 700, transform: 'rotate(-2deg)', display: 'inline-block' }}>2026</span>
            </span>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: P.display, fontSize: 14, fontWeight: 600, color: P.ink }}>Juillet →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
              <div key={i} style={{
                padding: '10px 0', textAlign: 'center',
                fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft,
              }}>{d}</div>
            ))}
            {days.map((day, i) => {
              const isBooked = booked.includes(day.d);
              const isSelected = selDate === day.d;
              const isPast = day.d < 5 && day.d > 0;
              return (
                <button key={i} onClick={() => !isBooked && day.d > 0 && setSelDate(day.d)} disabled={isBooked || day.d <= 0}
                  style={{
                    aspectRatio: '1/1', borderRadius: 12,
                    background: isSelected ? P.ink : (isBooked ? 'transparent' : P.cream),
                    border: isBooked ? `1px dashed ${P.ink}30` : 'none',
                    position: 'relative',
                    color: isSelected ? P.bg : (isBooked ? P.inkSoft : P.ink),
                    cursor: isBooked || day.d <= 0 ? 'default' : 'pointer',
                    fontFamily: P.display, fontSize: 20, fontWeight: 500,
                    opacity: day.d <= 0 ? 0 : (isPast ? 0.3 : 1),
                  }}>
                  {day.label}
                  {isBooked && (
                    <div style={{
                      position: 'absolute', inset: 6,
                      backgroundImage: `repeating-linear-gradient(-45deg, ${P.ink}40 0 1px, transparent 1px 6px)`,
                      borderRadius: 8,
                    }}></div>
                  )}
                  {isSelected && (
                    <div style={{
                      position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
                      width: 6, height: 6, borderRadius: '50%', background: P.accent,
                    }}></div>
                  )}
                </button>
              );
            })}
          </div>
          <div style={{
            display: 'flex', gap: 24, marginTop: 24, fontFamily: P.mono,
            fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: P.inkSoft,
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 12, height: 12, background: P.ink, display: 'inline-block', borderRadius: 3 }}></span> Sélectionné
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 12, height: 12, border: `1px dashed ${P.inkSoft}`, display: 'inline-block', borderRadius: 3 }}></span> Réservé
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 12, height: 12, background: P.cream, display: 'inline-block', borderRadius: 3 }}></span> Disponible
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────
function V3Faq({ P }) {
  const [open, setOpen] = React.useState(0);
  return (
    <div style={{ padding: '120px 40px', background: P.bg }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64 }}>
        <div>
          <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, textTransform: 'uppercase', marginBottom: 16 }}>
            ¶ 08 — Questions
          </div>
          <h2 style={{ fontFamily: P.display, fontWeight: 600, fontSize: 72, lineHeight: 0.95, letterSpacing: '-0.04em', margin: 0 }}>
            Avant de<br />
            <span style={{ fontFamily: P.hand, color: P.accent, fontWeight: 700, display: 'inline-block', transform: 'rotate(-2deg)' }}>nous écrire.</span>
          </h2>
        </div>
        <div>
          {HIVING_FAQ.map((f, i) => (
            <div key={i} style={{ borderTop: `1px dashed ${P.ink}40` }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={{
                width: '100%', padding: '28px 0', background: 'transparent',
                border: 'none', color: P.ink, cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontFamily: P.display, fontSize: 26, textAlign: 'left', fontWeight: 600,
              }}>
                <span>{f.q}</span>
                <span style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: open === i ? P.accent : P.cream,
                  color: open === i ? P.bg : P.ink,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: P.display, fontSize: 18, fontWeight: 600,
                }}>{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div style={{ paddingBottom: 28, fontFamily: P.serif, fontSize: 19, color: P.inkSoft, lineHeight: 1.5, maxWidth: 640 }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
          <div style={{ borderTop: `1px dashed ${P.ink}40` }}></div>
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────
function V3Footer({ P }) {
  return (
    <div style={{ padding: '96px 40px 40px', background: P.ink, color: P.bg, position: 'relative' }}>
      <div style={{ position: 'absolute', top: 48, right: 80 }}>
        <Splat color={P.accent} size={140} style={{ transform: 'rotate(-15deg)' }} />
      </div>

      <h2 style={{
        fontFamily: P.display, fontWeight: 600,
        fontSize: 'clamp(120px, 18vw, 320px)', lineHeight: 0.85,
        letterSpacing: '-0.05em', margin: '0 0 64px', position: 'relative',
      }}>
        On <span style={{
          fontFamily: P.hand, color: P.butter, fontWeight: 700,
          display: 'inline-block', transform: 'rotate(-3deg)',
        }}>shoote</span><br />
        ensemble ?
      </h2>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 28,
        borderTop: `1px dashed ${P.bg}30`, paddingTop: 40,
      }}>
        {[
          {
            title: 'Adresse',
            links: [
              { label: '4 rue Mozart', href: 'https://maps.google.com/?q=4+rue+Mozart+92110+Clichy', external: true },
              { label: '92110 Clichy', text: true },
              { label: 'France', text: true },
              { label: 'Métro 13 — Mairie de Clichy', text: true, small: true },
            ],
          },
          {
            title: 'Contact',
            links: [
              { label: 'contact@hivingfood.fr', href: 'mailto:contact@hivingfood.fr' },
              { label: 'Devis instantané', href: 'pages/devis.html' },
            ],
          },
          {
            title: 'Plateaux',
            links: [
              { label: 'Studio Pro', href: 'index.html#plateaux' },
              { label: 'Studio Famille', href: 'index.html#plateaux' },
              { label: 'Tarifs', href: 'pages/tarifs.html' },
            ],
          },
          {
            title: 'Services',
            links: [
              { label: 'Photo culinaire Paris', href: 'pages/photo-culinaire-paris.html' },
              { label: 'Packshot alimentaire', href: 'pages/packshot-produit-alimentaire.html' },
              { label: 'Stop motion food', href: 'pages/stop-motion-food.html' },
              { label: 'Spot TV cuisine', href: 'pages/spot-tv-cuisine.html' },
              { label: 'Tous les services', href: 'pages/services.html' },
            ],
          },
          {
            title: 'Studio',
            links: [
              { label: 'Travaux & cas clients', href: 'pages/travaux.html' },
              { label: 'Le Carnet (blog)', href: 'pages/carnet.html' },
              { label: 'Équipe', href: 'pages/equipe.html' },
              { label: 'Presse', href: 'pages/presse.html' },
              { label: 'Instagram ↗', href: 'https://www.instagram.com/hivingfood/', external: true },
            ],
          },
        ].map((col, i) => (
          <div key={i}>
            <div style={{
              fontFamily: P.hand, fontSize: 22, color: P.accent, fontWeight: 700,
              transform: 'rotate(-2deg)', display: 'inline-block', marginBottom: 12,
            }}>{col.title}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: P.serif, fontSize: 16, lineHeight: 1.7 }}>
              {col.links.map((l, j) => (
                <li key={j} style={{ opacity: l.small ? 0.6 : 1, fontSize: l.small ? 13 : 'inherit' }}>
                  {l.text ? (
                    <span>{l.label}</span>
                  ) : (
                    <a href={l.href}
                      target={l.external ? '_blank' : undefined}
                      rel={l.external ? 'noopener' : undefined}
                      style={{ color: P.bg, textDecoration: 'none', borderBottom: `1px solid ${P.bg}20` }}
                      onMouseEnter={e => e.currentTarget.style.borderBottomColor = P.accent}
                      onMouseLeave={e => e.currentTarget.style.borderBottomColor = `${P.bg}20`}
                    >{l.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 64, paddingTop: 24, borderTop: `1px dashed ${P.bg}30`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <picture>
          <source srcSet="assets/logo-hiving-studio-white.webp" type="image/webp" />
          <img src="assets/logo-hiving-studio-white.png"
            alt="Hiving Studio"
            width="1024" height="683"
            loading="lazy" decoding="async"
            style={{ height: 56, width: 'auto', display: 'block' }} />
        </picture>
        <div style={{
          display: 'flex', gap: 24,
          fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em',
          textTransform: 'uppercase', opacity: 0.6,
        }}>
          <span>© Hiving Studio — 2026</span>
          <span>Conçu à Clichy</span>
          <a href="pages/mentions-legales.html" style={{ color: P.bg, textDecoration: 'none', opacity: 0.85 }}>Mentions légales</a>
          <a href="pages/politique-confidentialite.html" style={{ color: P.bg, textDecoration: 'none', opacity: 0.85 }}>Confidentialité</a>
        </div>
      </div>
    </div>
  );
}

// ─── PLACEHOLDER (or real image when src provided) ────────────────
function V3Placeholder({ label, tone, P, dark, src, poster, priority }) {
  if (src) {
    const isVideo = /\.(mp4|webm|mov)$/i.test(src);
    return (
      <div style={{
        width: '100%', height: '100%', position: 'absolute', inset: 0,
        overflow: 'hidden', background: tone || '#000',
      }}>
        {isVideo ? (
          <video
            poster={poster || src.replace(/\.(mp4|webm|mov)$/i, '.jpg')}
            ref={el => {
              if (el && !el.dataset.bound) {
                el.dataset.bound = '1';
                const tryPlay = () => {
                  el.muted = true;
                  el.play().catch(() => {});
                };
                el.addEventListener('loadedmetadata', tryPlay);
                el.addEventListener('canplay', tryPlay);
                if ('IntersectionObserver' in window) {
                  const io = new IntersectionObserver((entries) => {
                    entries.forEach(e => {
                      if (e.isIntersecting) { el.load(); tryPlay(); }
                    });
                  }, { rootMargin: '200px' });
                  io.observe(el);
                } else {
                  el.load();
                }
              }
            }}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <img src={src} alt={label || ''}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchpriority={priority ? 'high' : 'auto'}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              display: 'block',
            }} />
        )}
      </div>
    );
  }
  const stripe = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const text = dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)';
  return (
    <div style={{
      width: '100%', height: '100%', position: 'absolute', inset: 0,
      background: `repeating-linear-gradient(45deg, ${stripe} 0 14px, transparent 14px 28px), ${tone}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: text, textAlign: 'center',
        whiteSpace: 'pre-line',
      }}>[ {label} ]</div>
    </div>
  );
}

Object.assign(window, { V3Page, v3Styles, Link });
