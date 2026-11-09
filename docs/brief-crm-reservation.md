# Brief à coller dans Claude Code (dépôt du CRM Hiving)

> Copier tout le bloc ci-dessous dans une session Claude Code ouverte sur le dépôt du CRM.
> Spécification complète : `docs/reservation-pennylane.md` du dépôt `hivingweb/hivingstudio-fr` (à joindre ou à copier dans le CRM).

---

Objectif : brancher la réservation en ligne des plateaux de hivingstudio.fr sur le CRM, avec devis puis facture Pennylane, en suivant la spécification `reservation-pennylane.md` (jointe). Le site appelle `POST /api/studio/reservations` ; le CRM crée client + devis Pennylane, bloque la date 48 h, transforme le devis signé en facture envoyée par e-mail, confirme au paiement, libère la date sinon.

Règles :
- Lis d'abord le CLAUDE.md du CRM et respecte-le. Travaille sur une branche, petits commits en français, pas de fusion sans validation de Maxime.
- **Ne duplique rien** de `lib/pennylane/` : réutilise `api.ts` (client HTTP, jeton, en-têtes, réessais), `ecriture.ts` (création de client, de devis, de facture : reprends le format de corps déjà utilisé pour `POST /quotes` et `POST /company_customers`), `statut-facture.ts` (détection « payée » d'une facture : c'est la source de vérité, ne réécris pas cette logique), `devis-etat.ts` (statuts de devis, `update_status`). Ajoute seulement ce qui manque (ex. `create_from_quote`, `send_by_email` du devis et de la facture, recherche client par `external_reference`) dans ces fichiers, avec la même convention.
- Nouveau code suggéré :
  - `app/api/studio/reservations/route.ts` : `POST` + `OPTIONS` (CORS limité à hivingstudio.fr, www.hivingstudio.fr et `^https://hivingstudio-fr(-[a-z0-9-]+)?\.vercel\.app$`), validation (zod si déjà présent dans le projet), anti-spam (champ `website`, limite par IP, `idempotency_key`), recalcul des prix côté serveur, réservation de la date en transaction, puis appel Pennylane ; réponses et codes exactement comme au §2 de la spec.
  - `lib/studio/reservation.ts` : machine à états (`option_48h`, `devis_envoye`, `devis_signe`, `facture_envoyee`, `payee`, `expiree`, `annulee`), transitions pures et testables, sans appel réseau.
  - `lib/studio/disponibilite.ts` : contrôle de chevauchement contre `st_bookings` (même règle que `st_all_busy`).
  - `lib/studio/prix.ts` : prix plateau (`st_studios.price_day`), options (`st_options`, catalogue « site »), remise fidélité −10 % dès le 3e tournage payé de l'année civile.
  - `app/api/cron/studio-reservations/route.ts` : toutes les 15 min (cron Vercel, protégé par `CRON_SECRET`) : créer/envoyer les devis en attente, détecter signature et paiement, créer et envoyer la facture, rappel J-24 h, expirer les options.
  - E-mails Resend du §9 (réutilise le module d'envoi d'e-mails du CRM s'il existe).
- Base Supabase : **les migrations (colonnes du §5 sur `st_brand_requests` et `st_bookings`, table `st_reservation_events`, contrainte anti-chevauchement, RLS) sont faites par Milan**. Écris le fichier de migration proposé, ne l'applique pas toi-même sans son accord.
- Secrets : `PENNYLANE_*`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CRON_SECRET` dans les variables d'environnement Vercel du CRM, jamais dans le code ni dans le site.
- Points non confirmés par la doc Pennylane (spec §6) : champ « payée » des factures clients (s'en remettre à `statut-facture.ts`), signature en ligne d'un devis envoyé par API, lien de paiement par API (ne pas le construire : envoyer la facture par `send_by_email`). Prévois un test en bac à sable pour chacun et signale le résultat.

Tests (avec le framework déjà en place dans le CRM, Vitest ou Jest) :
- transitions de la machine à états (dont expiration, paiement après expiration, paiement partiel) ;
- calcul des prix (1 et 3 jours, options « day » et autres unités, remise fidélité, écart > 1 € → 422) ;
- disponibilité (chevauchement, multi-jours, multi-mois, deux demandes simultanées → une 201, une 409) ;
- route `POST` : CORS (origine refusée → 403, préflight 204), champ piège, idempotence, validation ;
- cron idempotent (deux passages = même état), Pennylane simulé (409 PDF pas prêt → réessai, 5xx → `sync_error`).

À la fin : résumé en 5 lignes, liste des variables d'environnement à créer, migration à transmettre à Milan, URL de preview du CRM, et la valeur à mettre dans `CRM_RESERVATION_URL` (shared/config.js du site) + l'origine à ajouter au `connect-src` de `vercel.json` du site.
