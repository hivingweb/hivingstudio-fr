// Vues 3 : Clients + Client detail + Invoices + Settings

function AdminClients({ P, goto }) {
  return (
    <div>
      <PageHeader P={P} eyebrow="¶ 142 clients · 87 actifs" title="Clients" hand="& comptes">
        <button style={{ padding: '12px 22px', background: P.ink, color: P.bg, border: 'none', borderRadius: 999, fontFamily: P.display, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Nouveau client</button>
      </PageHeader>

      <Card P={P} pad={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 100px 120px 120px 110px', gap: 16, padding: '14px 24px', borderBottom: `1px solid ${P.ink}10`, fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, textTransform: 'uppercase' }}>
          <span>CLIENT</span><span>CONTACT</span><span style={{ textAlign: 'right' }}>TOURNAGES</span><span style={{ textAlign: 'right' }}>CA TOTAL</span><span>DERNIER</span><span>TAGS</span>
        </div>
        {ADMIN_CLIENTS.map((c, i) => (
          <div key={c.id} onClick={() => goto('client')} style={{
            display: 'grid', gridTemplateColumns: '1fr 1.2fr 100px 120px 120px 110px', gap: 16,
            padding: '18px 24px', borderBottom: i < ADMIN_CLIENTS.length - 1 ? `1px solid ${P.ink}08` : 'none',
            alignItems: 'center', cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, background: P.cream,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: P.display, fontSize: 12, fontWeight: 700,
              }}>{c.name.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
              <div style={{ fontFamily: P.display, fontSize: 15, fontWeight: 600 }}>{c.name}</div>
            </div>
            <div>
              <div style={{ fontFamily: P.serif, fontSize: 14 }}>{c.contact}</div>
              <div style={{ fontFamily: P.mono, fontSize: 11, color: P.inkSoft }}>{c.email}</div>
            </div>
            <span style={{ fontFamily: P.display, fontSize: 16, fontWeight: 600, textAlign: 'right' }}>{c.shoots}</span>
            <span style={{ fontFamily: P.display, fontSize: 16, fontWeight: 700, textAlign: 'right' }}>{fmtEur(c.ca)}</span>
            <span style={{ fontFamily: P.serif, fontSize: 13, color: P.inkSoft }}>{fmtDateFR2(c.last)}</span>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {c.tags.map(t => (
                <span key={t} style={{
                  padding: '3px 8px', background: t === 'VIP' ? P.lime : P.cream, color: P.ink,
                  borderRadius: 999, fontFamily: P.mono, fontSize: 9.5, letterSpacing: '0.12em', fontWeight: 600,
                }}>{t.toUpperCase()}</span>
              ))}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function AdminClient({ P, goto }) {
  const c = ADMIN_CLIENTS[0]; // Maison Ladurée
  return (
    <div>
      <button onClick={() => goto('clients')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: P.serif, fontSize: 14, color: P.inkSoft, marginBottom: 12, padding: 0 }}>← Tous les clients</button>

      <PageHeader P={P} eyebrow="¶ Client VIP — depuis 2021" title={c.name} hand="VIP">
        <button style={{ padding: '12px 22px', background: 'transparent', color: P.ink, border: `1.5px solid ${P.ink}`, borderRadius: 999, fontFamily: P.display, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Envoyer un message</button>
        <button style={{ padding: '12px 22px', background: P.lime, color: P.ink, border: 'none', borderRadius: 999, fontFamily: P.display, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>+ Nouveau devis</button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <KpiCard P={P} eyebrow="Tournages" value={c.shoots} delta="depuis 2021" />
            <KpiCard P={P} eyebrow="CA total" value={fmtEur(c.ca)} delta="+12 % cette année" />
            <KpiCard P={P} eyebrow="Plateau préféré" value="LE BLANC" delta="9 / 12 tournages" />
          </div>

          <Card P={P} pad={28}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft }}>HISTORIQUE TOURNAGES</div>
              <a style={{ fontFamily: P.serif, fontSize: 13, color: P.inkSoft, cursor: 'pointer', textDecoration: 'underline' }}>Tout voir</a>
            </div>
            {[
              { d: '2026-04-22', s: 'LE BLANC', p: 'Macarons collection printemps', a: 3580 },
              { d: '2026-03-08', s: 'LA CUISINE', p: 'Religieuses — pack vidéo', a: 4220 },
              { d: '2026-02-14', s: 'LE BLANC', p: 'Saint-Valentin packshots', a: 2840 },
              { d: '2025-12-03', s: 'LE BLANC', p: 'Bûches de Noël', a: 3120 },
            ].map((s, i) => (
              <div key={i} onClick={() => goto('booking')} style={{ display: 'grid', gridTemplateColumns: '110px 130px 1fr 100px', gap: 16, padding: '14px 0', borderTop: i > 0 ? `1px solid ${P.ink}08` : 'none', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontFamily: P.mono, fontSize: 12, color: P.inkSoft }}>{fmtDateFR2(s.d)}</span>
                <StudioPill P={P} name={s.s} sm />
                <span style={{ fontFamily: P.serif, fontSize: 14 }}>{s.p}</span>
                <span style={{ fontFamily: P.display, fontSize: 15, fontWeight: 700, textAlign: 'right' }}>{fmtEur(s.a)}</span>
              </div>
            ))}
          </Card>

          <Card P={P} pad={28}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 14 }}>NOTES INTERNES</div>
            <div style={{
              padding: 16, background: P.cream, borderRadius: 12,
              borderLeft: `4px solid ${P.lime}`,
              fontFamily: P.serif, fontSize: 14, lineHeight: 1.6, fontStyle: 'italic', color: P.inkSoft,
            }}>
              « Client très exigeant sur la lumière. Toujours prévoir Hugo en dir. photo. Aime un café double avec lait d'avoine à l'arrivée. Camille connaît leur styliste maison. »
              <div style={{ fontFamily: P.mono, fontSize: 10, color: P.inkSoft, marginTop: 12, fontStyle: 'normal', letterSpacing: '0.1em' }}>— MARC B. · 14 MARS 2026</div>
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card P={P} dark pad={26}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', opacity: 0.55, marginBottom: 12 }}>CONTACT PRINCIPAL</div>
            <div style={{ fontFamily: P.display, fontSize: 22, fontWeight: 700 }}>{c.contact}</div>
            <div style={{ fontFamily: P.serif, fontSize: 13, opacity: 0.7, marginBottom: 18 }}>Directrice de production</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: P.mono, fontSize: 12, opacity: 0.85 }}>
              <span>✉ {c.email}</span>
              <span>☏ {c.phone}</span>
              <span>📍 21 rue Bonaparte, Paris VI</span>
            </div>
          </Card>

          <Card P={P} pad={22}>
            <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 12 }}>FACTURATION</div>
            <DetailField P={P} label="Conditions">Net 14 jours</DetailField>
            <div style={{ height: 12 }}></div>
            <DetailField P={P} label="TVA">FR 41 542 097 902</DetailField>
            <div style={{ height: 12 }}></div>
            <DetailField P={P} label="Mode de paiement">Virement / Stripe</DetailField>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── INVOICES ───────────────────────────────────────────────────
function AdminInvoices({ P, goto }) {
  const [tab, setTab] = React.useState('all');
  return (
    <div>
      <PageHeader P={P} eyebrow="¶ Avril–Mai 2026" title="Devis & factures" hand="finance">
        <button style={{ padding: '12px 22px', background: P.ink, color: P.bg, border: 'none', borderRadius: 999, fontFamily: P.display, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Nouveau devis</button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <KpiCard P={P} eyebrow="Encaissé mai" value={fmtEur(13420)} delta="+22 %" note="vs avril" />
        <KpiCard P={P} eyebrow="En attente" value={fmtEur(8760)} delta="3 factures" />
        <KpiCard P={P} eyebrow="En retard" value={fmtEur(2820)} delta="1 facture" highlight />
        <KpiCard P={P} eyebrow="Devis ouverts" value={fmtEur(7540)} delta="2 actifs" />
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {[
          { id: 'all', label: 'Tous' },
          { id: 'paid', label: 'Payées' },
          { id: 'sent', label: 'Envoyées' },
          { id: 'overdue', label: 'En retard' },
          { id: 'quote', label: 'Devis' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 16px', borderRadius: 999,
            background: tab === t.id ? P.ink : 'transparent',
            color: tab === t.id ? P.bg : P.ink,
            border: `1.5px solid ${tab === t.id ? P.ink : P.ink + '20'}`,
            fontFamily: P.display, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>{t.label}</button>
        ))}
      </div>

      <Card P={P} pad={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 110px 130px 130px 110px', gap: 16, padding: '14px 24px', borderBottom: `1px solid ${P.ink}10`, fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, textTransform: 'uppercase' }}>
          <span>NUMÉRO</span><span>CLIENT</span><span>DATE</span><span>ÉCHÉANCE</span><span style={{ textAlign: 'right' }}>MONTANT</span><span>STATUT</span>
        </div>
        {ADMIN_INVOICES.map((inv, i) => (
          <div key={inv.num} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 110px 130px 130px 110px', gap: 16, padding: '16px 24px', borderBottom: i < ADMIN_INVOICES.length - 1 ? `1px solid ${P.ink}08` : 'none', alignItems: 'center', cursor: 'pointer' }}>
            <span style={{ fontFamily: P.mono, fontSize: 13, fontWeight: 600 }}>{inv.num}</span>
            <span style={{ fontFamily: P.display, fontSize: 15, fontWeight: 600 }}>{inv.client}</span>
            <span style={{ fontFamily: P.serif, fontSize: 13, color: P.inkSoft }}>{fmtDateFR2(inv.date)}</span>
            <span style={{ fontFamily: P.serif, fontSize: 13, color: inv.status === 'overdue' ? '#7a1a1a' : P.inkSoft, fontWeight: inv.status === 'overdue' ? 600 : 400 }}>{inv.due === '—' ? '—' : fmtDateFR2(inv.due)}</span>
            <span style={{ fontFamily: P.display, fontSize: 16, fontWeight: 700, textAlign: 'right' }}>{fmtEur(inv.amount)}</span>
            <StatusPill P={P} status={inv.status} sm />
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── SETTINGS ───────────────────────────────────────────────────
function AdminSettings({ P, goto }) {
  const [tab, setTab] = React.useState('studios');
  return (
    <div>
      <PageHeader P={P} eyebrow="¶ Configuration des plateaux et tarifs" title="Paramètres" hand="& tarifs" />

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        <Card P={P} pad={12}>
          {[
            { id: 'studios', label: '◫ Plateaux' },
            { id: 'pricing', label: '€ Tarifs & créneaux' },
            { id: 'addons',  label: '✦ Options & matériel' },
            { id: 'team',    label: '◐ Équipe' },
            { id: 'notifs',  label: '◔ Notifications' },
            { id: 'billing', label: '✎ Facturation' },
            { id: 'integ',   label: '⚙ Intégrations' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '12px 14px', borderRadius: 10,
              background: tab === t.id ? P.lime : 'transparent', color: P.ink,
              border: 'none', fontFamily: P.display, fontSize: 14, fontWeight: tab === t.id ? 700 : 500,
              cursor: 'pointer', marginBottom: 2,
            }}>{t.label}</button>
          ))}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {tab === 'studios' && (
            <>
              {HIVING_STUDIOS.map(s => (
                <Card key={s.id} P={P} pad={28}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 24, alignItems: 'center' }}>
                    <div style={{ width: 100, height: 100, borderRadius: 16, background: s.color, display: 'flex', alignItems: 'flex-end', padding: 12 }}>
                      <span style={{ fontFamily: P.hand, fontSize: 44, fontWeight: 700, color: s.id === 'plateau-2' ? P.bg : P.ink, transform: 'rotate(-3deg)', lineHeight: 0.8 }}>№{s.num}</span>
                    </div>
                    <div>
                      <div style={{ fontFamily: P.display, fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>{s.name}</div>
                      <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.12em', color: P.inkSoft, marginTop: 4 }}>{s.surface} · {s.height}</div>
                      <div style={{ fontFamily: P.serif, fontSize: 14, color: P.inkSoft, marginTop: 6, lineHeight: 1.5 }}>{s.desc}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <button style={{ padding: '8px 16px', background: 'transparent', border: `1.5px solid ${P.ink}`, borderRadius: 999, fontFamily: P.display, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Modifier</button>
                      <StatusPill P={P} status="free" label="Actif" sm />
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}

          {tab === 'pricing' && (
            <Card P={P} pad={28}>
              <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 18 }}>GRILLE TARIFAIRE — HT</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
                {[
                  { l: 'Journée 9h–19h', p: 1800, sub: '10 h' },
                  { l: 'Demi-journée AM', p: 1050, sub: '8h–13h' },
                  { l: 'Demi-journée PM', p: 1050, sub: '14h–19h' },
                  { l: 'Nuit 19h–9h', p: 1400, sub: '14 h' },
                ].map(s => (
                  <div key={s.l} style={{ padding: 16, background: P.cream, borderRadius: 12 }}>
                    <div style={{ fontFamily: P.display, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.l}</div>
                    <div style={{ fontFamily: P.display, fontSize: 28, fontWeight: 700 }}>{fmtEur(s.p)}</div>
                    <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.12em', color: P.inkSoft, marginTop: 4 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === 'addons' && (
            <Card P={P} pad={28}>
              <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 18 }}>INVENTAIRE MATÉRIEL</div>
              {ADMIN_EQUIPMENT_INV.map(cat => (
                <div key={cat.cat} style={{ marginBottom: 18 }}>
                  <div style={{ fontFamily: P.display, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{cat.cat}</div>
                  {cat.items.map((it, i) => (
                    <div key={it.name} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px', gap: 16, padding: '10px 0', borderTop: `1px dashed ${P.ink}15`, alignItems: 'center', fontFamily: P.serif, fontSize: 14 }}>
                      <span>{it.name}</span>
                      <span style={{ fontFamily: P.mono, fontSize: 12, color: P.inkSoft, textAlign: 'right' }}>{it.qty} unités</span>
                      <StatusPill P={P} status={it.available > 0 ? 'free' : 'busy'} sm label={`${it.available}/${it.qty}`} />
                    </div>
                  ))}
                </div>
              ))}
            </Card>
          )}

          {tab === 'team' && (
            <Card P={P} pad={28}>
              <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 18 }}>ÉQUIPE — 6 PERSONNES</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {ADMIN_TEAM.map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: P.cream, borderRadius: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.color, color: P.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: P.display, fontWeight: 700, fontSize: 14 }}>
                      {t.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: P.display, fontSize: 15, fontWeight: 600 }}>{t.name}</div>
                      <div style={{ fontFamily: P.mono, fontSize: 10.5, letterSpacing: '0.1em', color: P.inkSoft }}>{t.role.toUpperCase()}</div>
                    </div>
                    <StatusPill P={P} status={t.avail} sm />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {(tab === 'notifs' || tab === 'billing' || tab === 'integ') && (
            <Card P={P} pad={28}>
              <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 18 }}>
                {tab === 'notifs' ? 'NOTIFICATIONS' : tab === 'billing' ? 'PARAMÈTRES FACTURATION' : 'INTÉGRATIONS'}
              </div>
              {(tab === 'notifs' ? [
                ['Email — nouvelle demande', true],
                ['Email — confirmation client', true],
                ['SMS — rappel J−1 client', true],
                ['SMS — rappel J−1 équipe', true],
                ['Push — facture en retard', false],
                ['Slack — résumé hebdo', true],
              ] : tab === 'billing' ? [
                ['Numérotation auto', true],
                ['Acompte 30 % obligatoire', true],
                ['Relance auto à J+7', true],
                ['Envoi PDF par email', true],
              ] : [
                ['Stripe — paiements', true],
                ['Slack — notifs équipe', true],
                ['Google Calendar — sync planning', true],
                ['Mailchimp — newsletter', false],
                ['Sage — exports comptables', false],
              ]).map(([label, on], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: i > 0 ? `1px solid ${P.ink}10` : 'none' }}>
                  <span style={{ fontFamily: P.serif, fontSize: 15 }}>{label}</span>
                  <Toggle P={P} on={on} />
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({ P, on }) {
  return (
    <span style={{
      width: 44, height: 24, borderRadius: 999,
      background: on ? P.lime : P.ink + '20',
      position: 'relative', display: 'inline-block', cursor: 'pointer',
      transition: 'background 0.2s',
    }}>
      <span style={{
        position: 'absolute', top: 2, left: on ? 22 : 2,
        width: 20, height: 20, borderRadius: '50%', background: P.bg,
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }}></span>
    </span>
  );
}

Object.assign(window, { AdminClients, AdminClient, AdminInvoices, AdminSettings });
