// Source du composant React de pages/devis.html.
// Après modification : node scripts/build-jsx.mjs (voir docs/build-jsx.md).
//
// Parcours de réservation en 3 étapes (décision de Maxime, nov. 2026) :
//   1. plateau + date(s)   2. options   3. facturation + « Réserver »
// Envoi : si CRM_RESERVATION_URL (shared/config.js) est rempli, la demande part au CRM Hiving,
// qui crée le devis Pennylane et bloque la date 48 h (docs/reservation-pennylane.md).
// Sinon : e-mail à l'équipe via la fonction Vercel /api/contact (circuit actuel).
const P = window.HIVING_PALETTE;
const fmt = (n) => Math.round(n).toLocaleString('fr-FR');
const CONTACT = 'contact@hivingfood.fr';
const REGLE = 'Votre date est bloquée 48 h. Elle est confirmée à réception du paiement. Sans paiement, pas de prestation.';
// Couleurs et polices de la charte (site-shared.jsx), passées en variables CSS au style de la page
const VARS = {
  '--dv-ink': P.ink, '--dv-soft': P.inkSoft, '--dv-lime': P.lime, '--dv-paper': P.paper, '--dv-cream': P.cream,
  '--dv-bg': P.bg, '--dv-display': P.display, '--dv-sans': P.sans, '--dv-mono': P.mono, '--dv-hand': P.hand,
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isoAujourdhui() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function plusJours(iso, n) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d + n, 12);
}
function libelleDates(iso, jours) {
  if (!iso) return 'date à choisir';
  const d0 = plusJours(iso, 0);
  if (jours <= 1) return d0.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const d1 = plusJours(iso, jours - 1);
  return `du ${d0.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au ${d1.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
}

// Champ de formulaire accessible : libellé lié, aide et erreur annoncées
function Champ({ id, label, req, err, children }) {
  return (
    <div className="dv-champ">
      <label htmlFor={id}>{label}{req ? <span aria-hidden="true"> *</span> : <span className="dv-fac"> (facultatif)</span>}</label>
      {children}
      {err && <p className="dv-err" id={id + '-err'}>{err}</p>}
    </div>
  );
}

function Pas({ n, titre, children }) {
  return (
    <fieldset className="dv-pas">
      <legend><span className="dv-num" aria-hidden="true">{n}</span><span className="dv-sr">Étape {n} sur 3 : </span>{titre}</legend>
      {children}
    </fieldset>
  );
}

function Stepper({ valeur, min, max, onChange, nom }) {
  return (
    <div className="dv-stepper" role="group" aria-label={nom}>
      <button type="button" onClick={() => onChange(Math.max(min, valeur - 1))} disabled={valeur <= min} aria-label={`Retirer : ${nom}`}>−</button>
      <output aria-live="polite">{valeur}</output>
      <button type="button" onClick={() => onChange(Math.min(max, valeur + 1))} disabled={valeur >= max} aria-label={`Ajouter : ${nom}`}>+</button>
    </div>
  );
}

const lireReponse = (r) => r.json().catch(() => ({})).then(d => ({ ok: r.ok, status: r.status, data: d }));
const horsLigne = () => ({ ok: false, status: 0, data: {} });

function DevisPage() {
  const plateaux = window.HIVING_PLATEAUX;
  const addons = window.HIVING_ADDONS_FULL.filter(a => a.price > 0);
  const cats = [...new Set(addons.map(a => a.cat))];

  const [pIdx, setPIdx] = React.useState(() => {
    const q = new URLSearchParams(location.search).get('studio');
    const i = plateaux.findIndex(p => p.slug === 'studio-' + q || p.slug === q);
    return i >= 0 ? i : 0;
  });
  const [date, setDate] = React.useState('');
  const [days, setDays] = React.useState(1);
  const [ax, setAx] = React.useState({});
  const [info, setInfo] = React.useState({ company: '', siren: '', name: '', email: '', address: '', zip: '', city: '', message: '' });
  const [accept, setAccept] = React.useState(false);
  const [errs, setErrs] = React.useState({});
  const [piege, setPiege] = React.useState('');
  const [envoi, setEnvoi] = React.useState({ etat: 'idle', msg: '' }); // idle | envoi | ok | erreur | indispo

  const plateau = plateaux[pIdx];
  const platTotal = plateau.price * days;
  const lignesOptions = Object.entries(ax).filter(([_, q]) => q > 0)
    .map(([id, q]) => ({ a: addons.find(x => x.id === id), q })).filter(l => l.a);
  const optTotal = lignesOptions.reduce((s, l) => s + l.a.price * l.q, 0);
  const ht = platTotal + optTotal;
  const tva = ht * 0.20;
  const ttc = ht + tva;
  const set = (k) => (e) => { setInfo({ ...info, [k]: e.target.value }); if (errs[k]) setErrs({ ...errs, [k]: undefined }); };

  const valider = () => {
    const e = {};
    if (!date) e.date = 'Choisissez le premier jour de votre tournage.';
    else if (date < isoAujourdhui()) e.date = 'Cette date est passée.';
    if (!info.company.trim()) e.company = 'Indiquez votre société : elle figure sur le devis.';
    const siren = info.siren.replace(/[\s.\-]/g, '');
    if (siren && !/^\d{9}$|^\d{14}$/.test(siren)) e.siren = '9 chiffres (SIREN) ou 14 (SIRET). Laissez vide si vous ne l\'avez pas.';
    if (!info.name.trim()) e.name = 'Indiquez votre nom.';
    if (!EMAIL_RE.test(info.email.trim())) e.email = 'Entrez une adresse e-mail valide : le devis y sera envoyé.';
    if (!info.address.trim()) e.address = 'L\'adresse de facturation est obligatoire.';
    if (!info.zip.trim()) e.zip = 'Indiquez le code postal.';
    if (!info.city.trim()) e.city = 'Indiquez la ville.';
    if (!accept) e.accept = 'Merci de confirmer avoir lu les conditions de réservation.';
    return e;
  };

  const reserver = (ev) => {
    ev.preventDefault();
    if (envoi.etat === 'envoi' || envoi.etat === 'ok') return;
    const e = valider();
    setErrs(e);
    const premier = ['date', 'company', 'siren', 'name', 'email', 'address', 'zip', 'city', 'accept'].find(k => e[k]);
    if (premier) {
      setEnvoi({ etat: 'erreur', msg: 'Il manque une information : voir le champ signalé.' });
      const el = document.getElementById('dv-' + premier);
      if (el) el.focus();
      return;
    }
    const email = info.email.trim();
    const siren = info.siren.replace(/[\s.\-]/g, '');
    const crm = (window.HIVING_CONFIG && window.HIVING_CONFIG.CRM_RESERVATION_URL) || '';
    setEnvoi({ etat: 'envoi', msg: 'Envoi en cours…' });

    if (crm) {
      // Nouveau circuit : le CRM crée le devis Pennylane et bloque la date 48 h.
      fetch(crm, {
        method: 'POST', mode: 'cors', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'hivingstudio.fr/pages/devis.html',
          idempotency_key: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2),
          studio_id: plateau.slug.replace(/^studio-/, ''),
          start_date: date, days,
          options: lignesOptions.map(l => ({ catalog: 'site', id: l.a.id, label: l.a.name, qty: l.q, unit: l.a.unit, unit_price_ht: l.a.price })),
          customer: {
            company: info.company.trim(), siren: siren || null, contact_name: info.name.trim(), email,
            billing_address: { line1: info.address.trim(), zip: info.zip.trim(), city: info.city.trim(), country: 'FR' },
          },
          message: info.message.trim() || null,
          client_total_ht: ht,
          accept_conditions: true,
          website: piege,
        }),
      })
        .then(lireReponse, horsLigne)
        .then(res => {
          if (res.ok) {
            const fin = res.data.hold_expires_at ? new Date(res.data.hold_expires_at).toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : null;
            setEnvoi({ etat: 'ok', msg: `C'est noté : votre date est bloquée${fin ? ' jusqu\'au ' + fin : ' 48 h'}. Votre devis Pennylane${res.data.quote_number ? ' N° ' + res.data.quote_number : ''} vous est envoyé par e-mail : signez-le en ligne, puis réglez la facture pour confirmer la réservation.` });
          } else if (res.status === 409) {
            setErrs({ date: 'Cette date n\'est plus libre sur ce plateau.' });
            setEnvoi({ etat: 'erreur', msg: 'Cette date vient d\'être prise sur ce plateau. Choisissez une autre date, ou écrivez-nous.' });
          } else if ((res.status === 400 || res.status === 422) && res.data.error) {
            setEnvoi({ etat: 'erreur', msg: res.data.error });
          } else {
            setEnvoi({ etat: 'indispo', msg: `Réservation en ligne momentanément indisponible, écrivez-nous à ${CONTACT}.` });
          }
        });
      return;
    }

    // Circuit actuel : la demande part par e-mail à l'équipe, qui envoie le devis Pennylane.
    const lignes = [
      'Demande de réservation (hivingstudio.fr/pages/devis.html)', '',
      `Plateau : ${plateau.name}`,
      `Date : ${libelleDates(date, days)} (${days} jour${days > 1 ? 's' : ''}) · ${fmt(platTotal)} € HT`,
      ...lignesOptions.map(l => `Option : ${l.a.name} ×${l.q} · ${fmt(l.a.price * l.q)} € HT`),
      `Total : ${fmt(ht)} € HT (${fmt(ttc)} € TTC)`, '',
      'Facturation',
      `Société : ${info.company.trim()}`,
      `SIREN / SIRET : ${siren || '-'}`,
      `Adresse : ${info.address.trim()}, ${info.zip.trim()} ${info.city.trim()}`,
      ...(info.message.trim() ? ['', `Message : ${info.message.trim()}`] : []),
      '', 'Conditions acceptées : date bloquée 48 h, confirmée à réception du paiement.',
    ];
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: info.name.trim(), email, company: info.company.trim(),
        subject: `Réservation ${plateau.name} · ${info.company.trim()} · ${libelleDates(date, days)} · ${fmt(ht)} € HT`, source: 'devis', message: lignes.join('\n'), website: piege,
      }),
    })
      .then(lireReponse, horsLigne)
      .then(res => {
        if (res.ok) setEnvoi({ etat: 'ok', msg: 'Merci, votre demande est bien partie. Nous vérifions la disponibilité et vous envoyons votre devis Pennylane sous 24 h : la date est alors bloquée 48 h, puis confirmée à réception du paiement.' });
        else if (res.status === 400 && res.data.error) setEnvoi({ etat: 'erreur', msg: res.data.error });
        else setEnvoi({ etat: 'indispo', msg: `Envoi momentanément indisponible, écrivez-nous à ${CONTACT}.` });
      });
  };

  const aria = (k) => ({ id: 'dv-' + k, 'aria-invalid': errs[k] ? 'true' : undefined, 'aria-describedby': errs[k] ? 'dv-' + k + '-err' : undefined });
  const fini = envoi.etat === 'ok';

  return (
    <window.PageShell active="tarifs">
      <window.Breadcrumb items={[{ label: 'Réserver un plateau' }]} />
      <div className="dv" style={VARS}>

      <section className="dv-hero">
        <div className="dv-kick">¶ Réservation · 3 étapes</div>
        <h1>Réservez votre <span className="dv-hand">plateau.</span></h1>
        <p>Plateau, date, options : le prix HT s'affiche tout de suite. Vous recevez ensuite votre devis Pennylane à signer en ligne, puis la facture à régler.</p>
      </section>

      <form className="dv-grille" onSubmit={reserver} noValidate>
        <div className="dv-col">
          <Pas n={1} titre="Plateau et date">
            <div className="dv-plateaux">
              {plateaux.map((p, i) => (
                <label key={p.slug} className={'dv-plateau' + (i === pIdx ? ' on' : '')}>
                  <input type="radio" name="plateau" value={p.slug} checked={i === pIdx} onChange={() => setPIdx(i)} />
                  <span className="dv-pn">{p.name}</span>
                  <span className="dv-pt">{p.tagline}</span>
                  <span className="dv-pp">{fmt(p.price)}&nbsp;€ HT / jour</span>
                </label>
              ))}
            </div>
            <div className="dv-ligne2">
              <Champ id="dv-date" label="Premier jour" req err={errs.date}>
                <input type="date" min={isoAujourdhui()} value={date} onChange={e => { setDate(e.target.value); setErrs({ ...errs, date: undefined }); }} {...aria('date')} />
              </Champ>
              <div className="dv-champ">
                <span className="dv-lbl">Nombre de jours</span>
                <Stepper valeur={days} min={1} max={10} onChange={setDays} nom="Nombre de jours" />
              </div>
            </div>
            <p className="dv-aide">Journée de 8 h à 22 h, jours consécutifs. Demi-journée, horaires sur mesure, équipe de production ou décor modifié : <a href={`mailto:${CONTACT}?subject=${encodeURIComponent('Demande sur mesure · location de plateau')}`}>écrivez-nous</a>.</p>
          </Pas>

          <Pas n={2} titre="Options (facultatif)">
            {cats.map(cat => (
              <div key={cat} className="dv-cat">
                <h3>{cat}</h3>
                <ul>
                  {addons.filter(a => a.cat === cat).map(a => {
                    const q = ax[a.id] || 0;
                    return (
                      <li key={a.id} className={q > 0 ? 'on' : ''}>
                        <div className="dv-opt">
                          <span className="dv-on">{a.name}</span>
                          <span className="dv-od">{a.desc} · {fmt(a.price)}&nbsp;€ HT / {a.unit}</span>
                        </div>
                        <Stepper valeur={q} min={0} max={30} onChange={v => setAx({ ...ax, [a.id]: v })} nom={a.name} />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </Pas>

          <Pas n={3} titre="Facturation">
            <div className="dv-ligne2">
              <Champ id="dv-company" label="Société" req err={errs.company}>
                <input type="text" autoComplete="organization" maxLength={160} value={info.company} onChange={set('company')} {...aria('company')} />
              </Champ>
              <Champ id="dv-siren" label="SIREN" err={errs.siren}>
                <input type="text" inputMode="numeric" autoComplete="off" maxLength={20} value={info.siren} onChange={set('siren')} {...aria('siren')} />
              </Champ>
              <Champ id="dv-name" label="Nom et prénom" req err={errs.name}>
                <input type="text" autoComplete="name" maxLength={120} value={info.name} onChange={set('name')} {...aria('name')} />
              </Champ>
              <Champ id="dv-email" label="E-mail" req err={errs.email}>
                <input type="email" autoComplete="email" maxLength={254} value={info.email} onChange={set('email')} {...aria('email')} />
              </Champ>
            </div>
            <Champ id="dv-address" label="Adresse de facturation" req err={errs.address}>
              <input type="text" autoComplete="street-address" maxLength={200} placeholder="N° et rue" value={info.address} onChange={set('address')} {...aria('address')} />
            </Champ>
            <div className="dv-ligne2">
              <Champ id="dv-zip" label="Code postal" req err={errs.zip}>
                <input type="text" autoComplete="postal-code" inputMode="numeric" maxLength={12} value={info.zip} onChange={set('zip')} {...aria('zip')} />
              </Champ>
              <Champ id="dv-city" label="Ville" req err={errs.city}>
                <input type="text" autoComplete="address-level2" maxLength={120} value={info.city} onChange={set('city')} {...aria('city')} />
              </Champ>
            </div>
            <Champ id="dv-message" label="Un mot sur votre projet">
              <textarea id="dv-message" rows={3} maxLength={2000} value={info.message} onChange={set('message')} />
            </Champ>
            <div aria-hidden="true" className="dv-piege">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={piege} onChange={e => setPiege(e.target.value)} />
            </div>
          </Pas>
        </div>

        <aside className="dv-recap" aria-labelledby="dv-recap-titre">
          <h2 id="dv-recap-titre">Récapitulatif</h2>
          <dl>
            <div><dt>{plateau.name}</dt><dd>{fmt(platTotal)}&nbsp;€</dd></div>
            <div className="dv-sub"><dt>{libelleDates(date, days)}</dt><dd>{days}&nbsp;j × {fmt(plateau.price)}&nbsp;€</dd></div>
            {lignesOptions.map(l => (
              <div key={l.a.id} className="dv-sub"><dt>{l.a.name} ×{l.q}</dt><dd>{fmt(l.a.price * l.q)}&nbsp;€</dd></div>
            ))}
          </dl>
          <div className="dv-total"><span>Total HT</span><strong>{fmt(ht)}&nbsp;€</strong></div>
          <p className="dv-ttc">TVA 20 % : {fmt(tva)} € · soit {fmt(ttc)} € TTC</p>

          <div className="dv-regle" role="note">
            <strong>Conditions</strong>
            <p>{REGLE}</p>
            <p>Vous recevez un devis Pennylane à signer en ligne, puis la facture avec son lien de paiement.</p>
          </div>
          <div className="dv-accept">
            <input type="checkbox" checked={accept} onChange={e => { setAccept(e.target.checked); setErrs({ ...errs, accept: undefined }); }} {...aria('accept')} />
            <label htmlFor="dv-accept">J'ai lu les <a href="tarifs.html">conditions de réservation</a> et je les accepte.</label>
          </div>
          {errs.accept && <p className="dv-err" id="dv-accept-err">{errs.accept}</p>}

          <button type="submit" className="dv-go" disabled={envoi.etat === 'envoi' || fini}>
            {envoi.etat === 'envoi' ? 'Envoi en cours…' : fini ? 'Demande envoyée ✓' : 'Réserver →'}
          </button>
          <p role="status" aria-live="polite" className={'dv-statut' + (envoi.etat === 'erreur' || envoi.etat === 'indispo' ? ' fort' : '')}>
            {envoi.msg}
            {envoi.etat === 'indispo' && <> <a href={'mailto:' + CONTACT + '?subject=' + encodeURIComponent('Réservation studio')}>Écrire un e-mail</a></>}
          </p>
        </aside>
      </form>
      </div>
    </window.PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DevisPage />);
