// V3 PREMIUM — extensions de niveau studio premium
// Process · Témoignages · Équipe · Hero ticker live · Curseur custom

// ─── CUSTOM CURSOR ────────────────────────────────────────────────
function V3Cursor({ P }) {
  const [pos, setPos] = React.useState({ x: -100, y: -100 });
  const [hovering, setHovering] = React.useState(false);
  const [label, setLabel] = React.useState('');

  React.useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    const onOver = (e) => {
      const t = e.target.closest('[data-cursor]');
      if (t) {
        setHovering(true);
        setLabel(t.dataset.cursor || '');
      } else {
        setHovering(false);
        setLabel('');
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9999,
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        pointerEvents: 'none', mixBlendMode: 'difference',
      }}>
        <div style={{
          width: hovering ? 96 : 14, height: hovering ? 96 : 14, borderRadius: '50%',
          background: hovering ? P.lime : P.bg,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.3s cubic-bezier(.2,.9,.3,1.4), height 0.3s cubic-bezier(.2,.9,.3,1.4), background 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: P.display, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: P.ink, textAlign: 'center',
        }}>
          {hovering && label}
        </div>
      </div>
    </>
  );
}

// ─── HERO LIVE STATUS BAR (sub-marquee) ────────────────────────────
function V3HeroStatus({ P }) {
  const [time, setTime] = React.useState('');
  React.useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 40px', background: P.ink, color: P.bg,
      fontFamily: P.mono, fontSize: 11, letterSpacing: '0.14em',
      borderBottom: `1px solid ${P.bg}10`,
    }}>
      <div style={{ display: 'flex', gap: 24 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', background: P.lime,
            animation: 'v3-blink 1.4s infinite',
          }}></span>
          CLICHY · {time}
        </span>
        <span style={{ opacity: 0.5 }}>48.9023° N · 2.3075° E</span>
      </div>
      <div style={{ display: 'flex', gap: 24, opacity: 0.7 }}>
        <span>Le Pro — disponible</span>
        <span>Le Familial — en tournage</span>
      </div>
      <style>{`@keyframes v3-blink { 0%,100% { opacity: 1 } 50% { opacity: 0.3 } }`}</style>
    </div>
  );
}

// ─── PROCESS — 5 ÉTAPES ───────────────────────────────────────────
function V3Process({ P }) {
  const steps = [
    {
      num: '01',
      title: 'Brief',
      hand: 'on s\'écoute',
      body: 'Vous nous racontez le projet. On affine ensemble : ambition, livrable, références. 30 minutes en visio ou autour d\'un café au studio.',
      meta: 'J−14 → J−7',
    },
    {
      num: '02',
      title: 'Repérages',
      hand: 'on cale tout',
      body: 'Visite du plateau retenu, validation des cadrages, lumière, accessoires. Notre régisseur prépare la liste matériel.',
      meta: 'J−7 → J−2',
    },
    {
      num: '03',
      title: 'Préparation',
      hand: 'la cuisine s\'allume',
      body: 'Notre chef résident cuisine vos plats à blanc. Test d\'éclairage, calibrage, mise en place. Tout est prêt avant que vous arriviez.',
      meta: 'J−1',
    },
    {
      num: '04',
      title: 'Tournage',
      hand: 'on shoote.',
      body: 'Vous arrivez, ça tourne. On gère lumière, accessoires, stylisme food, vidéo, retouches live. Vous, vous créez.',
      meta: 'Le jour J',
    },
    {
      num: '05',
      title: 'Livraison',
      hand: 'on déguste',
      body: 'Rushes transférés sous 24h via lien sécurisé. Backup conservé 90 jours. Et oui — on garde toujours quelque chose à manger pour vous.',
      meta: 'J+1 → J+3',
    },
  ];

  return (
    <div style={{
      padding: '120px 40px', background: P.bg, position: 'relative',
    }}>
      <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, textTransform: 'uppercase', marginBottom: 16 }}>
        ¶ — Notre process
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'baseline', marginBottom: 64 }}>
        <h2 style={{
          fontFamily: P.display, fontSize: 'clamp(64px, 9vw, 140px)',
          lineHeight: 0.92, letterSpacing: '-0.04em', margin: 0, fontWeight: 600,
        }}>
          De l'idée au plat —<br />
          <span style={{
            fontFamily: P.hand, color: P.ink, fontWeight: 700,
            display: 'inline-block', transform: 'rotate(-2deg)',
            background: P.lime, padding: '0.05em 0.3em 0.15em', borderRadius: '0.3em',
          }}>en 5 temps.</span>
        </h2>
        <p style={{ fontFamily: P.serif, fontSize: 19, lineHeight: 1.5, color: P.inkSoft, margin: 0, maxWidth: 420 }}>
          Chaque tournage est différent — mais on le démarre toujours pareil :
          en s'asseyant. Notre process est rodé pour qu'aucune surprise n'arrive
          le jour J.
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        {/* Timeline ligne */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 76,
          height: 2, background: `repeating-linear-gradient(90deg, ${P.ink} 0 8px, transparent 8px 14px)`,
          zIndex: 0,
        }}></div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, position: 'relative', zIndex: 1,
        }}>
          {steps.map((s, i) => (
            <div key={i} data-cursor="" style={{
              padding: '0 4px',
            }}>
              {/* Bullet */}
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: i === 3 ? P.lime : P.bg,
                border: `2px solid ${P.ink}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 28, fontFamily: P.display, fontSize: 22, fontWeight: 600,
                position: 'relative',
              }}>
                {s.num}
                {i === 3 && (
                  <div style={{
                    position: 'absolute', inset: -6, borderRadius: '50%',
                    border: `2px solid ${P.lime}`, animation: 'v3-pulse-ring 2s infinite',
                  }}></div>
                )}
              </div>
              <div style={{
                fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em',
                textTransform: 'uppercase', color: P.inkSoft, marginBottom: 10,
              }}>
                {s.meta}
              </div>
              <h3 style={{
                fontFamily: P.display, fontSize: 36, fontWeight: 600,
                letterSpacing: '-0.02em', margin: '0 0 6px', lineHeight: 1,
              }}>
                {s.title}
              </h3>
              <div style={{
                fontFamily: P.hand, fontSize: 22, color: P.ink, fontWeight: 600,
                transform: 'rotate(-2deg)', display: 'inline-block', marginBottom: 14,
              }}>
                — {s.hand}
              </div>
              <p style={{
                fontFamily: P.serif, fontSize: 15, lineHeight: 1.5,
                color: P.inkSoft, margin: 0,
              }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
        <style>{`@keyframes v3-pulse-ring { 0% { transform: scale(1); opacity: 1 } 100% { transform: scale(1.6); opacity: 0 } }`}</style>
      </div>
    </div>
  );
}

// ─── CLIENTS / TÉMOIGNAGES ────────────────────────────────────────
function V3Testimonials({ P }) {
  const tests = [
    {
      brand: 'Starbucks',
      who: 'Brand Team',
      role: 'Coffee & Creative',
      year: '2025',
      quote: 'Hiving Studio est devenu notre plateau food annuel. 58 vidéos en 2025, 28.4M d\'audiences cumulées. Le casting créateurs et la maîtrise de la cuisine de tournage font la différence.',
    },
    {
      brand: 'Picard',
      who: 'Marketing',
      role: 'Brand Content',
      year: '2025',
      quote: 'Pour la campagne Noël on a tourné 20 vidéos en 4 jours. Le studio Familial a permis de garder une ambiance maison authentique tout en ayant l\'équipement pro derrière. Personne d\'autre ne fait ça à ce niveau.',
    },
    {
      brand: 'Coyote',
      who: 'Comm.',
      role: '20 ans',
      year: '2024',
      quote: 'Vincent Salur a réalisé un trompe-l\'œil en forme de boîtier Coyote Max. 1M d\'audiences cumulées TikTok+IG, 1600 interactions Instagram. Le plateau Pro a permis le rendu hyper précis qu\'on cherchait.',
    },
  ];
  const [active, setActive] = React.useState(0);

  return (
    <div style={{
      padding: '120px 40px', background: P.ink, color: P.bg, position: 'relative',
    }}>
      {/* big lime link */}
      <div style={{ position: 'absolute', top: 60, right: 80, transform: 'rotate(18deg)', opacity: 0.95 }}>
        <Link color={P.lime} size={120} />
      </div>

      <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', opacity: 0.6, textTransform: 'uppercase', marginBottom: 16 }}>
        ¶ — Ce qu'ils en disent
      </div>
      <h2 style={{
        fontFamily: P.display, fontSize: 'clamp(64px, 9vw, 140px)',
        lineHeight: 0.92, letterSpacing: '-0.04em', margin: '0 0 80px', fontWeight: 600,
      }}>
        Trois mots,<br />
        <span style={{
          fontFamily: P.hand, color: P.ink, fontWeight: 700,
          display: 'inline-block', transform: 'rotate(-2deg)',
          background: P.lime, padding: '0.05em 0.3em 0.15em', borderRadius: '0.3em',
        }}>plein de plats.</span>
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 64, alignItems: 'start' }}>
        {/* List */}
        <div>
          {tests.map((t, i) => (
            <button key={i} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)}
              data-cursor=""
              style={{
                width: '100%', textAlign: 'left', padding: '24px 0',
                borderTop: `1px dashed ${P.bg}30`,
                background: 'transparent', border: 'none',
                color: P.bg, cursor: 'pointer',
                opacity: active === i ? 1 : 0.45,
                transition: 'opacity 0.2s, padding-left 0.3s',
                paddingLeft: active === i ? 16 : 0, position: 'relative',
              }}>
              {active === i && <span style={{
                position: 'absolute', left: -2, top: 30, width: 6, height: 6,
                borderRadius: '50%', background: P.lime,
              }}></span>}
              <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', opacity: 0.6, marginBottom: 6 }}>
                {t.year}
              </div>
              <div style={{ fontFamily: P.display, fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>
                {t.brand}
              </div>
              <div style={{ fontFamily: P.serif, fontSize: 15, color: P.bg, opacity: 0.7, fontStyle: 'italic', marginTop: 4 }}>
                {t.who} · {t.role}
              </div>
            </button>
          ))}
          <div style={{ borderTop: `1px dashed ${P.bg}30` }}></div>
        </div>

        {/* Active quote */}
        <div style={{ position: 'sticky', top: 100 }}>
          <div style={{
            fontFamily: P.hand, fontSize: 64, color: P.lime, fontWeight: 700,
            transform: 'rotate(-3deg)', display: 'inline-block', lineHeight: 0.6,
            marginBottom: 24,
          }}>
            “
          </div>
          <p style={{
            fontFamily: P.serif, fontSize: 'clamp(28px, 3.2vw, 44px)',
            lineHeight: 1.25, fontStyle: 'italic', fontWeight: 400,
            margin: 0, letterSpacing: '-0.01em',
          }}>
            {tests[active].quote}
          </p>
          <div style={{
            marginTop: 40, display: 'flex', gap: 24, alignItems: 'center',
            paddingTop: 24, borderTop: `1px dashed ${P.bg}30`,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: P.lime,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: P.display, fontSize: 18, fontWeight: 700, color: P.ink,
            }}>
              {tests[active].who.split(' ').map(w => w[0]).join('')}
            </div>
            <div>
              <div style={{ fontFamily: P.display, fontSize: 18, fontWeight: 600 }}>
                {tests[active].who}
              </div>
              <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.14em', opacity: 0.6, textTransform: 'uppercase', marginTop: 2 }}>
                {tests[active].role} · {tests[active].brand}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logos clients */}
      <div style={{
        marginTop: 96, paddingTop: 40, borderTop: `1px dashed ${P.bg}30`,
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4, alignItems: 'center',
      }}>
        {['STARBUCKS', 'PICARD', 'COYOTE', 'BONNE MAMAN', 'HERTA', 'INNOCENT'].map((n, i) => (
          <div key={i} style={{
            padding: '20px 16px', textAlign: 'center',
            fontFamily: P.display, fontSize: 14, fontWeight: 700,
            letterSpacing: '0.08em', opacity: 0.6,
            borderRight: i < 5 ? `1px dashed ${P.bg}20` : 'none',
          }}>
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ÉQUIPE ───────────────────────────────────────────────────────
function V3Team({ P }) {
  const team = [
    { name: 'Peppe Cutraro', role: 'Chef pizza · 203K', desc: 'Champion du monde pizza napolitaine 2019, ex-Big Mamma. Tourne ses contenus dans nos studios.', tone: '#a83232' },
    { name: 'Vincent Salur', role: 'Pâtissier · 768K', desc: 'Pâtisserie d\'accessibilité technique. Le trompe-l\'œil Coyote, c\'est lui.', tone: '#c9a574' },
    { name: 'Drice Cook', role: 'Chef cuisinier · 1.8M', desc: '« Cuisine au hasard d\'une fléchette ». Tournages réguliers chez nous depuis 2024.', tone: '#6e3a20' },
    { name: 'Kilian Franceschi', role: 'Chef · Top Chef 2025 · 566K', desc: 'Gastro, mode, musique. Plateau Pro pour les démos techniques.', tone: '#0a0908' },
  ];

  return (
    <div style={{
      padding: '120px 40px', background: P.cream, position: 'relative',
    }}>
      <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, textTransform: 'uppercase', marginBottom: 16 }}>
        ¶ — Les humains
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'baseline', marginBottom: 64 }}>
        <h2 style={{
          fontFamily: P.display, fontSize: 'clamp(64px, 9vw, 140px)',
          lineHeight: 0.92, letterSpacing: '-0.04em', margin: 0, fontWeight: 600,
        }}>
          Quatre personnes,<br />
          <span style={{
            fontFamily: P.hand, color: P.ink, fontWeight: 700,
            display: 'inline-block', transform: 'rotate(-2deg)',
            background: P.lime, padding: '0.05em 0.3em 0.15em', borderRadius: '0.3em',
          }}>une cuisine.</span>
        </h2>
        <p style={{ fontFamily: P.serif, fontSize: 19, lineHeight: 1.5, color: P.inkSoft, margin: 0, maxWidth: 420 }}>
          Pas de standardiste, pas de page de contact infinie. Quand vous écrivez,
          c'est l'un de nous qui vous répond — souvent dans l'heure.
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14,
      }}>
        {team.map((t, i) => (
          <div key={i} data-cursor="profil" style={{
            cursor: 'pointer',
          }}>
            <div style={{
              aspectRatio: '4/5', background: t.tone, position: 'relative',
              borderRadius: 16, overflow: 'hidden',
            }}>
              <V3Placeholder label={t.name.toUpperCase()} tone={t.tone} P={P}
                dark={t.tone === '#0a0908' || t.tone === '#3a3a35' || t.tone === '#7a7a6e'} />
              <div style={{
                position: 'absolute', top: 14, left: 14,
                fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em',
                padding: '6px 10px', background: P.bg, color: P.ink,
                borderRadius: 999,
              }}>
                №{String(i + 1).padStart(2, '0')}
              </div>
              <div style={{
                position: 'absolute', bottom: 16, right: 16,
                width: 40, height: 40, borderRadius: '50%',
                background: P.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Plus color={P.ink} size={16} />
              </div>
            </div>
            <div style={{ paddingTop: 16 }}>
              <div style={{
                fontFamily: P.display, fontSize: 22, fontWeight: 600,
                letterSpacing: '-0.01em', lineHeight: 1.05,
              }}>
                {t.name}
              </div>
              <div style={{
                fontFamily: P.hand, fontSize: 22, color: P.ink, fontWeight: 600,
                transform: 'rotate(-2deg)', display: 'inline-block', margin: '4px 0 8px',
              }}>
                {t.role}
              </div>
              <p style={{
                fontFamily: P.serif, fontSize: 15, lineHeight: 1.5,
                color: P.inkSoft, margin: 0, fontStyle: 'italic',
              }}>
                {t.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PRESS / MENTIONS ─────────────────────────────────────────────
function V3Press({ P }) {
  const press = [
    { src: 'Le Fooding', txt: 'Le seul studio parisien où la fiction tient encore debout après le clap.', year: '2025' },
    { src: 'Vogue Paris', txt: 'Un atelier de magie domestique. La lumière du Plateau 01 mériterait son propre Instagram.', year: '2026' },
    { src: 'Le Monde', txt: 'Hiving redéfinit ce que peut être un studio food : un lieu où l\'on cuisine encore.', year: '2025' },
  ];
  return (
    <div style={{
      padding: '96px 40px', background: P.bg, borderTop: `1px dashed ${P.ink}30`,
    }}>
      <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, textTransform: 'uppercase', marginBottom: 40 }}>
        ¶ — On parle de nous
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
      }}>
        {press.map((p, i) => (
          <div key={i} style={{
            padding: '36px 32px',
            borderRight: i < 2 ? `1px dashed ${P.ink}30` : 'none',
            paddingLeft: i === 0 ? 0 : 32,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
              <span style={{
                fontFamily: P.display, fontSize: 22, fontWeight: 700,
                letterSpacing: '-0.02em',
              }}>
                {p.src}
              </span>
              <span style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.14em', color: P.inkSoft }}>
                {p.year}
              </span>
            </div>
            <p style={{
              fontFamily: P.serif, fontSize: 19, lineHeight: 1.45,
              fontStyle: 'italic', color: P.ink, margin: 0,
            }}>
              « {p.txt} »
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  V3Cursor, V3HeroStatus, V3Process, V3Testimonials, V3Team, V3Press,
});
