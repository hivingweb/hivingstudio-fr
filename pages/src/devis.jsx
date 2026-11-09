// Source du composant React de pages/devis.html.
// Après modification : node scripts/build-jsx.mjs (voir docs/build-jsx.md).
const P = window.HIVING_PALETTE;
const fmt = (n) => Math.round(n).toLocaleString('fr-FR');

function DevisPage() {
  const narrow = window.useHivingNarrow(900);
  const plateaux = window.HIVING_PLATEAUX;
  const addons = window.HIVING_ADDONS_FULL.filter(a => a.price > 0);
  const [pIdx, setPIdx] = React.useState(0);
  const [duration, setDuration] = React.useState('day');
  const [days, setDays] = React.useState(1);
  const [ax, setAx] = React.useState({});
  const [info, setInfo] = React.useState({ name: '', email: '', company: '' });

  const plateau = plateaux[pIdx];
  const platBase = duration === 'half' ? plateau.priceHalf : plateau.price;
  const platTotal = platBase * (duration === 'half' ? 1 : days);
  const addonsTotal = Object.entries(ax).reduce((s, [id, q]) => {
    const a = addons.find(x => x.id === id);
    return a ? s + a.price * q : s;
  }, 0);
  const subtotal = platTotal + addonsTotal;
  const discount = days >= 3 ? subtotal * 0.10 : 0;
  const ht = subtotal - discount;
  const tva = ht * 0.20;
  const ttc = ht + tva;

  const cats = [...new Set(addons.map(a => a.cat))];

  // Envoi de la demande de devis par e-mail (fonction Vercel /api/contact → contact@hivingfood.fr)
  const [envoi, setEnvoi] = React.useState({ etat: 'idle', msg: '' }); // idle | envoi | ok | erreur
  const [piege, setPiege] = React.useState('');
  const CONTACT = 'contact@hivingfood.fr';
  const envoyerDevis = () => {
    if (envoi.etat === 'envoi') return;
    const email = info.email.trim();
    if (!info.name.trim() || !email) { setEnvoi({ etat: 'erreur', msg: 'Indiquez votre nom et votre e-mail (étape 4) pour recevoir le devis.' }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setEnvoi({ etat: 'erreur', msg: 'Adresse e-mail invalide.' }); return; }
    const lignes = [
      'Demande de devis depuis le configurateur (hivingstudio.fr/pages/devis.html)', '',
      `Plateau : ${plateau.name}`,
      `Durée : ${duration === 'half' ? '½ journée' : days + ' jour(s)'} · ${fmt(platTotal)} € HT`,
      ...Object.entries(ax).filter(([_, q]) => q > 0).map(([id, q]) => {
        const a = addons.find(x => x.id === id);
        return a ? `Option : ${a.name} ×${q} · ${fmt(a.price * q)} € HT` : '';
      }).filter(Boolean),
      discount > 0 ? `Remise fidélité −10 % : −${fmt(discount)} € HT` : '',
      `Total estimé : ${fmt(ht)} € HT (${fmt(ttc)} € TTC)`,
    ].filter(l => l !== '');
    setEnvoi({ etat: 'envoi', msg: 'Envoi en cours…' });
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: info.name, email, company: info.company,
        subject: 'Demande de devis studio', source: 'devis', message: lignes.join('\n'), website: piege,
      }),
    })
      .then(r => r.json().catch(() => ({})).then(d => ({ ok: r.ok, status: r.status, data: d })), () => ({ ok: false, status: 0, data: {} }))
      .then(res => {
        if (res.ok) setEnvoi({ etat: 'ok', msg: 'Merci, votre demande est bien partie. Nous vous envoyons le devis sous 4h ouvrées.' });
        else if (res.status === 400 && res.data.error) setEnvoi({ etat: 'erreur', msg: res.data.error });
        else setEnvoi({ etat: 'indispo', msg: `Envoi momentanément indisponible, écrivez-nous à ${CONTACT}.` });
      });
  };

  return (
    <window.PageShell active="tarifs">
      <window.Breadcrumb items={[{ label: 'Devis instantané' }]} />

      <section style={{ padding: '60px 40px 40px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>¶ Configurateur · 2 minutes</div>
        <h1 style={{ fontFamily: P.display, fontSize: 'clamp(50px, 8vw, 120px)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 0.92, margin: 0 }}>
          Votre devis,<br /><span style={{ ...window.HIVING_HAND_ON_LIGHT, transform: 'rotate(-2deg)', display: 'inline-block' }}>en direct.</span>
        </h1>
      </section>

      <section style={{ padding: narrow ? '20px 16px 80px' : '20px 40px 120px', maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: narrow ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) 380px', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Plateau */}
          <div style={{ background: P.paper, padding: 28, borderRadius: 20, border: `1px solid ${P.ink}10` }}>
            <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 16, textTransform: 'uppercase' }}>1 · Plateau</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              {plateaux.map((p, i) => {
                const sel = i === pIdx;
                return (
                  <button key={p.slug} onClick={() => setPIdx(i)} style={{
                    border: `1.5px solid ${sel ? P.ink : `${P.ink}25`}`, borderRadius: 16,
                    background: sel ? P.lime : 'transparent', cursor: 'pointer',
                    padding: '16px 18px', textAlign: 'left',
                    color: P.ink,
                  }}>
                    <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.16em', opacity: 0.6, textTransform: 'uppercase' }}>Plateau {p.num}</div>
                    <div style={{ fontFamily: P.display, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 2 }}>{p.name}</div>
                    <div style={{ fontFamily: P.mono, fontSize: 11, marginTop: 4, opacity: 0.7 }}>{p.price.toLocaleString('fr-FR')}&nbsp;€ HT / jour</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Durée */}
          <div style={{ background: P.paper, padding: 28, borderRadius: 20, border: `1px solid ${P.ink}10` }}>
            <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 16, textTransform: 'uppercase' }}>2 · Durée</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              {[{ k: 'day', l: 'Journée' }].map(o => {
                const sel = duration === o.k;
                return (
                  <button key={o.k} onClick={() => setDuration(o.k)} style={{
                    flex: '1 1 200px', padding: '14px 18px',
                    border: `1.5px solid ${sel ? P.ink : `${P.ink}25`}`,
                    background: sel ? P.lime : 'transparent', borderRadius: 14,
                    fontFamily: P.sans, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: P.ink,
                  }}>{o.l}</button>
                );
              })}
            </div>
            {duration === 'day' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 12, borderTop: `1px dashed ${P.ink}20` }}>
                <span style={{ fontFamily: P.serif, fontSize: 16 }}>Nombre de jours</span>
                <button onClick={() => setDays(Math.max(1, days - 1))} style={{ width: 36, height: 36, borderRadius: '50%', border: `1px solid ${P.ink}30`, background: 'transparent', cursor: 'pointer', fontSize: 18 }}>−</button>
                <span style={{ fontFamily: P.display, fontSize: 28, fontWeight: 700, minWidth: 32, textAlign: 'center' }}>{days}</span>
                <button onClick={() => setDays(days + 1)} style={{ width: 36, height: 36, borderRadius: '50%', border: `1px solid ${P.ink}30`, background: 'transparent', cursor: 'pointer', fontSize: 18 }}>+</button>
                {days >= 3 && <span style={{ fontFamily: P.mono, fontSize: 11, color: P.splash, marginLeft: 8 }}>−10 % fidélité ✓</span>}
              </div>
            )}
          </div>

          {/* Add-ons */}
          <div style={{ background: P.paper, padding: 28, borderRadius: 20, border: `1px solid ${P.ink}10` }}>
            <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 16, textTransform: 'uppercase' }}>3 · Options</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {cats.map(cat => (
                <div key={cat}>
                  <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.14em', color: P.inkSoft, marginBottom: 10, textTransform: 'uppercase' }}>{cat}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {addons.filter(a => a.cat === cat).map(a => {
                      const q = ax[a.id] || 0;
                      return (
                        <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 12, background: q > 0 ? P.cream : 'transparent', border: `1px solid ${q > 0 ? P.ink : 'transparent'}` }}>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontFamily: P.serif, fontSize: 17, fontWeight: 600 }}>{a.name}</div>
                            <div style={{ fontFamily: P.sans, fontSize: 12, color: P.inkSoft }}>{a.desc} · {a.price}&nbsp;€ HT/{a.unit}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button onClick={() => setAx({ ...ax, [a.id]: Math.max(0, q - 1) })} style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${P.ink}30`, background: 'transparent', cursor: 'pointer' }}>−</button>
                            <span style={{ fontFamily: P.mono, fontSize: 13, minWidth: 18, textAlign: 'center' }}>{q}</span>
                            <button onClick={() => setAx({ ...ax, [a.id]: q + 1 })} style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${P.ink}`, background: P.lime, cursor: 'pointer' }}>+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div style={{ background: P.paper, padding: 28, borderRadius: 20, border: `1px solid ${P.ink}10` }}>
            <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.16em', color: P.inkSoft, marginBottom: 16, textTransform: 'uppercase' }}>4 · Contact (pour recevoir le devis)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { k: 'name', l: 'Nom *', t: 'text', a: 'name' },
                { k: 'email', l: 'Email *', t: 'email', a: 'email' },
                { k: 'company', l: 'Société', t: 'text', a: 'organization' },
              ].map(f => (
                <input key={f.k} type={f.t} autoComplete={f.a} aria-label={f.l} placeholder={f.l} value={info[f.k]} onChange={e => setInfo({ ...info, [f.k]: e.target.value })}
                  style={{ padding: '14px 16px', fontFamily: P.sans, fontSize: 15, border: `1px solid ${P.ink}25`, borderRadius: 12, background: P.bg }} />
              ))}
            </div>
            <div aria-hidden="true" style={{ position: 'absolute', left: -10000, width: 1, height: 1, overflow: 'hidden' }}>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={piege} onChange={e => setPiege(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Sticky summary */}
        <aside style={{ position: narrow ? 'static' : 'sticky', top: 100, alignSelf: 'start', background: P.ink, color: P.bg, padding: 28, borderRadius: 24 }}>
          <div style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.18em', opacity: 0.5, marginBottom: 16, textTransform: 'uppercase' }}>Récapitulatif</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16, borderBottom: `1px solid ${P.bg}25`, fontFamily: P.serif, fontSize: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.7 }}>{plateau.name} · {duration === 'half' ? '½ jour' : `${days} j`}</span>
              <span>{fmt(platTotal)}&nbsp;€ HT</span>
            </div>
            {Object.entries(ax).filter(([_, q]) => q > 0).map(([id, q]) => {
              const a = addons.find(x => x.id === id);
              return (
                <div key={id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, opacity: 0.85 }}>
                  <span>{a.name} ×{q}</span>
                  <span>{fmt(a.price * q)}&nbsp;€ HT</span>
                </div>
              );
            })}
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: P.lime }}>
                <span>Fidélité −10 %</span>
                <span>−{fmt(discount)}&nbsp;€ HT</span>
              </div>
            )}
          </div>
          <div style={{ paddingTop: 16, fontFamily: P.serif, fontSize: 14, display: 'flex', flexDirection: 'column', gap: 6, opacity: 0.85 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>HT</span><span>{fmt(ht)}&nbsp;€</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>TVA 20 %</span><span>{fmt(tva)}&nbsp;€</span></div>
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${P.bg}25`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7 }}>Total TTC</span>
            <span style={{ fontFamily: P.display, fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', color: P.lime }}>{fmt(ttc)}&nbsp;€</span>
          </div>
          <button type="button" onClick={envoyerDevis} disabled={envoi.etat === 'envoi'} aria-disabled={envoi.etat === 'envoi'}
            style={{ marginTop: 20, width: '100%', padding: '16px 22px', background: P.lime, color: P.ink, border: `1.5px solid ${P.lime}`, borderRadius: 999, fontFamily: P.sans, fontSize: 15, fontWeight: 700, cursor: envoi.etat === 'envoi' ? 'wait' : 'pointer', opacity: envoi.etat === 'envoi' ? 0.6 : 1 }}>
            {envoi.etat === 'envoi' ? 'Envoi en cours…' : 'Recevoir mon devis →'}
          </button>
          <p role="status" aria-live="polite" style={{ fontFamily: P.sans, fontSize: 14, lineHeight: 1.5, margin: envoi.msg ? '14px 0 0' : 0, color: P.bg, fontWeight: envoi.etat === 'erreur' || envoi.etat === 'indispo' ? 600 : 400 }}>
            {envoi.msg}
            {envoi.etat === 'indispo' && <> <a href={'mailto:' + CONTACT + '?subject=' + encodeURIComponent('Demande de devis studio')} style={{ color: P.lime }}>Écrire un e-mail</a></>}
          </p>
          <p style={{ fontFamily: P.mono, fontSize: 10, letterSpacing: '0.1em', opacity: 0.5, marginTop: 14, textAlign: 'center' }}>
            Sans engagement · Réponse sous 4h ouvrées
          </p>
        </aside>
      </section>
    </window.PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DevisPage />);
