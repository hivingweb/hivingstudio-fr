# Équipe d'agents Claude Code — Hiving Studio

Ce dépôt contient des **sous-agents** Claude Code dans `.claude/agents/` : des assistants spécialisés, chacun avec ses règles et ses outils. Toute personne de l'équipe qui ouvre ce dépôt dans Claude Code peut les appeler en les nommant dans sa demande. Ils respectent tous `CLAUDE.md` (la loi du dépôt), travaillent sur une branche `modif/...` et ne poussent jamais sur `main`.

## Les 10 agents

| Agent | Rôle | Quand l'appeler | Exemple de phrase à taper dans Claude Code |
|---|---|---|---|
| `seo` | Audit et corrections SEO on-page (title, description, h1, canonical, Open Graph, sitemap, données structurées, liens internes, llms.txt) et visibilité IA (GEO) | Avant une mise en ligne, après une nouvelle page, ou pour un audit régulier | « utilise l'agent seo pour auditer la page /pages/tarifs.html » |
| `sea` | Prépare des campagnes Google Ads / Meta Ads (structure, mots-clés, annonces, landing pages, budgets en € HT, suivi des conversions) dans `docs/sea/`, sans rien lancer ni dépenser | Quand on envisage de la publicité payante | « utilise l'agent sea pour préparer une campagne Google Ads sur louer un studio photo culinaire à Paris avec 600 € HT par mois » |
| `social-media` | Calendrier éditorial et posts (LinkedIn de Maxime, Instagram et TikTok Hiving Studio) tirés du site, dans `docs/social/` ; ne publie jamais | Chaque mois, ou après un nouveau cas client ou une nouvelle page | « utilise l'agent social-media pour préparer le calendrier du mois prochain à partir de pages/case-picard.html » |
| `contenu` | Rédige pages et articles SEO : brief → plan → texte → balises | Pour créer ou réécrire une page ou un article | « utilise l'agent contenu pour rédiger un article sur : louer un studio photo culinaire à Paris » |
| `dev` | Développement front (HTML, CSS, JavaScript), redirections `vercel.json`, aucun code serveur, tests avant push | Pour une correction d'affichage, une nouvelle section, une redirection | « utilise l'agent dev pour corriger l'affichage mobile de la page /pages/tarifs.html » |
| `relecteur` | Relit une branche (règles du CLAUDE.md, liens morts, accessibilité, fautes, cohérence des faits) et rend un verdict OK / à corriger, sans rien modifier | Toujours, avant d'envoyer une preview à Maxime | « utilise l'agent relecteur pour relire la branche modif/nom-de-la-branche » |
| `creatif` | Directeur artistique : concepts de campagnes, visuels HTML/CSS exportés en PNG/PDF (Chromium), carrousels, gabarits, dans la charte (variables de `shared/ui.css`, logos d'origine de `assets/`), livrés dans `docs/creatif/` ; aucune photo de personne réelle ni chiffre non validés | Pour un lancement, une série de posts, une fiche technique ou un gabarit réutilisable | « utilise l'agent creatif pour faire un carrousel Instagram présentant les 2 plateaux avec les tarifs publiés » |
| `geo` | Visibilité dans les IA (ChatGPT, Perplexity, Gemini, AI Overviews) : `llms.txt`, données structurées, faits cohérents entre hiving.me, hivingfood.fr et hivingstudio.fr, pages « à propos », test mensuel de 10 questions × 4 IA dans `docs/geo/suivi.md` | Chaque mois pour le test, et après toute nouvelle page ou tout changement de tarif | « utilise l'agent geo pour faire le test GEO du mois et proposer les corrections » |
| `analyste` | Lit les exports Search Console / GA4 déposés dans `docs/data/` et écrit le rapport mensuel dans `docs/analyse/` (positions, pages qui montent ou descendent, actions) ; ne se connecte à aucun compte | Début de mois, une fois les exports CSV déposés par Maxime | « utilise l'agent analyste pour le rapport d'octobre à partir des CSV de docs/data/ » |
| `veille` | Veille concurrentielle et sectorielle (studios concurrents, prix de location, salons, loi influence, tendances des contenus food) par recherche web, avec sources, dans `docs/veille/AAAA-MM.md` | Chaque mois, ou avant de revoir les tarifs | « utilise l'agent veille pour la note de veille de novembre » |

## Circuit type d'une nouvelle page

1. **contenu** rédige la page sur une branche `modif/...`.
2. **seo** vérifie et corrige les balises, le sitemap, les liens et les données structurées.
3. **relecteur** relit la branche et rend son verdict (corriger tant que ce n'est pas « OK »).
4. **Preview Vercel** : la branche poussée a sa propre adresse de prévisualisation, à ouvrir et à envoyer.
5. **Validation de Maxime** sur la preview.
6. **Fusion** dans `main` (mise en ligne), seulement après cette validation.

Pour une campagne (`sea`) ou des posts (`social-media`) : livraison dans `docs/sea/` ou `docs/social/`, relecture, puis Maxime décide et agit lui-même (aucun lancement, aucune publication, aucun compte créé par un agent).

## Circuit mensuel (visibilité et pilotage)

1. **veille** livre la note du mois dans `docs/veille/` (studios concurrents, prix, salons, loi, tendances).
2. **analyste** lit les exports déposés par Maxime dans `docs/data/` et livre le rapport dans `docs/analyse/`.
3. **geo** fait le test 10 questions × 4 IA dans `docs/geo/suivi.md` et corrige `llms.txt` et les données structurées sur une branche.
4. Les actions retenues partent vers **contenu**, **seo**, **dev**, **sea**, **social-media** ou **creatif** (visuels dans `docs/creatif/`).
5. **relecteur** relit chaque branche, puis **preview Vercel**, **validation de Maxime** et **fusion**.

Attention : le dépôt est public. Les exports de `docs/data/` ne doivent contenir aucune donnée personnelle ni chiffre confidentiel ; les visuels de `docs/creatif/` n'utilisent que des photos et chiffres déjà validés par Maxime.

## Rappels

- Jamais de push sur `main` sans validation, jamais `--force`, jamais de secret, jamais de modification DNS / MX.
- Tout compte à créer : propriétaire = le compte de Maxime.
- Aucun accès pour les anciens stagiaires et collaborateurs partis.
- Modifier un agent : éditer son fichier dans `.claude/agents/`, sur une branche, avec une ligne dans `docs/journal.md`.
