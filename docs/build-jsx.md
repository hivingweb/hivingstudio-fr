# Recompiler les composants React des pages publiques

Les pages publiques de `pages/` (plateaux, tarifs, devis, services, articles…) n'utilisent plus Babel dans le navigateur : leur code React est **précompilé** en petits fichiers `.js` minifiés. Le navigateur n'a plus à télécharger Babel (3 Mo) ni à traduire le code à chaque visite : les pages s'affichent beaucoup plus vite.

Les espaces `/pro/`, `/app/` et l'admin ne sont **pas** concernés (ils gardent leur fonctionnement actuel).

## Où modifier quoi

| Ce que vous modifiez | Fichier source à éditer |
|---|---|
| Menu, pied de page, composants communs | `site-shared.jsx` |
| Données (plateaux, tarifs, carnet, équipe…) | `site-data.jsx` |
| Traductions FR/EN | `site-i18n.jsx` |
| Contenu d'une page (ex. tarifs) | `pages/src/tarifs.jsx` |

Les fichiers de `js/` sont **générés** : ne pas les modifier à la main.

## La commande (une seule)

Depuis la racine du dépôt, après toute modification d'un des fichiers ci-dessus :

```bash
node scripts/build-jsx.mjs
```

Elle :
1. compile chaque `.jsx` en `.js` minifié dans `js/` (avec esbuild, téléchargé à la volée par `npx` en version épinglée ; rien n'est ajouté au site) ;
2. met à jour le `?v=…` des balises `<script>` dans les pages HTML, pour que les navigateurs prennent bien la nouvelle version (ces fichiers sont mis en cache un an).

Committer ensuite les `.jsx` **et** les fichiers `js/` et `.html` modifiés dans le même commit.

## Vérifier

```bash
npx serve .        # puis ouvrir http://localhost:3000/pages/tarifs.html
```

La page doit s'afficher comme avant, sans erreur dans la console du navigateur.

## Bon à savoir

- React est chargé en version **production** minifiée, épinglée (18.3.1), avec contrôle d'intégrité (`integrity="sha384-…"`). Ne jamais passer en `@latest`.
- Chaque page garde dans `<div id="root">` un court contenu de secours (h1 + texte) lu par Google ; React le remplace à l'affichage.
