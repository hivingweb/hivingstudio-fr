// HIVING FOOD — i18n minimal (FR/EN) avec persist localStorage
// Usage : const t = useT(); t('nav.plateaux')

(function () {
  const DICT = {
    fr: {
      'nav.plateaux': 'Plateaux',
      'nav.services': 'Services',
      'nav.tarifs': 'Tarifs',
      'nav.devis': 'Devis instantané',
      'nav.travaux': 'Travaux',
      'nav.carnet': 'Le Carnet',
      'nav.equipe': 'Équipe',
      'nav.presse': 'Presse',
      'nav.contact': 'Contact',
      'nav.reserver': 'Réserver',
      'cta.devis': 'Devis instantané',
      'cta.visite': 'Réserver une visite',
      'cta.discuter': 'Discutons de votre projet',
      'common.from': 'à partir de',
      'common.day': '/jour',
      'common.halfday': '/demi-journée',
      'common.book': 'Réserver',
      'common.learn_more': 'En savoir plus',
      'common.back': '← Retour',
      'common.minutes': 'min de lecture',
      'common.published': 'Publié le',
      'common.see_all': 'Voir tout',
      'footer.tagline': 'Deux plateaux dédiés à la photo et au film culinaire, aux portes de Paris.',
      'footer.contact': 'Contact',
      'footer.legal': 'Mentions légales',
      'footer.address': '4 rue Mozart · 92110 Clichy',
      'footer.hours': '7j/7 · 8h-22h',
    },
    en: {
      'nav.plateaux': 'Stages',
      'nav.services': 'Services',
      'nav.tarifs': 'Pricing',
      'nav.devis': 'Instant quote',
      'nav.travaux': 'Work',
      'nav.carnet': 'Journal',
      'nav.equipe': 'Team',
      'nav.presse': 'Press',
      'nav.contact': 'Contact',
      'nav.reserver': 'Book',
      'cta.devis': 'Instant quote',
      'cta.visite': 'Book a tour',
      'cta.discuter': "Let's discuss your project",
      'common.from': 'from',
      'common.day': '/day',
      'common.halfday': '/half-day',
      'common.book': 'Book',
      'common.learn_more': 'Learn more',
      'common.back': '← Back',
      'common.minutes': 'min read',
      'common.published': 'Published on',
      'common.see_all': 'See all',
      'footer.tagline': 'Two stages dedicated to food photography and film, just outside Paris.',
      'footer.contact': 'Contact',
      'footer.legal': 'Legal',
      'footer.address': '4 rue Mozart · 92110 Clichy',
      'footer.hours': '7 days a week · 8am-10pm',
    },
  };

  function getLang() {
    try {
      return localStorage.getItem('hiving-lang') || 'fr';
    } catch (e) {
      return 'fr';
    }
  }
  function setLang(l) {
    try {
      localStorage.setItem('hiving-lang', l);
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('hiving-lang-change', { detail: l }));
  }

  function t(key, lang) {
    const L = lang || getLang();
    return (DICT[L] && DICT[L][key]) || (DICT.fr && DICT.fr[key]) || key;
  }

  function useT() {
    const [lang, setL] = React.useState(getLang());
    React.useEffect(() => {
      const h = (e) => setL(e.detail);
      window.addEventListener('hiving-lang-change', h);
      return () => window.removeEventListener('hiving-lang-change', h);
    }, []);
    return {
      lang,
      t: (k) => t(k, lang),
      setLang,
    };
  }

  Object.assign(window, { hivingI18n: { t, getLang, setLang, useT, DICT } });
  window.useT = useT;
})();
