# Formulaires — hivingstudio.fr

## État des lieux (9 novembre 2026)

| Formulaire | Comment il envoie | Décision |
|---|---|---|
| Espace pro `/pro/` (demande de créneau, devis marque) | Base Supabase du CRM (`st_create_brand_request`, `st_all_busy`… via `shared/sb.js`) | **Inchangé** : la base CRM est en lecture seule pour ce dépôt, sauf ce qui existe déjà |
| Page devis `/devis/?id=…` (devis envoyé par l'équipe) | Lecture Supabase (`st_get_quote`) + bouton e-mail (mailto) | **Inchangé** |
| Espace membres `/app/`, admin | Supabase (connexion, notes, fournitures, réservations) | **Inchangé** |
| Accueil `/` | Pas de formulaire : liens e-mail vers contact@hivingfood.fr | Inchangé |
| **Configurateur `/pages/devis.html`** (« Recevoir mon devis ») | **N'envoyait rien** (bouton sans action) | **Branché** sur la fonction Vercel `/api/contact` |

## Réservation avec devis Pennylane direct (`/api/reservation`, nov. 2026)

`/pro/` et `/pages/devis.html` appellent d'abord la fonction Vercel **`POST /api/reservation`** : prix recalculé par le serveur, disponibilité vérifiée, client et devis créés dans Pennylane, date bloquée dans la base (`st_create_brand_request`, comme avant), devis envoyé par e-mail Pennylane et récapitulatif Resend. Une **tâche planifiée** (`/api/cron-paiements`, toutes les 15 min) transforme le devis signé en facture, prévient au paiement et fait expirer l'option au bout de 48 h. Détail, limites et recette : `docs/reservation-pennylane.md`, section « Version autonome site ».

Tant que `PENNYLANE_API_KEY` n'est pas posée, `/api/reservation` répond `501` et les pages gardent le circuit ci-dessus (rien ne change pour les clients).

Variables Vercel en plus de celles du tableau plus bas :

| Variable | Obligatoire | Valeur |
|---|---|---|
| `PENNYLANE_API_KEY` | pour activer | jeton API v2 Pennylane (Paramètres → Connectivité → Développeurs), droits `customers:all`, `quotes:all`, `customer_invoices:all` : **secret** |
| `CRON_SECRET` | oui avec la clé | longue chaîne aléatoire ; protège `/api/cron-paiements` : **secret** |
| `PENNYLANE_DRY_RUN` | non | `1` = test : aucun appel Pennylane, rien en base, tout journalisé, e-mails « [TEST] » |

Tests : `node tests/reservation.test.js` (Pennylane, base et Resend simulés).

## Comment ça marche

Le site est statique : le configurateur envoie la demande à une petite **fonction Vercel** (du code qui tourne chez Vercel seulement quand quelqu'un envoie le formulaire) : `api/contact.js`. Elle envoie un e-mail à **contact@hivingfood.fr** grâce à **Resend** (un service d'envoi d'e-mails), avec le plateau, la durée, les options et le total estimé HT (et TTC), et « répondre » va directement au client. Aucun PHP, aucune écriture dans Supabase, aucun traceur. Même mécanique que hivingfood.fr et hiving.me.

| Adresse | Champs (JSON) |
|---|---|
| `POST /api/contact` | `name`, `email`, `company` (facultatif), `message`, `subject`, `source` |

Protections : origine limitée à hivingstudio.fr, www.hivingstudio.fr et aux prévisualisations Vercel du projet (`hivingstudio-fr-….vercel.app`) ; champ piège invisible `website` (un robot le remplit, la demande est ignorée sans erreur) ; longueur des champs limitée.

Réponses : `200` envoyé · `400` champ manquant ou e-mail invalide · `403` origine refusée · `405` mauvaise méthode · `503` envoi impossible (clé absente ou Resend en panne). Avec `503`, la page affiche « Envoi momentanément indisponible, écrivez-nous à contact@hivingfood.fr » et un lien e-mail.

## À faire par Maxime (une seule fois)

### 1. Dans Resend

L'expéditeur par défaut est `Hiving Studio <noreply@hivingfood.fr>` : il suffit que le domaine **hivingfood.fr** soit vérifié dans Resend (voir `docs/formulaires.md` du dépôt hivingfood-fr). Rien à ajouter dans la zone DNS de hivingstudio.fr.

Si un jour on veut un expéditeur `@hivingstudio.fr`, il faudra vérifier ce domaine dans Resend : enregistrements `TXT resend._domainkey`, `MX send` et `TXT send` donnés par Resend. **Ils ne touchent pas aux MX du domaine** (posés sur le sous-domaine `send`) ; les MX, SPF et DMARC de hivingstudio.fr (OVH MX Plan) restent tels quels. Seul Maxime touche aux DNS.

### 2. Dans Vercel (projet hivingstudio-fr → Settings → Environment Variables)

| Variable | Obligatoire | Valeur |
|---|---|---|
| `RESEND_API_KEY` | oui | clé API Resend (la même que pour hivingfood.fr convient) : **secret, jamais dans le code** |
| `MAIL_FROM` | non | expéditeur ; par défaut `Hiving Studio <noreply@hivingfood.fr>` |
| `CONTACT_TO` | non | destinataire ; par défaut `contact@hivingfood.fr` |

Cocher *Production* et *Preview*, enregistrer, puis relancer un déploiement (*Deployments* → *Redeploy*).

## Tester

```bash
node tests/formulaires.test.js   # simule la fonction (aucun e-mail réel)
```

Puis, sur l'URL de prévisualisation, ouvrir `/pages/devis.html`, remplir l'étape 4 et cliquer « Recevoir mon devis ».
