// Source du composant React de pages/faq.html.
// Après modification : node scripts/build-jsx.mjs (voir docs/build-jsx.md).
// Les questions et réponses ne sont écrites qu'à un seul endroit : le bloc JSON-LD
// <script type="application/ld+json" id="ld-faq"> de pages/faq.html (lu par Google ET par ce composant).
// Règle : uniquement des faits déjà publiés sur le site ; sinon « écrivez-nous ».
const P = window.HIVING_PALETTE;

function readFaq() {
  try {
    const ld = JSON.parse(document.getElementById('ld-faq').textContent);
    return ld.mainEntity.map((q) => ({ q: q.name, a: q.acceptedAnswer.text }));
  } catch (e) {
    return [];
  }
}

// Mettre en lien l'adresse e-mail dans les réponses
function withMail(text) {
  const mail = 'contact@hivingfood.fr';
  const parts = text.split(mail);
  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {part}
      {i < parts.length - 1 && <a href={`mailto:${mail}`} style={{ color: P.ink }}>{mail}</a>}
    </React.Fragment>
  ));
}

function FaqPage() {
  const narrow = window.useHivingNarrow(760);
  const [faq] = React.useState(readFaq);
  const pad = narrow ? '20px' : '40px';

  return (
    <window.PageShell active="faq">
      <window.Breadcrumb items={[{ label: 'FAQ' }]} />

      <section style={{ padding: `${narrow ? 40 : 60}px ${pad} 48px`, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontFamily: P.mono, fontSize: 11, letterSpacing: '0.18em', color: P.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>
          ¶ Questions fréquentes · {faq.length} réponses
        </div>
        <h1 style={{ fontFamily: P.display, fontSize: 'clamp(42px, 8vw, 110px)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 0.95, margin: 0 }}>
          Vos questions,<br />
          <span style={{ ...window.HIVING_HAND_ON_LIGHT, transform: 'rotate(-2deg)', display: 'inline-block' }}>nos réponses.</span>
        </h1>
        <p style={{ fontFamily: P.serif, fontSize: 'clamp(18px, 1.8vw, 22px)', lineHeight: 1.5, color: P.inkSoft, marginTop: 24, maxWidth: 720 }}>
          Accès, horaires, plateaux, matériel, réservation et annulation : tout ce qu'il faut savoir avant de louer le Studio Pro ou le Studio Famille, à Clichy.
        </p>
      </section>

      <section style={{ padding: `0 ${pad} ${narrow ? 64 : 100}px`, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {faq.map((f, i) => (
            <details key={i} style={{ background: P.cream, padding: narrow ? '18px 20px' : '22px 28px', borderRadius: 16 }}>
              <summary style={{
                fontFamily: P.display, fontSize: narrow ? 19 : 22, fontWeight: 600, letterSpacing: '-0.01em',
                cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
              }}>
                <h2 style={{ font: 'inherit', margin: 0 }}>{f.q}</h2>
                <span aria-hidden="true" style={{ fontSize: 26, color: P.ink, flex: '0 0 auto' }}>+</span>
              </summary>
              <p style={{ fontFamily: P.serif, fontSize: 18, lineHeight: 1.6, color: P.inkSoft, margin: '14px 0 0' }}>
                {withMail(f.a)}
              </p>
            </details>
          ))}
        </div>
        <p style={{ fontFamily: P.serif, fontSize: 18, lineHeight: 1.55, color: P.inkSoft, marginTop: 40 }}>
          Votre question n'y est pas ? Écrivez-nous à <a href="mailto:contact@hivingfood.fr" style={{ color: P.ink }}>contact@hivingfood.fr</a>.
          À lire aussi : <a href="location-studio-cuisine-paris.html" style={{ color: P.ink }}>location de studio cuisine à Paris</a>,{' '}
          <a href="studio-tournage-recette.html" style={{ color: P.ink }}>tournage de recettes</a>,{' '}
          <a href="studio-cuisine-createurs.html" style={{ color: P.ink }}>studio pour créateurs</a>,{' '}
          <a href="tarifs.html" style={{ color: P.ink }}>tarifs</a>.
        </p>
      </section>

      <window.BigCTA
        eyebrow="Prêt à tourner ?"
        title="On cale"
        hand="votre date."
        ctaLabel="Devis instantané"
        ctaHref="devis.html"
        ctaSecondaryLabel="Voir les plateaux"
        ctaSecondaryHref="plateaux.html"
      />
    </window.PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FaqPage />);
