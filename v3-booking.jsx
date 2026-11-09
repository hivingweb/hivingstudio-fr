// HIVING FOOD — Booking flow pro multi-étapes
// Composant: V3BookingPro
// Dépendances globales: HIVING_STUDIOS, Plus, Splat, Star

(function () {
  const SLOTS = {
    day:   { id: 'day',   label: 'Journée',         hours: '9h–19h',  duration: '10 h', price: 1800 },
    half_am: { id: 'half_am', label: 'Demi-journée matin', hours: '8h–13h', duration: '5 h', price: 1050 },
    half_pm: { id: 'half_pm', label: 'Demi-journée après-midi', hours: '14h–19h', duration: '5 h', price: 1050 },
    night: { id: 'night', label: 'Nuit',            hours: '19h–9h',  duration: '14 h', price: 1400 },
  };

  const ADDONS = [
    { id: 'chef',     label: 'Chef cuisinier',          desc: 'Pour cuisson live et réglages plat',           price: 650, unit: '/jour' },
    { id: 'stylist',  label: 'Styliste culinaire',      desc: 'Mise en scène, dressage, retouches plat',       price: 580, unit: '/jour' },
    { id: 'asst',     label: 'Assistant photo',         desc: 'Aide setup, lumière, manutention',              price: 320, unit: '/jour' },
    { id: 'gear',     label: 'Pack matériel premium',   desc: 'Profoto B10X4, optiques cinéma, gimbal',        price: 480, unit: '/jour' },
    { id: 'kitchen',  label: 'Cuisine équipée + chef',  desc: 'Plan 8m, piano 6 feux, four pro, chef inclus',  price: 890, unit: '/jour' },
    { id: 'retouch',  label: 'Retouche photo (pack 10)', desc: 'Sélection, étalonnage, livraison HD',           price: 750, unit: 'forfait' },
    { id: 'parking',  label: 'Parking privé (5 places)', desc: 'Cour intérieure, accès véhicules',              price: 90,  unit: '/jour' },
    { id: 'catering', label: 'Lunch équipe (pers.)',     desc: 'Traiteur sain, café & boissons illimitées',     price: 28,  unit: '/pers.' },
  ];

  // Quelques jours occupés réalistes (deux mois)
  const BOOKED = {
    // mai 2026 — index = jour du mois
    5: ['plateau-1', 'plateau-3'],
    8: ['plateau-1'],
    14: ['plateau-2'],
    19: ['plateau-1', 'plateau-2', 'plateau-3'],
    22: ['plateau-3'],
    27: ['plateau-2'],
    // juin
    103: ['plateau-1'],          // jour 3 du mois suivant
    107: ['plateau-1', 'plateau-2'],
    111: ['plateau-3'],
    118: ['plateau-1'],
    124: ['plateau-2', 'plateau-3'],
  };

  // Helpers calendrier
  function getMonthGrid(year, month /* 0-11 */) {
    const first = new Date(year, month, 1);
    const startDow = (first.getDay() + 6) % 7; // L=0 .. D=6
    const nbDays = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= nbDays; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }

  function fmtDateFR(d) {
    if (!d) return '—';
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  // Composant principal
  function V3BookingPro({ P }) {
    const [step, setStep] = React.useState(1);
    const [studioIdx, setStudioIdx] = React.useState(0);
    const [date, setDate] = React.useState(null); // Date object
    const [slot, setSlot] = React.useState('day');
    const [addons, setAddons] = React.useState({}); // {id: qty}
    const [contact, setContact] = React.useState({
      name: '', company: '', email: '', phone: '', brief: '',
    });
    const [confirmed, setConfirmed] = React.useState(false);

    const studio = HIVING_STUDIOS[studioIdx];
    const slotObj = SLOTS[slot];

    // Total
    const addonTotal = ADDONS.reduce((acc, a) => {
      const q = addons[a.id] || 0;
      return acc + a.price * q;
    }, 0);
    const subtotal = slotObj.price + addonTotal;
    const tva = Math.round(subtotal * 0.20);
    const total = subtotal + tva;
    const acompte = Math.round(total * 0.30);

    // Mois affichés
    const today = new Date();
    const [viewMonth, setViewMonth] = React.useState(() => ({ y: today.getFullYear(), m: today.getMonth() }));
    const m1 = viewMonth;
    const m2 = m1.m === 11 ? { y: m1.y + 1, m: 0 } : { y: m1.y, m: m1.m + 1 };

    const isBooked = (year, month, day) => {
      // map sur clés simplistes: jour du mois pour mois courant; +100 pour mois suivant
      const isCurrent = (year === today.getFullYear() && month === today.getMonth());
      const key = isCurrent ? day : day + 100;
      const arr = BOOKED[key];
      return arr && arr.includes(studio.id);
    };

    const isPast = (year, month, day) => {
      const d = new Date(year, month, day);
      const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return d < t;
    };

    const canProceed = (() => {
      if (step === 1) return studioIdx !== null;
      if (step === 2) return date !== null;
      if (step === 3) return slot !== null;
      if (step === 4) return true;
      if (step === 5) return contact.name && contact.email && contact.phone;
      return true;
    })();

    const stepLabels = ['Plateau', 'Date', 'Créneau', 'Options', 'Coordonnées', 'Récap'];

    return (
      <div id="reserver" style={{ padding: '120px 40px', background: P.bg, position: 'relative', overflow: 'hidden' }}>
        {/* big splat in background */}
        <div style={{ position: 'absolute', top: 60, right: 80, opacity: 0.6, pointerEvents: 'none' }}>
          <Splat color={P.butter} size={220} style={{ transform: 'rotate(20deg)' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 80, left: -40, opacity: 0.4, pointerEvents: 'none' }}>
          <Splat color={P.lime} size={260} style={{ transform: 'rotate(-30deg)' }} />
        </div>

        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, textTransform: 'uppercase', marginBottom: 16, position: 'relative' }}>
          ¶ 07 — Réservation en ligne
        </div>
        <h2 style={{
          fontFamily: P.display, fontSize: 'clamp(64px, 9vw, 140px)',
          lineHeight: 1, letterSpacing: '-0.045em', margin: '0 0 32px',
          fontWeight: 600, position: 'relative',
        }}>
          <span style={{
            fontFamily: P.hand, color: P.accent, fontWeight: 700,
            display: 'inline-block', transform: 'rotate(-2deg)',
          }}>Réservez</span> votre plateau.
        </h2>
        <p style={{ fontFamily: P.serif, fontSize: 22, lineHeight: 1.5, color: P.inkSoft, maxWidth: 720, margin: '0 0 56px', position: 'relative' }}>
          Cinq étapes, deux minutes. Confirmation par email sous 24 h ouvrées avec acompte de 30 %.
        </p>

        {/* Stepper */}
        {!confirmed && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 48, position: 'relative', flexWrap: 'wrap' }}>
            {stepLabels.map((label, i) => {
              const n = i + 1;
              const isActive = step === n;
              const isDone = step > n;
              return (
                <button key={n}
                  onClick={() => { if (isDone) setStep(n); }}
                  disabled={!isDone}
                  style={{
                    flex: '1 1 140px',
                    padding: '14px 18px',
                    background: isActive ? P.ink : (isDone ? P.cream : 'transparent'),
                    color: isActive ? P.bg : P.ink,
                    border: `2px solid ${isActive || isDone ? P.ink : P.ink + '30'}`,
                    borderRadius: 14,
                    cursor: isDone ? 'pointer' : 'default',
                    fontFamily: P.display, fontSize: 14, fontWeight: 600,
                    textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 10,
                    transition: 'all .25s',
                  }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: isActive ? P.accent : (isDone ? P.ink : 'transparent'),
                    color: isActive ? P.bg : (isDone ? P.bg : P.inkSoft),
                    border: isDone || isActive ? 'none' : `1.5px solid ${P.inkSoft}`,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: P.mono, fontSize: 11, fontWeight: 700,
                  }}>{isDone ? '✓' : n}</span>
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Confirmation screen */}
        {confirmed && (
          <ConfirmationCard
            P={P}
            studio={studio}
            date={date}
            slot={slotObj}
            addons={ADDONS.filter(a => addons[a.id])}
            qtyMap={addons}
            total={total}
            acompte={acompte}
            contact={contact}
            onReset={() => {
              setConfirmed(false);
              setStep(1);
              setStudioIdx(0); setDate(null); setSlot('day');
              setAddons({}); setContact({ name: '', company: '', email: '', phone: '', brief: '' });
            }}
          />
        )}

        {!confirmed && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 48, alignItems: 'start', position: 'relative' }}>
            {/* LEFT — current step */}
            <div style={{
              background: P.bg, border: `2px solid ${P.ink}`, borderRadius: 24,
              padding: 40, minHeight: 580,
            }}>
              {step === 1 && (
                <StepStudio P={P} studioIdx={studioIdx} setStudioIdx={setStudioIdx} />
              )}
              {step === 2 && (
                <StepDate
                  P={P}
                  studio={studio}
                  date={date} setDate={setDate}
                  m1={m1} m2={m2}
                  setViewMonth={setViewMonth}
                  isBooked={isBooked}
                  isPast={isPast}
                  getMonthGrid={getMonthGrid}
                />
              )}
              {step === 3 && (
                <StepSlot P={P} slot={slot} setSlot={setSlot} slots={SLOTS} />
              )}
              {step === 4 && (
                <StepAddons P={P} addons={addons} setAddons={setAddons} list={ADDONS} />
              )}
              {step === 5 && (
                <StepContact P={P} contact={contact} setContact={setContact} />
              )}
              {step === 6 && (
                <StepRecap P={P} studio={studio} date={date} slot={slotObj} addons={ADDONS.filter(a => addons[a.id])} qtyMap={addons} contact={contact} />
              )}

              {/* Nav */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 48, paddingTop: 24, borderTop: `1px solid ${P.ink}15` }}>
                <button
                  onClick={() => setStep(s => Math.max(1, s - 1))}
                  disabled={step === 1}
                  style={{
                    padding: '12px 22px', background: 'transparent', border: `2px solid ${P.ink}`,
                    borderRadius: 999, fontFamily: P.display, fontSize: 14, fontWeight: 600,
                    cursor: step === 1 ? 'default' : 'pointer', opacity: step === 1 ? 0.3 : 1,
                    color: P.ink,
                  }}
                >← Retour</button>
                {step < 6 ? (
                  <button
                    onClick={() => canProceed && setStep(s => s + 1)}
                    disabled={!canProceed}
                    style={{
                      padding: '14px 28px', background: canProceed ? P.ink : P.ink + '40',
                      color: P.bg, border: 'none', borderRadius: 999,
                      fontFamily: P.display, fontSize: 14, fontWeight: 600,
                      cursor: canProceed ? 'pointer' : 'not-allowed',
                      display: 'inline-flex', alignItems: 'center', gap: 10,
                    }}
                  >
                    Continuer
                    <span>→</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmed(true)}
                    style={{
                      padding: '14px 28px', background: P.accent, color: P.bg, border: 'none',
                      borderRadius: 999, fontFamily: P.display, fontSize: 14, fontWeight: 700,
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10,
                      boxShadow: `0 8px 24px ${P.accent}40`,
                    }}
                  >
                    Confirmer la demande
                    <span>→</span>
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT — sticky summary */}
            <div style={{ position: 'sticky', top: 100 }}>
              <SummaryCard
                P={P} studio={studio} date={date} slot={slotObj}
                addons={ADDONS.filter(a => addons[a.id])}
                qtyMap={addons}
                subtotal={subtotal} tva={tva} total={total} acompte={acompte}
                step={step}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── STEP 1 — STUDIO ─────────────────────────────────────────
  function StepStudio({ P, studioIdx, setStudioIdx }) {
    return (
      <div>
        <StepHeader P={P} num="01" title="Choisissez votre plateau" sub="Trois ambiances, trois caractères. Chaque plateau a son matériel dédié." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {HIVING_STUDIOS.map((s, i) => {
            const active = studioIdx === i;
            return (
              <button key={s.id} onClick={() => setStudioIdx(i)} style={{
                textAlign: 'left', padding: 0, borderRadius: 16, overflow: 'hidden',
                border: `2px solid ${active ? P.ink : P.ink + '20'}`,
                background: P.bg, cursor: 'pointer', position: 'relative',
                transition: 'all .25s',
                transform: active ? 'translateY(-4px)' : 'none',
                boxShadow: active ? `0 12px 32px ${P.ink}25` : 'none',
              }}>
                <div style={{
                  height: 140, background: s.color, position: 'relative',
                  display: 'flex', alignItems: 'flex-end', padding: 16,
                }}>
                  <div style={{
                    fontFamily: P.hand, fontSize: 60, fontWeight: 700,
                    color: i === 1 ? P.bg : P.ink, opacity: 0.85,
                    transform: 'rotate(-3deg)', lineHeight: 0.8,
                  }}>№{s.num}</div>
                  {active && (
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      width: 32, height: 32, borderRadius: '50%', background: P.ink,
                      color: P.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: P.mono, fontWeight: 700, fontSize: 14,
                    }}>✓</div>
                  )}
                </div>
                <div style={{ padding: 18 }}>
                  <div style={{ fontFamily: P.display, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4, color: P.ink }}>
                    {s.name}
                  </div>
                  <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.14em', color: P.inkSoft, marginBottom: 12 }}>
                    {s.surface} · {s.height}
                  </div>
                  <div style={{ fontFamily: P.serif, fontSize: 14, lineHeight: 1.5, color: P.inkSoft }}>
                    {s.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── STEP 2 — DATE ───────────────────────────────────────────
  function StepDate({ P, studio, date, setDate, m1, m2, setViewMonth, isBooked, isPast, getMonthGrid }) {
    const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

    function MonthGrid({ y, m }) {
      const cells = getMonthGrid(y, m);
      return (
        <div>
          <div style={{
            fontFamily: P.display, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em',
            marginBottom: 16,
          }}>
            {monthNames[m]} <span style={{ fontFamily: P.hand, color: P.accent, fontWeight: 700 }}>{y}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {['L','M','M','J','V','S','D'].map((d, i) => (
              <div key={i} style={{
                padding: '6px 0', textAlign: 'center',
                fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', color: P.inkSoft,
              }}>{d}</div>
            ))}
            {cells.map((d, i) => {
              if (d === null) return <div key={i}></div>;
              const past = isPast(y, m, d);
              const booked = isBooked(y, m, d);
              const sel = date && date.getFullYear() === y && date.getMonth() === m && date.getDate() === d;
              const disabled = past || booked;
              return (
                <button key={i}
                  onClick={() => !disabled && setDate(new Date(y, m, d))}
                  disabled={disabled}
                  style={{
                    aspectRatio: '1/1', borderRadius: 10,
                    background: sel ? P.ink : (booked ? 'transparent' : P.cream),
                    border: booked ? `1px dashed ${P.ink}30` : 'none',
                    color: sel ? P.bg : (disabled ? P.inkSoft : P.ink),
                    opacity: past ? 0.25 : 1,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    fontFamily: P.display, fontSize: 16, fontWeight: 500,
                    position: 'relative',
                    transition: 'all .15s',
                  }}>
                  {d}
                  {booked && (
                    <div style={{
                      position: 'absolute', inset: 4,
                      backgroundImage: `repeating-linear-gradient(-45deg, ${P.ink}40 0 1px, transparent 1px 5px)`,
                      borderRadius: 6,
                    }}></div>
                  )}
                  {sel && (
                    <div style={{
                      position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                      width: 5, height: 5, borderRadius: '50%', background: P.accent,
                    }}></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div>
        <StepHeader P={P} num="02" title="Choisissez votre date" sub={`Disponibilités pour ${studio.name}. Les jours rayés sont déjà réservés.`} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <button
            onClick={() => setViewMonth(v => v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 })}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: P.display, fontWeight: 600, fontSize: 14, color: P.ink }}>← Mois précédent</button>
          <button
            onClick={() => setViewMonth(v => v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 })}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: P.display, fontWeight: 600, fontSize: 14, color: P.ink }}>Mois suivant →</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <MonthGrid y={m1.y} m={m1.m} />
          <MonthGrid y={m2.y} m={m2.m} />
        </div>

        <div style={{ display: 'flex', gap: 24, marginTop: 24, fontFamily: P.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: P.inkSoft, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 12, background: P.ink, display: 'inline-block', borderRadius: 3 }}></span> Sélectionné
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 12, background: P.cream, display: 'inline-block', borderRadius: 3 }}></span> Disponible
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 12, border: `1px dashed ${P.inkSoft}`, display: 'inline-block', borderRadius: 3 }}></span> Réservé
          </span>
        </div>
      </div>
    );
  }

  // ─── STEP 3 — SLOT ───────────────────────────────────────────
  function StepSlot({ P, slot, setSlot, slots }) {
    return (
      <div>
        <StepHeader P={P} num="03" title="Choisissez votre créneau" sub="Tarifs HT, hors options. Demi-journées non cumulables le même jour." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {Object.values(slots).map(s => {
            const active = slot === s.id;
            return (
              <button key={s.id} onClick={() => setSlot(s.id)} style={{
                textAlign: 'left', padding: '24px 28px', borderRadius: 16,
                border: `2px solid ${active ? P.ink : P.ink + '20'}`,
                background: active ? P.ink : P.bg,
                color: active ? P.bg : P.ink,
                cursor: 'pointer',
                position: 'relative',
                transition: 'all .25s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <div style={{ fontFamily: P.display, fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
                    {s.label}
                  </div>
                  <div style={{ fontFamily: P.display, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: active ? P.accent : P.ink, whiteSpace: 'nowrap' }}>
                    {s.price.toLocaleString('fr-FR')}&nbsp;€
                  </div>
                </div>
                <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7 }}>
                  {s.hours} · {s.duration}
                </div>
                {active && (
                  <div style={{
                    position: 'absolute', top: 16, right: 16,
                    width: 28, height: 28, borderRadius: '50%', background: P.accent,
                    color: P.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14,
                  }}>✓</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── STEP 4 — ADDONS ─────────────────────────────────────────
  function StepAddons({ P, addons, setAddons, list }) {
    const setQty = (id, q) => {
      setAddons(prev => {
        const next = { ...prev };
        if (q <= 0) delete next[id];
        else next[id] = q;
        return next;
      });
    };
    return (
      <div>
        <StepHeader P={P} num="04" title="Ajoutez vos options" sub="Tout ce qui peut vous faciliter la journée. Chef, styliste, matériel, retouche." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
          {list.map(a => {
            const qty = addons[a.id] || 0;
            const isPersUnit = a.unit === '/pers.';
            const active = qty > 0;
            return (
              <div key={a.id} style={{
                padding: '18px 22px', borderRadius: 14,
                border: `2px solid ${active ? P.ink : P.ink + '15'}`,
                background: active ? P.cream : P.bg,
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    <div style={{ fontFamily: P.display, fontSize: 17, fontWeight: 700, color: P.ink }}>
                      {a.label}
                    </div>
                    <div style={{ fontFamily: P.mono, fontSize: 12, color: P.inkSoft }}>
                      {a.price} € {a.unit}
                    </div>
                  </div>
                  <div style={{ fontFamily: P.serif, fontSize: 14, color: P.inkSoft, marginTop: 2 }}>
                    {a.desc}
                  </div>
                </div>
                {isPersUnit ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => setQty(a.id, Math.max(0, qty - 1))} style={qtyBtn(P)}>−</button>
                    <div style={{ minWidth: 36, textAlign: 'center', fontFamily: P.display, fontWeight: 700, fontSize: 18 }}>{qty}</div>
                    <button onClick={() => setQty(a.id, qty + 1)} style={qtyBtn(P)}>+</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setQty(a.id, qty > 0 ? 0 : 1)}
                    style={{
                      padding: '10px 18px', borderRadius: 999,
                      background: active ? P.ink : 'transparent',
                      color: active ? P.bg : P.ink,
                      border: `2px solid ${P.ink}`,
                      cursor: 'pointer',
                      fontFamily: P.display, fontSize: 13, fontWeight: 600,
                    }}>
                    {active ? '✓ Ajouté' : '+ Ajouter'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function qtyBtn(P) {
    return {
      width: 34, height: 34, borderRadius: '50%', border: `2px solid ${P.ink}`,
      background: P.bg, cursor: 'pointer', fontFamily: P.display, fontSize: 16, fontWeight: 700, color: P.ink,
    };
  }

  // ─── STEP 5 — CONTACT ────────────────────────────────────────
  function StepContact({ P, contact, setContact }) {
    const F = (k, label, type = 'text', isReq = false, ph = '') => (
      <label style={{ display: 'block', marginBottom: 18 }}>
        <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: P.inkSoft, marginBottom: 6 }}>
          {label} {isReq && <span style={{ color: P.accent }}>*</span>}
        </div>
        <input
          type={type}
          value={contact[k]}
          placeholder={ph}
          onChange={e => setContact(c => ({ ...c, [k]: e.target.value }))}
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

    return (
      <div>
        <StepHeader P={P} num="05" title="Vos coordonnées" sub="Pour que l'on revienne vers vous sous 24h ouvrées." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {F('name', 'Nom & prénom', 'text', true, 'Marie Dupont')}
          {F('company', 'Société', 'text', false, 'Maison Bonnefoy')}
          {F('email', 'Email', 'email', true, 'marie@maison.fr')}
          {F('phone', 'Téléphone', 'tel', true, '+33 6 12 34 56 78')}
        </div>
        <label style={{ display: 'block', marginTop: 8 }}>
          <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: P.inkSoft, marginBottom: 6 }}>
            Brief / contexte (optionnel)
          </div>
          <textarea
            value={contact.brief}
            placeholder="Quelques mots sur le projet : marque, type de shooting, ambiance, équipe…"
            onChange={e => setContact(c => ({ ...c, brief: e.target.value }))}
            rows={4}
            style={{
              width: '100%', padding: '14px 16px',
              border: `1.5px solid ${P.ink}30`, borderRadius: 12,
              fontFamily: P.serif, fontSize: 16, color: P.ink, background: P.bg,
              outline: 'none', boxSizing: 'border-box', resize: 'vertical',
            }}
            onFocus={e => e.target.style.borderColor = P.ink}
            onBlur={e => e.target.style.borderColor = P.ink + '30'}
          />
        </label>
      </div>
    );
  }

  // ─── STEP 6 — RECAP ──────────────────────────────────────────
  function StepRecap({ P, studio, date, slot, addons, qtyMap, contact }) {
    return (
      <div>
        <StepHeader P={P} num="06" title="Vérifiez votre demande" sub="Tout est bon ? Confirmez et nous revenons vers vous sous 24 h." />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <RecapBlock P={P} title="Plateau">
            <div style={{ fontFamily: P.display, fontSize: 22, fontWeight: 700 }}>
              <span style={{ fontFamily: P.hand, color: P.accent, fontWeight: 700, marginRight: 6 }}>№{studio.num}</span>
              {studio.name}
            </div>
            <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.12em', color: P.inkSoft, marginTop: 4 }}>
              {studio.surface} · {studio.height}
            </div>
          </RecapBlock>
          <RecapBlock P={P} title="Date & créneau">
            <div style={{ fontFamily: P.display, fontSize: 22, fontWeight: 700 }}>
              {fmtDateFR(date)}
            </div>
            <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.12em', color: P.inkSoft, marginTop: 4 }}>
              {slot.label} · {slot.hours}
            </div>
          </RecapBlock>
          <RecapBlock P={P} title="Contact" wide>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontFamily: P.display, fontSize: 17, fontWeight: 700 }}>{contact.name || '—'}</div>
                <div style={{ fontFamily: P.serif, fontSize: 14, color: P.inkSoft }}>{contact.company || '—'}</div>
              </div>
              <div>
                <div style={{ fontFamily: P.mono, fontSize: 13, color: P.ink }}>{contact.email || '—'}</div>
                <div style={{ fontFamily: P.mono, fontSize: 13, color: P.inkSoft }}>{contact.phone || '—'}</div>
              </div>
            </div>
            {contact.brief && (
              <div style={{
                marginTop: 14, padding: 14, background: P.bg, borderRadius: 10,
                fontFamily: P.serif, fontSize: 14, color: P.inkSoft, lineHeight: 1.5,
                borderLeft: `3px solid ${P.accent}`,
              }}>
                « {contact.brief} »
              </div>
            )}
          </RecapBlock>
          {addons.length > 0 && (
            <RecapBlock P={P} title="Options" wide>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {addons.map(a => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: P.serif, fontSize: 15 }}>
                    <span>{a.label} {a.unit === '/pers.' && <span style={{ color: P.inkSoft }}>× {qtyMap[a.id]}</span>}</span>
                    <span style={{ fontFamily: P.mono, color: P.inkSoft }}>{(a.price * (qtyMap[a.id] || 1)).toLocaleString('fr-FR')} €</span>
                  </div>
                ))}
              </div>
            </RecapBlock>
          )}
        </div>
      </div>
    );
  }

  function RecapBlock({ P, title, children, wide }) {
    return (
      <div style={{
        padding: 22, borderRadius: 14, background: P.cream,
        gridColumn: wide ? '1 / -1' : 'auto',
      }}>
        <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: P.inkSoft, marginBottom: 10 }}>
          {title}
        </div>
        {children}
      </div>
    );
  }

  // ─── STEP HEADER ─────────────────────────────────────────────
  function StepHeader({ P, num, title, sub }) {
    return (
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 14 }}>
          <span style={{ fontFamily: P.hand, fontSize: 38, color: P.accent, fontWeight: 700, transform: 'rotate(-2deg)', display: 'inline-block', lineHeight: 1 }}>
            {num}
          </span>
          <h3 style={{ fontFamily: P.display, fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>
            {title}
          </h3>
        </div>
        <p style={{ fontFamily: P.serif, fontSize: 16, color: P.inkSoft, margin: 0, lineHeight: 1.5 }}>
          {sub}
        </p>
      </div>
    );
  }

  // ─── SUMMARY (sticky) ────────────────────────────────────────
  function SummaryCard({ P, studio, date, slot, addons, qtyMap, subtotal, tva, total, acompte, step }) {
    return (
      <div style={{
        padding: 28, background: P.ink, color: P.bg, borderRadius: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <Plus color={P.accent} size={28} style={{ position: 'absolute', top: 18, right: 18, opacity: 0.5 }} />
        <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.18em', opacity: 0.6, marginBottom: 18 }}>
          VOTRE RÉSERVATION
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          <SumRow P={P} label="Plateau" value={
            <span><span style={{ fontFamily: P.hand, color: P.accent, fontWeight: 700, marginRight: 6 }}>№{studio.num}</span>{studio.name}</span>
          } />
          <SumRow P={P} label="Date" value={date ? fmtDateFR(date) : <span style={{ opacity: 0.4 }}>à choisir</span>} />
          <SumRow P={P} label="Créneau" value={
            <span>{slot.label} <span style={{ opacity: 0.5, fontFamily: P.mono, fontSize: 11 }}> · {slot.hours}</span></span>
          } />
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '20px 0' }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18, fontFamily: P.serif, fontSize: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.85 }}>
            <span>Plateau {slot.label.toLowerCase()}</span>
            <span style={{ fontFamily: P.mono }}>{slot.price.toLocaleString('fr-FR')} €</span>
          </div>
          {addons.map(a => (
            <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7 }}>
              <span>{a.label}{a.unit === '/pers.' && ` × ${qtyMap[a.id]}`}</span>
              <span style={{ fontFamily: P.mono }}>{(a.price * (qtyMap[a.id] || 1)).toLocaleString('fr-FR')} €</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6, fontSize: 12, marginTop: 6 }}>
            <span>TVA 20 %</span>
            <span style={{ fontFamily: P.mono }}>{tva.toLocaleString('fr-FR')} €</span>
          </div>
        </div>

        <div style={{
          padding: '18px 0', borderTop: '1px solid rgba(255,255,255,0.16)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        }}>
          <span style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.16em' }}>TOTAL TTC</span>
          <span style={{ fontFamily: P.display, fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {total.toLocaleString('fr-FR')} €
          </span>
        </div>
        <div style={{
          padding: '12px 16px', background: P.accent, color: P.bg, borderRadius: 12,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: P.display, fontSize: 13, fontWeight: 600,
        }}>
          <span>Acompte 30 % à la confirmation</span>
          <span style={{ fontFamily: P.mono, fontSize: 15, fontWeight: 700 }}>{acompte.toLocaleString('fr-FR')} €</span>
        </div>

        <div style={{
          marginTop: 18, fontFamily: P.serif, fontSize: 12, lineHeight: 1.5,
          opacity: 0.55, fontStyle: 'italic',
        }}>
          Tarifs indicatifs HT. Devis personnalisé envoyé sous 24 h ouvrées avec proposition de planning.
        </div>
      </div>
    );
  }

  function SumRow({ P, label, value }) {
    return (
      <div>
        <div style={{ fontFamily: P.mono, fontSize: 9, letterSpacing: '0.18em', opacity: 0.5, textTransform: 'uppercase', marginBottom: 3 }}>
          {label}
        </div>
        <div style={{ fontFamily: P.display, fontSize: 17, fontWeight: 600 }}>
          {value}
        </div>
      </div>
    );
  }

  // ─── CONFIRMATION ────────────────────────────────────────────
  function ConfirmationCard({ P, studio, date, slot, addons, qtyMap, total, acompte, contact, onReset }) {
    const ref = 'HF-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    return (
      <div style={{
        padding: 64, borderRadius: 32, background: P.ink, color: P.bg,
        position: 'relative', overflow: 'hidden', textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', top: 40, right: 60, opacity: 0.3 }}>
          <Splat color={P.accent} size={180} style={{ transform: 'rotate(-15deg)' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 40, left: 60, opacity: 0.2 }}>
          <Splat color={P.lime} size={140} style={{ transform: 'rotate(40deg)' }} />
        </div>

        <div style={{
          width: 92, height: 92, borderRadius: '50%', background: P.accent,
          margin: '0 auto 32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 50, color: P.bg, fontWeight: 700,
          animation: 'hivingPop 0.6s cubic-bezier(.2,.9,.3,1.4) both',
        }}>✓</div>

        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.2em', opacity: 0.6, marginBottom: 12 }}>
          DEMANDE ENREGISTRÉE · RÉF {ref}
        </div>
        <h3 style={{
          fontFamily: P.display, fontSize: 'clamp(56px, 8vw, 96px)', fontWeight: 700,
          letterSpacing: '-0.04em', lineHeight: 0.95, margin: '0 0 24px',
        }}>
          Merci<span style={{ color: P.accent }}>,</span> <br />
          <span style={{ fontFamily: P.hand, color: P.accent, transform: 'rotate(-2deg)', display: 'inline-block' }}>
            {(contact.name || 'à très vite').split(' ')[0]} !
          </span>
        </h3>
        <p style={{
          fontFamily: P.serif, fontSize: 20, lineHeight: 1.6,
          maxWidth: 680, margin: '0 auto 40px', opacity: 0.85,
        }}>
          Votre demande pour <strong style={{ color: P.accent }}>{studio.name}</strong> le <strong style={{ color: P.accent }}>{fmtDateFR(date)}</strong> ({slot.label.toLowerCase()}) est bien arrivée.<br />
          Un email de confirmation est en route vers <strong>{contact.email || 'votre boîte'}</strong>. Nous revenons vers vous sous <strong>24 h ouvrées</strong> avec le planning définitif.
        </p>

        <div style={{
          display: 'inline-grid', gridTemplateColumns: 'auto auto', gap: '12px 32px',
          padding: '20px 32px', background: 'rgba(255,255,255,0.06)', borderRadius: 16,
          marginBottom: 32, fontFamily: P.serif, fontSize: 15,
        }}>
          <span style={{ opacity: 0.6 }}>Total estimé TTC</span>
          <span style={{ fontFamily: P.mono, fontWeight: 700, textAlign: 'right' }}>{total.toLocaleString('fr-FR')} €</span>
          <span style={{ opacity: 0.6 }}>Acompte à régler (30 %)</span>
          <span style={{ fontFamily: P.mono, fontWeight: 700, color: P.accent, textAlign: 'right' }}>{acompte.toLocaleString('fr-FR')} €</span>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onReset} style={{
            padding: '14px 28px', background: P.accent, color: P.bg, border: 'none',
            borderRadius: 999, fontFamily: P.display, fontSize: 14, fontWeight: 700,
            cursor: 'pointer',
          }}>Faire une autre demande</button>
          <a href="#top" style={{
            padding: '14px 28px', background: 'transparent', color: P.bg,
            border: '2px solid rgba(255,255,255,0.3)', borderRadius: 999,
            fontFamily: P.display, fontSize: 14, fontWeight: 600,
            textDecoration: 'none', display: 'inline-block',
          }}>Retour à l'accueil</a>
        </div>

        <style>{`
          @keyframes hivingPop {
            0%   { transform: scale(0); }
            60%  { transform: scale(1.15); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  // Expose globally
  window.V3BookingPro = V3BookingPro;
})();
