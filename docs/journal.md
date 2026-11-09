# Journal — hivingstudio.fr

Le plus récent en haut : date, qui, quoi.

- 2026-11-09 · Maxime (avec Claude) · SEO (branche modif/seo-hivingstudio, à valider sur la preview) : images de partage manquantes remplacées par img/ph/pro-1.jpg ; balises Open Graph et twitter:card ajoutées sur toutes les pages du sitemap ; titres et descriptions raccourcis (accueil, photo culinaire, packshot, tarifs, la-table, la-cuisine) ; contenu de secours (h1 + texte déjà présent sur le site) dans le conteneur React des pages, remplacé au rendu ; CLAUDE.md : mention périmée du sitemap corrigée. Aucun tarif, CGV ni mention légale modifié.
- 2026-11-09 · Maxime (avec Claude) · robots.txt : retrait de « Disallow: /*.jsx$ », qui empêchait Google de lire le texte des pages (rendu par React depuis les .jsx) et les lui faisait voir vides.
- 2026-11-09 · Maxime (avec Claude) · CLAUDE.md : règle permanente, les anciens stagiaires et collaborateurs partis n'ont aucun accès ; toute trace trouvée est retirée.
- 2026-11-09 · Maxime (avec Claude) · Search Console : fichier de validation googlea3c44b681c8cc04f.html ajouté pour le compte maximebolleaupro@gmail.com (reprise des accès après le départ de Baptiste). Ne pas supprimer ce fichier.
- 2026-11-09 · Maxime (avec Claude) · Domaine principal : hivingstudio.fr partout (canonical, og:url, données structurées, liens internes, sitemap, robots) au lieu de hiving.food / hivingstudio.com, qui redirigent ici.
- 2026-11-09 · Maxime (avec Claude) · Mentions légales et confidentialité : hébergeur OVH remplacé par Vercel Inc. (validé par Maxime). Les e-mails restent chez OVH ou Google.
- 2026-11-09 · Maxime (avec Claude) · Vidéos et modèles 3D envoyés sur Vercel Blob (hiving-sites-medias) ; redirections .mp4/.glb ajoutées dans vercel.json ; adresses dans docs/medias.md.
- 2026-11-09 · Maxime (avec Claude) · Import initial depuis la sauvegarde OVH : code du site seul (sans PHP, secrets ni médias lourds), ajout de CLAUDE.md, ONBOARDING.md et vercel.json (redirections et en-têtes repris du .htaccess).
