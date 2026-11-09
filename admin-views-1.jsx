// Vues 1 : Home + Requests (liste + détail)

function AdminHome({ P, goto }) {
  const today = new Date(2026, 4, 2);
  return (
    <div>
      <PageHeader P={P} eyebrow="¶ Tableau de bord — vendredi 2 mai 2026" title="Bonjour Marc," hand="ça shoote ?">
        <button onClick={() => goto('requests')} style={{
          padding: '12px 22px', background: P.ink, color: P.bg, border: 'none',
          borderRadius: 999, fontFamily: P.display, fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>Voir les 7 demandes →</button>
      </PageHeader>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <KpiCard P={P} eyebrow="CA mai" value={fmtEur(ADMIN_KPIS.ca_mois)} delta={`+${ADMIN_KPIS.ca_mois_evol} %`} note="vs avril" />
        <KpiCard P={P} eyebrow="Réservations" value={ADMIN_KPIS.reservations_mois} delta={`+${ADMIN_KPIS.reservations_evol}`} note="ce mois" />
        <KpiCard P={P} eyebrow="Taux d'occupation" value={`${ADMIN_KPIS.taux_occupation} %`} delta={`+${ADMIN_KPIS.taux_evol} pts`} note="3 plateaux" />
        <KpiCard P={P} eyebrow="Demandes" value={ADMIN_KPIS.demandes_pending} delta="à traiter" highlight />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
        {/* Demandes du jour */}
        <Card P={P} pad={28}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
            <h3 style={{ fontFamily: P.display, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
              <span style={{ fontFamily: P.hand, color: P.lime, fontWeight: 700, marginRight: 8 }}>Aujourd'hui —</span>
              demandes en attente
            </h3>
            <a onClick={() => goto('requests')} style={{ fontFamily: P.serif, fontSize: 13, color: P.inkSoft, cursor: 'pointer', textDecoration: 'underline' }}>Tout voir</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ADMIN_REQUESTS.slice(0, 4).map((r, i) => (
              <button key={r.id} onClick={() => goto('request')} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr auto auto auto', gap: 14, alignItems: 'center',
                padding: '14px 4px', borderTop: i === 0 ? 'none' : `1px solid ${P.ink}10`,
                background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: P.cream,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: P.display, fontWeight: 700, fontSize: 13, color: P.ink,
                }}>{r.client.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
                <div>
                  <div style={{ fontFamily: P.display, fontSize: 15, fontWeight: 600 }}>{r.client} <span style={{ color: P.inkSoft, fontWeight: 400 }}>· {r.company}</span></div>
                  <div style={{ fontFamily: P.mono, fontSize: 10.5, color: P.inkSoft, letterSpacing: '0.1em', marginTop: 2 }}>{r.id} · {relTime(r.created)}</div>
                </div>
                <StudioPill P={P} name={r.studio} sm />
                <span style={{ fontFamily: P.mono, fontSize: 12, color: P.inkSoft }}>{fmtDateFR2(r.date)}</span>
                <span style={{ fontFamily: P.display, fontSize: 16, fontWeight: 700 }}>{fmtEur(r.total)}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Activité + occupation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card P={P} dark pad={24}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', opacity: 0.55, marginBottom: 14 }}>OCCUPATION CETTE SEMAINE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { name: 'LE BLANC', pct: 86 },
                { name: 'LA TABLE', pct: 71 },
                { name: 'LA CUISINE', pct: 78 },
              ].map(s => (
                <div key={s.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: P.display, fontSize: 14, marginBottom: 6 }}>
                    <span>{s.name}</span>
                    <span style={{ fontFamily: P.mono, opacity: 0.7 }}>{s.pct} %</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${s.pct}%`, height: '100%', background: P.lime, borderRadius: 3 }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card P={P} pad={24}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 14 }}>ACTIVITÉ RÉCENTE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: P.serif, fontSize: 14 }}>
              {[
                { who: 'Pierre Hermé', what: 'a réglé la facture 2026-0140', when: 'il y a 18 min', type: 'paid' },
                { who: 'Bonne Maman', what: 'a confirmé le tournage du 6 mai', when: 'il y a 1 h', type: 'confirmed' },
                { who: 'Maison Bonnefoy', what: 'a envoyé une demande', when: 'il y a 3 h', type: 'pending' },
                { who: 'Veuve Clicquot', what: 'a relancé pour la facture 2026-0139', when: 'il y a 5 h', type: 'overdue' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.type === 'paid' ? '#0d5b1f' : a.type === 'overdue' ? '#7a1a1a' : a.type === 'confirmed' ? P.lime : '#7a5500', marginTop: 7, flexShrink: 0 }}></div>
                  <div style={{ flex: 1 }}>
                    <strong>{a.who}</strong> <span style={{ color: P.inkSoft }}>{a.what}</span>
                    <div style={{ fontFamily: P.mono, fontSize: 10.5, color: P.inkSoft, opacity: 0.7, letterSpacing: '0.08em', marginTop: 2 }}>{a.when}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Aujourd'hui sur les plateaux */}
      <div style={{ marginTop: 28 }}>
        <h3 style={{ fontFamily: P.display, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 16px' }}>
          <span style={{ fontFamily: P.hand, color: P.lime, fontWeight: 700, marginRight: 8 }}>Sur les plateaux —</span>
          aujourd'hui
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <PlateauCard P={P} name="LE BLANC" client="Pierre Hermé" desc="Collection automne — Catalogue" status="busy" goto={goto} />
          <PlateauCard P={P} name="LA TABLE" client={null} desc="Disponible — peut être réservé" status="free" goto={goto} />
          <PlateauCard P={P} name="LA CUISINE" client="Bonne Maman" desc="Spot 30s — équipe 12 pers." status="busy" goto={goto} />
        </div>
      </div>
    </div>
  );
}

function KpiCard({ P, eyebrow, value, delta, note, highlight }) {
  return (
    <Card P={P} pad={22} style={highlight ? { background: P.lime, border: 'none' } : {}}>
      <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: highlight ? P.ink : P.inkSoft, marginBottom: 10 }}>{eyebrow}</div>
      <div style={{ fontFamily: P.display, fontSize: 38, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1, marginBottom: 8 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontFamily: P.serif, fontSize: 13 }}>
        <span style={{ color: highlight ? P.ink : (delta && delta.startsWith('+') ? '#0d5b1f' : P.inkSoft), fontWeight: 600 }}>{delta}</span>
        {note && <span style={{ color: P.inkSoft }}>{note}</span>}
      </div>
    </Card>
  );
}

function PlateauCard({ P, name, client, desc, status, goto }) {
  const c = studioColor(name);
  const dark = name === 'LA TABLE';
  return (
    <button onClick={() => goto(client ? 'booking' : 'planning')} style={{
      background: c, color: dark ? P.bg : P.ink, border: 'none',
      borderRadius: 20, padding: 22, textAlign: 'left', cursor: 'pointer',
      position: 'relative', minHeight: 160,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontFamily: P.display, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{name}</div>
        <StatusPill P={P} status={status} sm />
      </div>
      <div style={{ marginTop: 24, fontFamily: P.display, fontSize: 18, fontWeight: 600 }}>
        {client || <span style={{ opacity: 0.6 }}>—</span>}
      </div>
      <div style={{ fontFamily: P.serif, fontSize: 14, opacity: 0.75, marginTop: 4 }}>{desc}</div>
    </button>
  );
}

// ─── REQUESTS LIST ──────────────────────────────────────────────
function AdminRequests({ P, goto }) {
  const [filter, setFilter] = React.useState('all');
  return (
    <div>
      <PageHeader P={P} eyebrow="¶ 7 demandes en attente" title="Demandes" hand="à traiter">
        <button style={{ padding: '10px 18px', background: 'transparent', color: P.ink, border: `1.5px solid ${P.ink}`, borderRadius: 999, fontFamily: P.display, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Exporter CSV</button>
      </PageHeader>

      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        {[
          { id: 'all', label: 'Toutes', count: 7 },
          { id: 'today', label: "Aujourd'hui", count: 2 },
          { id: 'week', label: 'Cette semaine', count: 5 },
          { id: 'urgent', label: 'Urgent', count: 1 },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: '8px 16px', borderRadius: 999,
            background: filter === f.id ? P.ink : 'transparent',
            color: filter === f.id ? P.bg : P.ink,
            border: `1.5px solid ${filter === f.id ? P.ink : P.ink + '20'}`,
            fontFamily: P.display, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            {f.label} <span style={{ opacity: 0.5, marginLeft: 4 }}>{f.count}</span>
          </button>
        ))}
      </div>

      <Card P={P} pad={0}>
        <div style={{
          display: 'grid', gridTemplateColumns: '120px 1fr 130px 110px 130px 110px 100px',
          gap: 16, padding: '14px 24px', borderBottom: `1px solid ${P.ink}10`,
          fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, textTransform: 'uppercase',
        }}>
          <span>RÉF</span><span>CLIENT</span><span>PLATEAU</span><span>DATE</span><span>CRÉNEAU</span><span style={{ textAlign: 'right' }}>TOTAL</span><span></span>
        </div>
        {ADMIN_REQUESTS.map((r, i) => (
          <div key={r.id} onClick={() => goto('request')} style={{
            display: 'grid', gridTemplateColumns: '120px 1fr 130px 110px 130px 110px 100px',
            gap: 16, padding: '18px 24px', borderBottom: i < ADMIN_REQUESTS.length - 1 ? `1px solid ${P.ink}08` : 'none',
            alignItems: 'center', cursor: 'pointer',
          }}>
            <span style={{ fontFamily: P.mono, fontSize: 12, color: P.inkSoft }}>{r.id}</span>
            <div>
              <div style={{ fontFamily: P.display, fontSize: 15, fontWeight: 600 }}>{r.client}</div>
              <div style={{ fontFamily: P.serif, fontSize: 13, color: P.inkSoft }}>{r.company}</div>
            </div>
            <StudioPill P={P} name={r.studio} sm />
            <span style={{ fontFamily: P.serif, fontSize: 14 }}>{fmtDateFR2(r.date)}</span>
            <span style={{ fontFamily: P.serif, fontSize: 13, color: P.inkSoft }}>{r.slot}</span>
            <span style={{ fontFamily: P.display, fontSize: 16, fontWeight: 700, textAlign: 'right' }}>{fmtEur(r.total)}</span>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
              <button style={miniBtn(P, true)} title="Accepter">✓</button>
              <button style={miniBtn(P, false)} title="Refuser">✕</button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function miniBtn(P, primary) {
  return {
    width: 30, height: 30, borderRadius: '50%',
    background: primary ? P.lime : 'transparent',
    color: P.ink, border: primary ? 'none' : `1.5px solid ${P.ink}30`,
    cursor: 'pointer', fontSize: 13, fontWeight: 700,
  };
}

// ─── REQUEST DETAIL ─────────────────────────────────────────────
function AdminRequestDetail({ P, goto }) {
  const r = ADMIN_REQUESTS[0]; // Marie Dupont
  return (
    <div>
      <button onClick={() => goto('requests')} style={{
        background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: P.serif, fontSize: 14, color: P.inkSoft, marginBottom: 12, padding: 0,
      }}>← Toutes les demandes</button>

      <PageHeader P={P} eyebrow={`¶ ${r.id} — reçue ${relTime(r.created)}`} title={r.client} hand={`(${r.company})`}>
        <button style={{ padding: '12px 22px', background: 'transparent', color: P.ink, border: `1.5px solid ${P.ink}`, borderRadius: 999, fontFamily: P.display, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Refuser</button>
        <button style={{ padding: '12px 24px', background: P.lime, color: P.ink, border: 'none', borderRadius: 999, fontFamily: P.display, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>✓ Accepter et envoyer le devis</button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card P={P} pad={28}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 14 }}>BRIEF DU CLIENT</div>
            <p style={{ fontFamily: P.serif, fontSize: 18, lineHeight: 1.6, margin: '0 0 18px', color: P.ink, fontStyle: 'italic' }}>« {r.brief} »</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 18, marginTop: 18, paddingTop: 18, borderTop: `1px solid ${P.ink}10` }}>
              <DetailField P={P} label="Plateau"><StudioPill P={P} name={r.studio} sm /></DetailField>
              <DetailField P={P} label="Date">{fmtDateLong(r.date)}</DetailField>
              <DetailField P={P} label="Créneau">{r.slot}</DetailField>
              <DetailField P={P} label="Demande">{relTime(r.created)}</DetailField>
            </div>
          </Card>

          <Card P={P} pad={28}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 14 }}>OPTIONS DEMANDÉES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { l: 'Plateau LE BLANC — Journée 9h–19h', p: 1800 },
                { l: 'Styliste culinaire', p: 580 },
                { l: 'Lunch équipe × 5', p: 140 },
                { l: 'Parking privé', p: 90 },
              ].map((it, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: i > 0 ? `1px dashed ${P.ink}15` : 'none', fontFamily: P.serif, fontSize: 15 }}>
                  <span>{it.l}</span>
                  <span style={{ fontFamily: P.mono }}>{fmtEur(it.p)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', borderTop: `2px solid ${P.ink}`, marginTop: 6, fontFamily: P.display, fontSize: 18, fontWeight: 700 }}>
                <span>Total TTC</span>
                <span>{fmtEur(r.total)}</span>
              </div>
            </div>
          </Card>

          <Card P={P} pad={28}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 14 }}>DISPONIBILITÉ — JEUDI 14 MAI</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { name: 'LE BLANC', state: 'requested' },
                { name: 'LA TABLE', state: 'free' },
                { name: 'LA CUISINE', state: 'busy' },
              ].map(s => (
                <div key={s.name} style={{
                  flex: 1, padding: 14, borderRadius: 14,
                  background: s.state === 'requested' ? P.lime : (s.state === 'free' ? P.cream : P.ink),
                  color: s.state === 'busy' ? P.bg : P.ink,
                }}>
                  <div style={{ fontFamily: P.display, fontSize: 14, fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.14em', opacity: 0.7, marginTop: 4 }}>
                    {s.state === 'requested' ? 'DEMANDÉ' : s.state === 'free' ? 'LIBRE' : 'OCCUPÉ'}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 100, alignSelf: 'start' }}>
          <Card P={P} dark pad={26}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', opacity: 0.55, marginBottom: 14 }}>CONTACT</div>
            <div style={{ fontFamily: P.display, fontSize: 22, fontWeight: 700 }}>{r.client}</div>
            <div style={{ fontFamily: P.serif, fontSize: 14, opacity: 0.75, marginBottom: 18 }}>{r.company}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: P.mono, fontSize: 12 }}>
              <a style={{ color: P.bg, textDecoration: 'none', opacity: 0.85 }}>✉ {r.email}</a>
              <a style={{ color: P.bg, textDecoration: 'none', opacity: 0.85 }}>☏ {r.phone}</a>
            </div>
            <button onClick={() => goto('client')} style={{
              marginTop: 18, width: '100%', padding: '12px', background: 'rgba(255,255,255,0.08)',
              color: P.bg, border: 'none', borderRadius: 10, fontFamily: P.display, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>Voir la fiche client →</button>
          </Card>

          <Card P={P} pad={24}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 12 }}>NOTE INTERNE</div>
            <textarea placeholder="Ajouter une note pour l'équipe…" rows={4} style={{
              width: '100%', border: `1px solid ${P.ink}20`, borderRadius: 10, padding: 12,
              fontFamily: P.serif, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box',
            }} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailField({ P, label, children }) {
  return (
    <div>
      <div style={{ fontFamily: P.mono, fontSize: 9, letterSpacing: '0.16em', color: P.inkSoft, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: P.display, fontSize: 14, fontWeight: 600 }}>{children}</div>
    </div>
  );
}

Object.assign(window, { AdminHome, AdminRequests, AdminRequestDetail });
