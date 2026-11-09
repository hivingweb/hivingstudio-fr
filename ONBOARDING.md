# Onboarding — modifier Hiving Studio (hivingstudio.fr) avec Claude Code

> Pour : toute personne de l'équipe qui modifie le site, **développeuse ou non**.
> Dépôt : `hivingweb/hivingstudio-fr` · Valideur : **Maxime** · Contact technique : Maxime
> Tu n'as pas besoin de savoir coder : Claude Code fait les modifications, toi tu décides et tu vérifies.

---

## 0. En une phrase

Le site vit dans un dépôt GitHub ; dès qu'une modification arrive sur la branche `main`, Vercel la met en ligne toute seule. Tu travailles donc toujours **sur une branche** (copie de travail avec sa propre adresse de prévisualisation), et on ne passe sur `main` qu'après validation.

Trois mots à connaître :
- **Commit** : un enregistrement de modifications, avec un message qui dit ce qu'on a fait.
- **Branche** : une copie de travail du site, isolée de la version en ligne.
- **Preview** : l'adresse Vercel qui montre ta branche comme si elle était en ligne, sans toucher au vrai site.

---

## 1. Installation (une fois)

1. **GitHub** : crée un compte si besoin, puis ouvre l'e-mail « You've been invited to collaborate on hivingweb/hivingstudio-fr » et clique **Accept invitation**. Sans ça, impossible de récupérer ou d'envoyer le site.
2. **Vercel** : accepte l'invitation à l'équipe « Hiving », puis dans Vercel → Account Settings → **Authentication / Login Connections**, relie ton compte GitHub. Sans ça, tes modifications sont bloquées (« Blocked », code `TEAM_ACCESS_REQUIRED`).
3. **Outils** : installe Git, Node.js (version LTS) et **Claude Code** (app Claude, onglet Code, ou le CLI). Lien d'installation auprès de Maxime.
4. **Récupère le site** :
   ```bash
   git clone https://github.com/hivingweb/hivingstudio-fr.git
   cd hivingstudio-fr
   ```
5. Ouvre Claude Code dans ce dossier. Il lit seul le fichier `CLAUDE.md` (les règles du site). Lis-le aussi une fois, surtout les sections 4 (URL et SEO) et 7 (interdits).

---

## 2. Voir le site sur ton ordinateur

```bash
npx serve .          # puis ouvre http://localhost:3000
```
Pour tester aussi les redirections de `vercel.json` : `npx vercel dev`. Tu peux simplement demander à Claude : « lance le site en local ».

---

## 3. La boucle de travail (à chaque modification)

1. **Démarre la session** : dis à Claude « récupère les dernières modifs et fais-moi le point ». Il fait `git pull` et te résume en quelques lignes ce que les autres ont changé.
2. **Crée une branche** : « crée une branche pour {{exemple : changer les tarifs du studio}} ».
3. **Demande la modification** en français, simplement. Une chose à la fois. Claude explique ce qu'il fait et te dit quoi vérifier.
4. **Vérifie en local** (étape 2) si tu veux.
5. **Envoie la branche** : « commit et pousse la branche ». Vercel crée une **URL de preview** (Claude te la donne ; elle est aussi dans le commentaire Vercel sur GitHub).
6. **Fais relire** : envoie l'URL de preview à Maxime. Ordinateur **et** téléphone.
7. **Mise en ligne** : une fois validé, « fusionne dans main et pousse ». Le site hivingstudio.fr est à jour en une à deux minutes. Ouvre-le pour vérifier.

Petites modifications, une par branche : c'est plus simple à relire et à annuler.

---

## 4. Qui valide quoi

| Changement | Qui valide avant la mise en ligne |
|---|---|
| Texte, photo, correction de coquille | Maxime sur la preview |
| Nouvelle page, page supprimée ou renommée (URL) | Maxime + redirection obligatoire (Claude s'en charge) |
| Tarifs, mentions légales, CGV, noms de talents ou de clients | Maxime |
| Charte (couleurs, polices, logo) | Maxime |
| Domaine, DNS, réglages Vercel, outil tiers (analytics, formulaire) | Maxime — **jamais seul** |

---

## 5. Règles d'or

- Toujours commencer par récupérer les modifs des autres (étape 3.1).
- Jamais de travail non validé sur `main` : `main` = le site en ligne.
- Si Claude parle de `--force`, de supprimer l'historique ou de toucher aux DNS / e-mails : **refuse et préviens Maxime**.
- Ne colle jamais un mot de passe ou une clé dans la conversation.
- Un doute, un message d'erreur incompréhensible : arrête-toi, copie le message à Maxime.

## 6. En cas de pépin

- **« Blocked » / `TEAM_ACCESS_REQUIRED` sur Vercel** : ton compte GitHub n'est pas relié à Vercel (étape 1.2).
- **« Permission denied » / « Repository not found » sur GitHub** : invitation non acceptée (étape 1.1).
- **Push refusé** : quelqu'un a envoyé avant toi. Dis à Claude « récupère et repousse » (jamais de `--force`).
- **Le site en ligne est cassé** : demande à Claude « annule le dernier commit sur main » (`git revert`, qui crée un commit d'annulation propre), puis préviens Maxime. Vercel permet aussi de revenir au déploiement précédent en un clic (Instant Rollback).
