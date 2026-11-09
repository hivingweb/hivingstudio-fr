// Admin shell : sidebar + topbar + login

function AdminLogin({ P, goto }) {
  const [email, setEmail] = React.useState('marc@hivingfood.fr');
  const [pwd, setPwd] = React.useState('••••••••');
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: P.ink, color: P.bg, position: 'relative', overflow: 'hidden' }}>
      {/* Left brand panel */}
      <div style={{ flex: '1.1', padding: '60px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
        <div>
          <img src="assets/logo-hiving-outline.png" alt="hiving" style={{ height: 80, width: 'auto', filter: 'invert(1) brightness(1.5)' }} />
        </div>
        <div>
          <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', opacity: 0.5, marginBottom: 18 }}>
            BACKOFFICE — V1.4.2
          </div>
          <h1 style={{
            fontFamily: P.display, fontSize: 'clamp(56px, 7vw, 96px)', fontWeight: 700,
            letterSpacing: '-0.04em', lineHeight: 0.95, margin: '0 0 24px',
          }}>
            Bonjour<br />
            <span style={{ fontFamily: P.hand, color: P.lime, fontWeight: 700, transform: 'rotate(-2deg)', display: 'inline-block' }}>la Maison.</span>
          </h1>
          <p style={{ fontFamily: P.serif, fontSize: 22, lineHeight: 1.5, opacity: 0.7, maxWidth: 540 }}>
            Le tableau de bord pour piloter les plateaux, les demandes, l'équipe et la facturation. Tout au même endroit.
          </p>
        </div>
        <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', opacity: 0.4 }}>
          MAI 2026 · 14 RUE DU CHÂTEAU D'EAU, PARIS XI
        </div>
        {/* big lime splat */}
        <div style={{ position: 'absolute', bottom: -80, right: -40, width: 280, height: 280, background: P.lime, borderRadius: '50% 60% 50% 70%', opacity: 0.15, transform: 'rotate(-25deg)' }}></div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: '0.9', background: P.bg, color: P.ink, padding: '60px 80px', display: 'flex', alignItems: 'center', borderTopLeftRadius: 32, borderBottomLeftRadius: 32 }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 12 }}>
            ¶ CONNEXION
          </div>
          <h2 style={{ fontFamily: P.display, fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 8px', lineHeight: 1 }}>
            Bon retour.
          </h2>
          <p style={{ fontFamily: P.serif, fontSize: 17, color: P.inkSoft, margin: '0 0 36px' }}>
            On a <span style={{ fontFamily: P.hand, fontSize: 22, color: P.ink, background: P.lime, padding: '0 8px 2px', borderRadius: 6, display: 'inline-block', transform: 'rotate(-2deg)', fontWeight: 700 }}>7</span> demandes qui t'attendent.
          </p>

          <Field P={P} label="Email" value={email} onChange={setEmail} type="email" />
          <Field P={P} label="Mot de passe" value={pwd} onChange={setPwd} type="password" />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 32px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: P.serif, fontSize: 14 }}>
              <input type="checkbox" defaultChecked style={{ accentColor: P.ink, width: 16, height: 16 }} />
              Se souvenir de moi
            </label>
            <a style={{ fontFamily: P.serif, fontSize: 14, color: P.inkSoft, textDecoration: 'underline', cursor: 'pointer' }}>Mot de passe oublié ?</a>
          </div>

          <button onClick={() => goto('home')} style={{
            width: '100%', padding: '18px 28px', background: P.ink, color: P.bg, border: 'none',
            borderRadius: 14, fontFamily: P.display, fontSize: 16, fontWeight: 600,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
            Entrer dans la Maison <span>→</span>
          </button>

          <div style={{
            marginTop: 32, paddingTop: 24, borderTop: `1px dashed ${P.ink}30`,
            fontFamily: P.mono, fontSize: 11, letterSpacing: '0.14em', color: P.inkSoft,
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>SÉCURISÉ · 2FA</span>
            <span>v1.4.2</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ P, label, value, onChange, type = 'text' }) {
  return (
    <label style={{ display: 'block', marginBottom: 18 }}>
      <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: P.inkSoft, marginBottom: 6 }}>
        {label}
      </div>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '14px 16px',
          border: `1.5px solid ${P.ink}30`, borderRadius: 12,
          fontFamily: P.serif, fontSize: 16, color: P.ink, background: P.bg,
          outline: 'none', boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = P.ink}
        onBlur={e => e.target.style.borderColor = P.ink + '30'}
      />
    </label>
  );
}

// ─── SHELL (sidebar + topbar) ────────────────────────────────────
function AdminShell({ P, route, goto, children }) {
  const navItems = [
    { id: 'home',     label: 'Tableau de bord', icon: '◉', short: 'Accueil' },
    { id: 'requests', label: 'Demandes',        icon: '✦', badge: 7 },
    { id: 'planning', label: 'Planning',        icon: '◫' },
    { id: 'clients',  label: 'Clients',         icon: '◐' },
    { id: 'invoices', label: 'Devis & factures', icon: '✎' },
    { id: 'runsheet', label: 'Run sheets',      icon: '☰' },
    { id: 'settings', label: 'Paramètres',      icon: '⚙' },
  ];
  // Map detail routes to their parent for highlight
  const parentMap = { request: 'requests', booking: 'planning', client: 'clients' };
  const activeId = parentMap[route] || route;

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '260px 1fr', background: P.bg }}>
      {/* SIDEBAR */}
      <aside style={{
        background: P.ink, color: P.bg, position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* logo */}
        <div style={{ padding: '24px 24px 18px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <img src="assets/logo-hiving-outline.png" alt="hiving" style={{ height: 40, filter: 'invert(1) brightness(1.6)' }} />
          <div>
            <div style={{ fontFamily: P.mono, fontSize: 9, letterSpacing: '0.18em', opacity: 0.5 }}>BACKOFFICE</div>
            <div style={{ fontFamily: P.display, fontSize: 13, fontWeight: 600 }}>
              Hiving<span style={{ fontFamily: P.hand, color: P.lime, fontWeight: 700, marginLeft: 4 }}>food</span>
            </div>
          </div>
        </div>

        {/* nav */}
        <nav style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(it => {
            const active = activeId === it.id;
            return (
              <button key={it.id} onClick={() => goto(it.id)} style={{
                background: active ? P.lime : 'transparent', color: active ? P.ink : P.bg,
                border: 'none', borderRadius: 10, padding: '12px 14px',
                fontFamily: P.display, fontSize: 14, fontWeight: active ? 600 : 500,
                textAlign: 'left', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all 0.15s',
              }}>
                <span style={{ fontFamily: P.mono, fontSize: 14, opacity: active ? 1 : 0.6, width: 18, textAlign: 'center' }}>{it.icon}</span>
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.badge && (
                  <span style={{
                    background: active ? P.ink : P.lime, color: active ? P.lime : P.ink,
                    fontFamily: P.mono, fontSize: 11, fontWeight: 700,
                    minWidth: 22, height: 22, borderRadius: 11,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 7px',
                  }}>{it.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* user pill */}
        <div style={{ padding: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
            borderRadius: 12, background: 'rgba(255,255,255,0.04)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: P.lime, color: P.ink,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: P.display, fontSize: 14, fontWeight: 700,
            }}>MB</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: P.display, fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>Marc Bénichou</div>
              <div style={{ fontFamily: P.mono, fontSize: 10, opacity: 0.55, letterSpacing: '0.1em' }}>FONDATEUR</div>
            </div>
            <button onClick={() => goto('login')} style={{
              background: 'transparent', border: 'none', color: P.bg, opacity: 0.5,
              cursor: 'pointer', fontSize: 14,
            }} title="Déconnexion">⏻</button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <div style={{
          padding: '18px 32px', borderBottom: `1px solid ${P.ink}10`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: P.bg, position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
            <Breadcrumbs P={P} route={route} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <SearchPill P={P} />
            <button style={pillIconBtn(P)} title="Notifications">
              ◔
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 8, height: 8, background: P.lime, borderRadius: '50%',
                boxShadow: `0 0 0 2px ${P.bg}`,
              }}></span>
            </button>
            <a href="index.html" target="_blank" style={{
              padding: '10px 18px', border: `1.5px solid ${P.ink}`, borderRadius: 999,
              fontFamily: P.display, fontSize: 13, fontWeight: 600, color: P.ink,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Voir le site public ↗
            </a>
          </div>
        </div>

        <div style={{ padding: '32px 40px', flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}

function pillIconBtn(P) {
  return {
    width: 38, height: 38, borderRadius: '50%', border: `1.5px solid ${P.ink}20`,
    background: P.bg, color: P.ink, cursor: 'pointer', position: 'relative',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
  };
}

function SearchPill({ P }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 14px', background: P.cream, borderRadius: 999,
      width: 280,
    }}>
      <span style={{ opacity: 0.5 }}>⌕</span>
      <input
        placeholder="Rechercher client, demande, facture…"
        style={{
          flex: 1, border: 'none', background: 'transparent', outline: 'none',
          fontFamily: P.serif, fontSize: 14, color: P.ink,
        }}
      />
      <span style={{ fontFamily: P.mono, fontSize: 10, color: P.inkSoft, padding: '2px 6px', border: `1px solid ${P.ink}25`, borderRadius: 4 }}>⌘K</span>
    </div>
  );
}

function Breadcrumbs({ P, route }) {
  const map = {
    home: ['Tableau de bord'],
    requests: ['Demandes'],
    request: ['Demandes', 'HF-K7M2X · Marie Dupont'],
    planning: ['Planning'],
    booking: ['Planning', 'HF-A1B2C · Pierre Hermé'],
    runsheet: ['Run sheets', 'Mardi 14 mai 2026'],
    clients: ['Clients'],
    client: ['Clients', 'Maison Ladurée'],
    invoices: ['Devis & factures'],
    settings: ['Paramètres'],
  };
  const crumbs = map[route] || ['—'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: P.display, fontSize: 14 }}>
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <React.Fragment key={i}>
            <span style={{ color: last ? P.ink : P.inkSoft, fontWeight: last ? 600 : 400 }}>{c}</span>
            {!last && <span style={{ color: P.inkSoft, opacity: 0.4 }}>/</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Reusable bits ────────────────────────────────────────────────
function Card({ P, children, style, pad = 24, dark = false }) {
  return (
    <div style={{
      background: dark ? P.ink : P.bg, color: dark ? P.bg : P.ink,
      border: dark ? 'none' : `1.5px solid ${P.ink}10`,
      borderRadius: 20, padding: pad, ...style,
    }}>
      {children}
    </div>
  );
}

function StatusPill({ P, status, label, sm = false }) {
  const map = {
    pending:    { bg: '#fff3d6', fg: '#7a5500', label: label || 'À traiter' },
    confirmed:  { bg: P.lime, fg: P.ink, label: label || 'Confirmé' },
    paid:       { bg: '#d8f5dd', fg: '#0d5b1f', label: label || 'Payé' },
    sent:       { bg: '#d8e6ff', fg: '#1a3d80', label: label || 'Envoyé' },
    overdue:    { bg: '#ffd8d8', fg: '#7a1a1a', label: label || 'En retard' },
    quote:      { bg: P.cream, fg: P.ink, label: label || 'Devis' },
    refused:    { bg: '#eee', fg: '#666', label: label || 'Refusé' },
    free:       { bg: P.lime, fg: P.ink, label: label || 'Disponible' },
    busy:       { bg: P.ink, fg: P.bg, label: label || 'Occupé' },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: sm ? '3px 9px' : '5px 12px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontFamily: 'JetBrains Mono', fontSize: sm ? 9.5 : 10.5, letterSpacing: '0.12em',
      textTransform: 'uppercase', fontWeight: 600,
    }}>
      <span style={{ width: sm ? 5 : 6, height: sm ? 5 : 6, borderRadius: '50%', background: 'currentColor' }}></span>
      {s.label}
    </span>
  );
}

function StudioPill({ P, name, sm = false }) {
  const c = studioColor(name);
  const dark = name === 'LA TABLE';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: sm ? '3px 9px' : '5px 12px', borderRadius: 999,
      background: c, color: dark ? P.bg : P.ink,
      fontFamily: P.display, fontSize: sm ? 11 : 12, fontWeight: 600,
    }}>{name}</span>
  );
}

function PageHeader({ P, eyebrow, title, hand, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, gap: 24, flexWrap: 'wrap' }}>
      <div style={{ minWidth: 0, flex: '1 1 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.18em', color: P.inkSoft, textTransform: 'uppercase', marginBottom: 8 }}>
          {eyebrow}
        </div>
        <h1 style={{
          fontFamily: P.display, fontSize: 'clamp(36px, 4.2vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em',
          margin: 0, lineHeight: 1.02, display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.3em',
        }}>
          <span style={{ whiteSpace: 'nowrap' }}>{title}</span>
          {hand && <span style={{ fontFamily: P.hand, color: P.lime, fontWeight: 700, transform: 'rotate(-2deg)', display: 'inline-block', whiteSpace: 'nowrap', fontSize: '1.05em', lineHeight: 0.9 }}>{hand}</span>}
        </h1>
      </div>
      {children && <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>}
    </div>
  );
}

Object.assign(window, {
  AdminLogin, AdminShell, Card, StatusPill, StudioPill, PageHeader, Field,
});
