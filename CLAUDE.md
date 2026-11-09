# CLAUDE.md — Hiving Studio (hivingstudio.fr)

Ce fichier est lu automatiquement par Claude Code au début de chaque session. C'est la **loi du dépôt** : il gagne sur la mémoire et les habitudes. Dépôt : `hivingweb/hivingstudio-fr`. Valideur du site : **Maxime**.

## 1. Le site en 3 lignes

- Hiving Studio est le site de Hiving Studio : 2 plateaux cuisine à louer à Clichy (page publique, espace pro de réservation/devis `/pro/`, espace membres `/app/`, admin) .
- Public visé : créateurs, marques et productions qui louent un studio food. Objectif principal : demande de réservation / devis.
- Site **statique** (HTML, CSS, JavaScript) servi par Vercel ; aucun code serveur (PHP) : voir §7.

## 2. Stack

- HTML / CSS / JavaScript sans étape de construction (aucun `npm run build`). Composants React en `.jsx` transpilés dans le navigateur ; supabase-js chargé depuis jsdelivr ; l'espace pro, l'admin et la connexion utilisent **la base Supabase du CRM** (voir §2 bis).
- Hébergement : **Vercel**, équipe « Hiving », projet `hivingstudio-fr`, relié à `hivingweb/hivingstudio-fr`, branche de production `main`.
- Configuration Vercel : `vercel.json` à la racine (redirections, en-têtes de sécurité, `cleanUrls` / `trailingSlash`).
- E-mails : restent chez **OVH (MX Plan)** (OVH ou Google). Le site n'y touche pas.
- Pas de dépendance ajoutée sans la justifier en une phrase dans le commit.

## 2 bis. Dépendances à ne pas casser

- **Base Supabase du CRM** (projet `pmrqrbjxikljlarhkseu`) : ce site la lit depuis le navigateur avec la clé **publique** (publishable/anon). Cette base appartient au CRM Hiving : **ne jamais y créer, modifier ou supprimer quoi que ce soit depuis ce dépôt** (ni table, ni policy, ni migration). Ne jamais mettre la clé `service_role` dans le site. Un besoin côté base → demander à Milan.
- **Médias lourds sur Vercel Blob** : vidéos, modèles 3D et fichiers de plus de 15 Mo ne vont **jamais** dans Git (GitHub refuse au-delà de 100 Mo et le dépôt deviendrait impossible à cloner). On les envoie sur Vercel Blob et on met leur adresse dans le code. Liste et adresses : `docs/medias.md`.
- **E-mails** : les enregistrements MX/SPF/DKIM/DMARC du domaine sont hors de ce dépôt et ne doivent jamais être modifiés.

## 3. Arborescence

```
/
├── index.html                 # page publique (ancres)
├── pro/ · app/ · admin.html · admin/   # espace pro, espace membres, admin (Supabase CRM)
├── *.jsx                      # composants React (site-*, v3-*, admin-*, shared…)
├── pages/                     # anciennes pages HIVING FOOD (hiving.food) servies ici — à trier, ne pas supprimer sans redirection
├── img/ · assets/ · shared/ · devis/
├── video/ · videos/           # sur Vercel Blob (voir docs/medias.md)
├── sitemap.xml (adresses en https://hivingstudio.fr/…) · robots.txt · llms.txt
├── vercel.json · CLAUDE.md · ONBOARDING.md
└── docs/  (journal.md, decisions/, urls.md, medias.md)
```

## 4. Règles de contenu et SEO (non négociables)

1. **Ne jamais casser une URL existante.** Renommer, déplacer ou supprimer une page = ajouter dans le même commit une redirection permanente dans `vercel.json` :
   ```json
   { "redirects": [ { "source": "/ancienne-page.html", "destination": "/nouvelle-page", "permanent": true } ] }
   ```
   La liste de référence des URL est `docs/urls.md` ; la mettre à jour dans le même commit.
2. Les anciennes règles `.htaccess` (OVH) **ne fonctionnent pas sur Vercel** : toute redirection vit dans `vercel.json`.
3. **`sitemap.xml`** : toute page ajoutée ou retirée met à jour le sitemap dans le même commit (adresses absolues en `https://hivingstudio.fr/…`).
4. **Chaque page** a : un `<title>` unique (moins de 60 caractères), une `<meta name="description">` unique (moins de 160), un seul `<h1>`, `<html lang="fr">`, une balise `<link rel="canonical">`, les balises Open Graph (`og:title`, `og:description`, `og:image`).
5. **Images** : attribut `alt` descriptif (vide `alt=""` seulement pour une image décorative), `width` et `height` renseignés, `loading="lazy"` sous la ligne de flottaison.
6. Pas de texte important dans une image. Pas de lien mort : vérifier les liens internes avant de pousser.
7. Pages talents / références clients : ne publier un nom, une photo ou un chiffre que s'il est validé par Maxime.
8. Mentions légales et politique de confidentialité : ne pas modifier sans accord de Maxime.

## 5. Charte Hiving Studio

- Couleurs : celles de `shared.jsx` / `site-shared.jsx` — définies **une seule fois** comme variables CSS dans le fichier de styles indiqué ; jamais de couleur en dur ailleurs.
- Polices : celles chargées depuis Google Fonts, déclarées à un seul endroit.
- Logo : fichiers d'origine du dépôt, jamais recolorés ni déformés.
- Ton : vouvoiement, premium.
- Après un changement de couleur : vérifier le contraste (niveau AA).

## 6. Travailler à plusieurs

Plusieurs personnes, chacune avec son Claude Code, modifient ce dépôt. Pour ne pas s'écraser :

- **Avant toute modification** : `git pull`. Si `git status` montre des fichiers modifiés qu'on n'a pas faits : s'arrêter et demander.
- **Début de session**, juste après le `git pull` : faire un **mini compte rendu en 3 à 5 lignes simples** de ce que les autres ont changé (`git log --oneline -20`, `git show --stat`, haut de `docs/journal.md`), en signalant ce qui demande attention (URL changée, page supprimée, mise en ligne). Rien de nouveau : le dire en une ligne.
- **Travailler sur une branche** : `git switch -c modif/sujet-court`. Chaque push d'une branche crée une **URL de prévisualisation** Vercel : c'est elle qu'on envoie pour relecture.
- **Pousser sur `main` = mettre en ligne** sur hivingstudio.fr en une à deux minutes. Seulement ce que Maxime a validé sur la preview.
- **Petits commits**, un sujet chacun, message clair en français (« Page studio : nouveaux tarifs 2027 »), poussés aussitôt.
- Push refusé : `git pull`, vérifier, repousser. **Jamais `--force`.**
- Écrire journal, docs et messages de commit avec l'outil d'édition de fichier, jamais via une commande terminal contenant des accents graves ou caractères spéciaux.
- Toute modification notable : une ligne en haut de `docs/journal.md` (date, qui, quoi) dans le même commit.

### Avec une personne non développeuse

Explications en français, chaque terme technique expliqué en une phrase la première fois. Une étape à la fois ; à la fin : résumé en 5 lignes, **l'URL de preview à ouvrir et quoi y regarder**, puis attendre la validation avant de fusionner. Décision non tranchée : deux options, avantages et inconvénients, une recommandation, et attendre.

## 7. Interdits

- Ne jamais mettre de clé, mot de passe ou jeton dans le code ; jamais committer `.env*` (sauf `.env.example`). Ne jamais demander un secret dans la conversation.
- **Ne jamais toucher aux DNS** (zone OVH), en particulier aux enregistrements **MX, SPF, DKIM, DMARC** : les e-mails en dépendent. Toute question DNS → demander à Maxime.
- Ne jamais modifier les réglages du projet ou de l'équipe Vercel (domaines, membres, facturation) sans accord.
- Ne jamais supprimer ou renommer une page sans redirection (§4).
- Ne jamais pousser sur `main` un travail non validé ; jamais `git push --force` ; jamais réécrire l'historique de `main`.
- Ne jamais ajouter de script de suivi, pixel ou outil tiers (analytics, chat, cookies) sans accord : bannière de consentement et RGPD en dépendent.
- Pas de PHP ni de code serveur : Vercel ne l'exécute pas comme OVH. Un formulaire passe par la base Supabase déjà utilisée (CRM) — aucune nouvelle table sans accord de Milan.
- Ne jamais changer le texte des mentions légales, des CGV ou des tarifs de son propre chef : signaler et attendre.
- **Anciens stagiaires et collaborateurs partis** : aucun accès (GitHub, Vercel, Supabase, Google, sites). Ne jamais les inviter ni leur rendre de droits ; toute trace trouvée (membre, propriétaire, fichier de validation, e-mail dans le code) est retirée et signalée à Maxime, qui tient la liste des noms hors de ce dépôt (le dépôt est public).

## 8. Commandes utiles

```bash
git pull                          # récupérer le travail des autres
git switch -c modif/sujet         # créer une branche de travail
npx serve .                       # voir le site en local (http://localhost:3000)
npx vercel dev                    # en local avec redirections et en-têtes de vercel.json
git add -A && git commit          # enregistrer (message en français)
git push -u origin modif/sujet    # envoyer la branche → URL de preview Vercel
git switch main && git pull && git merge modif/sujet && git push   # mise en ligne (après validation)
git log --oneline -20             # ce qui a changé récemment
npx vercel --prod                 # secours seulement : mise en ligne manuelle
```

Condition de mise en ligne : l'auteur GitHub du commit doit être relié à un compte Vercel membre de l'équipe « Hiving », sinon le déploiement est « Blocked » (`TEAM_ACCESS_REQUIRED`).

## 9. Équipe d'agents

Dix sous-agents Claude Code (`seo`, `sea`, `social-media`, `contenu`, `dev`, `relecteur`, `creatif`, `geo`, `analyste`, `veille`) sont dans `.claude/agents/` ; ils appliquent ce fichier.
Rôles, phrases d'exemple et circuit type (contenu → seo → relecteur → preview → validation de Maxime → fusion) : voir `docs/equipe-agents.md`.
