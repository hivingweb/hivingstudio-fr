// Vues 2 : Planning + Booking detail + Runsheet

function AdminPlanning({ P, goto }) {
  const [view, setView] = React.useState('week');
  const days = ['LUN 04', 'MAR 05', 'MER 06', 'JEU 07', 'VEN 08', 'SAM 09', 'DIM 10'];
  const studios = ['LE BLANC', 'LA TABLE', 'LA CUISINE'];
  // grid des slots (booked)
  const slots = [
    // [studioIdx, dayIdx, slot ('day'|'am'|'pm'|'night'), client, status]
    [0, 0, 'day',   'Pierre Hermé',     'confirmed'],
    [0, 1, 'am',    'Maison Ladurée',   'paid'],
    [0, 3, 'day',   'Marie Dupont',     'pending'],
    [1, 1, 'day',   'Veuve Clicquot',   'confirmed'],
    [1, 4, 'pm',    'Léa Sanchis',      'pending'],
    [2, 0, 'day',   'Bonne Maman',      'paid'],
    [2, 2, 'night', 'Bonne Maman',      'confirmed'],
    [2, 5, 'day',   'Hugo Bernier',     'pending'],
  ];

  return (
    <div>
      <PageHeader P={P} eyebrow="¶ Semaine du 4 au 10 mai 2026" title="Planning" hand="3 plateaux">
        <div style={{ display: 'flex', gap: 4, padding: 4, background: P.cream, borderRadius: 999 }}>
          {['week', 'month'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '8px 18px', borderRadius: 999, border: 'none',
              background: view === v ? P.ink : 'transparent',
              color: view === v ? P.bg : P.ink,
              fontFamily: P.display, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>{v === 'week' ? 'Semaine' : 'Mois'}</button>
          ))}
        </div>
        <button style={{ padding: '12px 22px', background: P.lime, color: P.ink, border: 'none', borderRadius: 999, fontFamily: P.display, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>+ Bloquer un créneau</button>
      </PageHeader>

      <Card P={P} pad={0} style={{ overflow: 'hidden' }}>
        {/* Header days */}
        <div style={{
          display: 'grid', gridTemplateColumns: '160px repeat(7, 1fr)',
          borderBottom: `1px solid ${P.ink}15`,
        }}>
          <div style={{ padding: '14px 18px', fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft }}>PLATEAU / SEMAINE</div>
          {days.map((d, i) => (
            <div key={i} style={{
              padding: '14px 12px', textAlign: 'center', borderLeft: `1px solid ${P.ink}10`,
              fontFamily: P.mono, fontSize: 11, letterSpacing: '0.14em', color: i === 0 ? P.ink : P.inkSoft,
              background: i === 0 ? P.cream : 'transparent', fontWeight: i === 0 ? 700 : 400,
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Rows */}
        {studios.map((s, si) => {
          const c = studioColor(s);
          const dark = s === 'LA TABLE';
          return (
            <div key={s} style={{ display: 'grid', gridTemplateColumns: '160px repeat(7, 1fr)', borderBottom: si < 2 ? `1px solid ${P.ink}10` : 'none', minHeight: 110 }}>
              <div style={{ padding: 16, background: c, color: dark ? P.bg : P.ink, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontFamily: P.display, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>{s}</div>
                <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.12em', opacity: 0.7, marginTop: 2 }}>0{si + 1}</div>
              </div>
              {days.map((_, di) => {
                const slot = slots.find(sl => sl[0] === si && sl[1] === di);
                return (
                  <div key={di} style={{ borderLeft: `1px solid ${P.ink}08`, padding: 8, position: 'relative', background: di === 0 ? P.bg : 'transparent' }}>
                    {slot && (
                      <button onClick={() => goto('booking')} style={{
                        background: slot[4] === 'pending' ? '#fff3d6' : slot[4] === 'paid' ? P.lime : P.ink,
                        color: slot[4] === 'pending' ? P.ink : (slot[4] === 'paid' ? P.ink : P.bg),
                        border: 'none', borderRadius: 8, padding: '8px 10px',
                        width: '100%', height: '100%', textAlign: 'left', cursor: 'pointer',
                        fontFamily: P.display, fontSize: 12,
                      }}>
                        <div style={{ fontWeight: 700, marginBottom: 3 }}>{slot[3]}</div>
                        <div style={{ fontFamily: P.mono, fontSize: 9, letterSpacing: '0.12em', opacity: 0.75, textTransform: 'uppercase' }}>
                          {slot[2] === 'day' ? '9h–19h' : slot[2] === 'am' ? '8h–13h' : slot[2] === 'pm' ? '14h–19h' : '19h–9h'}
                        </div>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </Card>

      <div style={{ marginTop: 16, display: 'flex', gap: 18, fontFamily: P.mono, fontSize: 10, letterSpacing: '0.14em', color: P.inkSoft, textTransform: 'uppercase', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ width: 14, height: 14, background: '#fff3d6', borderRadius: 4 }}></span> En attente</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ width: 14, height: 14, background: P.ink, borderRadius: 4 }}></span> Confirmé</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ width: 14, height: 14, background: P.lime, borderRadius: 4 }}></span> Payé</span>
      </div>
    </div>
  );
}

// ─── BOOKING DETAIL (confirmé) ──────────────────────────────────
function AdminBookingDetail({ P, goto }) {
  const b = ADMIN_BOOKINGS_CONFIRMED[0]; // Pierre Hermé
  return (
    <div>
      <button onClick={() => goto('planning')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: P.serif, fontSize: 14, color: P.inkSoft, marginBottom: 12, padding: 0 }}>← Planning</button>

      <PageHeader P={P} eyebrow={`¶ ${b.id} — Réservation confirmée`} title={b.client} hand="lundi 4 mai">
        <button onClick={() => goto('runsheet')} style={{ padding: '12px 22px', background: 'transparent', color: P.ink, border: `1.5px solid ${P.ink}`, borderRadius: 999, fontFamily: P.display, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Voir la run sheet</button>
        <button style={{ padding: '12px 22px', background: P.lime, color: P.ink, border: 'none', borderRadius: 999, fontFamily: P.display, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Envoyer rappel J−1</button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card P={P} pad={28}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 18 }}>
              <DetailField P={P} label="Plateau"><StudioPill P={P} name={b.studio} sm /></DetailField>
              <DetailField P={P} label="Date">{fmtDateLong(b.date)}</DetailField>
              <DetailField P={P} label="Créneau">{b.slot}</DetailField>
              <DetailField P={P} label="Statut"><StatusPill P={P} status={b.status} sm /></DetailField>
            </div>
          </Card>

          <Card P={P} pad={28}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 14 }}>ÉQUIPE AFFECTÉE</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {ADMIN_TEAM.slice(0, 3).map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, background: P.cream }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: t.color, color: P.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: P.display, fontWeight: 700, fontSize: 13 }}>
                    {t.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <div>
                    <div style={{ fontFamily: P.display, fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.1em', color: P.inkSoft }}>{t.role.toUpperCase()}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card P={P} pad={28}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 14 }}>FACTURATION</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: P.cream, borderRadius: 12, marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: P.display, fontSize: 15, fontWeight: 700 }}>Acompte 30 %</div>
                <div style={{ fontFamily: P.mono, fontSize: 10.5, color: P.inkSoft, letterSpacing: '0.1em' }}>RÉGLÉ LE 28 AVR · STRIPE</div>
              </div>
              <div style={{ fontFamily: P.display, fontSize: 22, fontWeight: 700 }}>{fmtEur(b.paid)}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: P.bg, border: `1.5px dashed ${P.ink}30`, borderRadius: 12 }}>
              <div>
                <div style={{ fontFamily: P.display, fontSize: 15, fontWeight: 700 }}>Solde</div>
                <div style={{ fontFamily: P.mono, fontSize: 10.5, color: P.inkSoft, letterSpacing: '0.1em' }}>À FACTURER LE 4 MAI</div>
              </div>
              <div style={{ fontFamily: P.display, fontSize: 22, fontWeight: 700, color: P.inkSoft }}>{fmtEur(b.total - b.paid)}</div>
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 100, alignSelf: 'start' }}>
          <Card P={P} dark pad={26}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', opacity: 0.55, marginBottom: 12 }}>TIMELINE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { d: '28 avr.', e: 'Demande reçue', done: true },
                { d: '28 avr.', e: 'Devis envoyé', done: true },
                { d: '28 avr.', e: 'Acompte réglé', done: true },
                { d: '3 mai',   e: 'Brief technique', done: false },
                { d: '4 mai',   e: 'Tournage', done: false, hl: true },
                { d: '5 mai',   e: 'Solde + livraison', done: false },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: s.hl ? P.lime : (s.done ? P.bg : 'transparent'),
                    border: s.done ? 'none' : `1.5px solid rgba(255,255,255,0.4)`,
                    marginTop: 4, flexShrink: 0,
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: P.display, fontSize: 13, fontWeight: 600, opacity: s.done ? 0.6 : 1 }}>{s.e}</div>
                    <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.12em', opacity: 0.5 }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card P={P} pad={22}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 10 }}>DOCUMENTS</div>
            {['Devis 2026-0140.pdf', 'Facture acompte.pdf', 'Brief technique.pdf'].map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: i > 0 ? `1px dashed ${P.ink}15` : 'none', fontFamily: P.serif, fontSize: 13 }}>
                <span>{d}</span>
                <a style={{ color: P.inkSoft, cursor: 'pointer' }}>↓</a>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── RUN SHEET ──────────────────────────────────────────────────
function AdminRunsheet({ P, goto }) {
  const schedule = [
    { t: '07:00', e: 'Accueil équipe — café & croissants', who: 'Marc B.' },
    { t: '07:30', e: 'Déballage matériel + briefing', who: 'Hugo L. · Théo M.' },
    { t: '08:30', e: 'Setup lumière + cyclo', who: 'Hugo L.' },
    { t: '09:00', e: 'Arrivée client', who: '—' },
    { t: '09:30', e: 'Plat 1 — Macarons pistache', who: 'Camille R. · Inès D.', hl: true },
    { t: '11:30', e: 'Plat 2 — Tarte chocolat', who: 'Camille R.' },
    { t: '13:00', e: 'Lunch équipe (5 pers.)', who: 'Traiteur' },
    { t: '14:00', e: 'Plat 3 — Éclair vanille', who: 'Camille R. · Inès D.' },
    { t: '16:00', e: 'Packshots produits', who: 'Hugo L.' },
    { t: '18:00', e: 'Wrap + rangement', who: 'Théo M.' },
    { t: '19:00', e: 'Au revoir client', who: 'Marc B.' },
  ];
  return (
    <div>
      <button onClick={() => goto('booking')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: P.serif, fontSize: 14, color: P.inkSoft, marginBottom: 12, padding: 0 }}>← Réservation</button>

      <PageHeader P={P} eyebrow="¶ Run sheet — lundi 4 mai 2026" title="Pierre Hermé" hand="LE BLANC">
        <button style={{ padding: '12px 22px', background: 'transparent', color: P.ink, border: `1.5px solid ${P.ink}`, borderRadius: 999, fontFamily: P.display, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Imprimer</button>
        <button style={{ padding: '12px 22px', background: P.ink, color: P.bg, border: 'none', borderRadius: 999, fontFamily: P.display, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Envoyer à l'équipe</button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <Card P={P} pad={32}>
          <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 18 }}>DÉROULÉ DE LA JOURNÉE — 12 H</div>
          <div style={{ position: 'relative' }}>
            {/* Timeline line */}
            <div style={{ position: 'absolute', left: 70, top: 12, bottom: 12, width: 2, background: P.ink, opacity: 0.1 }}></div>
            {schedule.map((s, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 32px 1fr', gap: 18, alignItems: 'flex-start', padding: '10px 0', position: 'relative' }}>
                <div style={{ fontFamily: P.mono, fontSize: 13, fontWeight: 600, color: P.ink, paddingTop: 2 }}>{s.t}</div>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: s.hl ? P.lime : P.bg, border: `2px solid ${s.hl ? P.lime : P.ink}`,
                  marginTop: 5, position: 'relative', zIndex: 1,
                }}></div>
                <div style={{ paddingBottom: 8 }}>
                  <div style={{ fontFamily: P.display, fontSize: s.hl ? 18 : 16, fontWeight: s.hl ? 700 : 600, lineHeight: 1.2 }}>{s.e}</div>
                  <div style={{ fontFamily: P.serif, fontSize: 13, color: P.inkSoft, fontStyle: 'italic', marginTop: 2 }}>{s.who}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card P={P} dark pad={22}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', opacity: 0.55, marginBottom: 12 }}>ÉQUIPE PRÉSENTE</div>
            {ADMIN_TEAM.slice(0, 5).map(t => (
              <div key={t.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderTop: t.id !== 't-001' ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: t.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: P.display, fontWeight: 700, fontSize: 11, color: P.bg }}>
                  {t.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: P.display, fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontFamily: P.mono, fontSize: 9, letterSpacing: '0.1em', opacity: 0.55 }}>{t.role.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card P={P} pad={22}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 10 }}>MATÉRIEL RÉSERVÉ</div>
            {[
              'Profoto B10X × 4', 'Boîte à lumière 1×1 × 2', 'Canon R5 × 2', 'Canon RF 100mm Macro', 'Cyclo blanc 8m', 'Table 4×2m'
            ].map((m, i) => (
              <div key={i} style={{ padding: '7px 0', borderTop: i > 0 ? `1px dashed ${P.ink}15` : 'none', fontFamily: P.serif, fontSize: 13 }}>{m}</div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminPlanning, AdminBookingDetail, AdminRunsheet });
