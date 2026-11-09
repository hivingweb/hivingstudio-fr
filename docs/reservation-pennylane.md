# Réservation des plateaux avec devis et facture Pennylane : spécification côté CRM

Pour : l'équipe du CRM Hiving (Joseph, Milan). Rédigée le 9 novembre 2026, à la demande de Maxime.
Brief court à coller dans Claude Code : `docs/brief-crm-reservation.md`.

## 0. En une phrase

Le site hivingstudio.fr n'envoie plus qu'**une demande** (plateau, dates, options, coordonnées de facturation). Le **CRM** s'occupe du reste : il crée le client et le devis dans Pennylane, bloque la date 48 h, transforme le devis signé en facture avec lien de paiement, confirme la réservation au paiement et libère la date sinon. Le CRM est le seul à détenir la clé API Pennylane.

Règle affichée au client (texte validé par Maxime, à reprendre tel quel dans les e-mails) :

> Votre date est bloquée 48 h. Elle est confirmée à réception du paiement. Sans paiement, pas de prestation.

## 1. Ce qui est déjà fait côté site (branche `modif/reservation-pennylane`)

| Page | Avant | Maintenant |
|---|---|---|
| `/pro/` (bouton « Réserver » de l'accueil) | 4 étapes, demi-journée, horaires perso, décor/production, TVA, téléphone | 3 étapes : 1. plateau + date(s) (calendrier `st_all_busy`), 2. options (`st_options`), 3. facturation + récapitulatif + conditions + case « j'ai lu les conditions » → « Réserver » |
| `/pages/devis.html` (configurateur) | estimation sans date, e-mail « devis sous 4 h » | même parcours en 3 étapes, avec date et nombre de jours |

Adresse de l'API : constante `CRM_RESERVATION_URL` de `shared/config.js` (adresse **complète** de l'endpoint, vide par défaut).

- **Vide** (aujourd'hui) : `/pro/` appelle toujours `st_create_brand_request` (inchangé) ; `/pages/devis.html` envoie un e-mail à contact@hivingfood.fr via `/api/contact`. Message affiché : « Nous vous envoyons votre devis Pennylane sous 24 h ». L'équipe fait le devis à la main dans Pennylane.
- **Remplie** : les deux pages appellent `POST {CRM_RESERVATION_URL}` avec le JSON du §2. Il faudra aussi ajouter l'origine du CRM à `connect-src` dans `vercel.json` (CSP et CSP Report-Only), sinon le navigateur bloque l'appel.

## 2. Contrat d'API : `POST /api/studio/reservations`

### Requête (JSON, `Content-Type: application/json`)

```json
{
  "source": "hivingstudio.fr/pro",
  "idempotency_key": "6f1c0e7a-2b1d-4c55-9a51-0d9f3c7d1e22",
  "studio_id": "pro",
  "start_date": "2026-12-03",
  "days": 2,
  "options": [
    { "catalog": "st_options", "id": "o1", "label": "Package Lumière : …", "qty": 1, "unit": "day", "unit_price_ht": 150 }
  ],
  "customer": {
    "company": "ACME SAS",
    "siren": "123456789",
    "contact_name": "Camille Martin",
    "email": "camille@acme.fr",
    "billing_address": { "line1": "12 rue du Bac", "zip": "75007", "city": "Paris", "country": "FR" }
  },
  "message": "Recette en gros plan",
  "client_total_ht": 2000,
  "accept_conditions": true,
  "website": ""
}
```

| Champ | Règle |
|---|---|
| `studio_id` | `pro` ou `famille` (ids de `st_studios`) |
| `start_date` | `AAAA-MM-JJ`, heure de Paris, pas dans le passé |
| `days` | entier de 1 à 10, **jours consécutifs**, journée 8 h à 22 h (`OPEN_HOUR` / `CLOSE_HOUR`) |
| `options[].catalog` | `st_options` (envoyé par `/pro/`) ou `site` (envoyé par `/pages/devis.html`, catalogue `HIVING_ADDONS_FULL` de `site-data.jsx` : styliste, chef, matériel photo…) |
| `options[].qty` | `/pro/` envoie 1 (le prix « day » est multiplié par `days`) ; `/pages/devis.html` envoie la quantité choisie (nombre de jours, d'images…), **sans** multiplier par `days` |
| `unit_price_ht`, `label`, `client_total_ht` | **indicatifs** : le CRM recalcule tout depuis ses propres prix (jamais confiance au navigateur) |
| `customer.siren` | facultatif ; 9 chiffres (ou 14 = SIRET, garder les 9 premiers comme SIREN) |
| `accept_conditions` | doit valoir `true` |
| `website` | champ piège anti-robot : rempli → répondre `201` factice sans rien créer |
| `idempotency_key` | UUID ; même clé reçue deux fois en 24 h → renvoyer la même réponse (double clic, réseau lent) |

### Réponses

`201 Created` :

```json
{
  "reservation_id": "uuid st_brand_requests.id",
  "status": "option_48h",
  "hold_expires_at": "2026-11-11T18:20:00+01:00",
  "quote_number": "D-2026-0042",
  "total_ht": 2000,
  "total_ttc": 2400,
  "message": "Date bloquée 48 h. Devis envoyé par e-mail."
}
```

Si Pennylane est indisponible au moment de l'appel : la date est quand même bloquée, `status` reste `option_48h`, `quote_number` vaut `null`, et la tâche planifiée (§6) réessaie la création du devis. Le site affiche alors « date bloquée 48 h », sans numéro de devis.

| Code | `error` (texte en français, affiché tel quel au client) | Cas |
|---|---|---|
| 400 | « Champ manquant : … » / « Adresse e-mail invalide. » | validation |
| 403 | — | origine refusée |
| 409 | `SLOT_TAKEN` + « Cette date vient d'être prise sur ce plateau. » | conflit de disponibilité (§4) |
| 422 | « Le prix a changé : nouveau total X € HT. Merci de vérifier. » | écart > 1 € entre `client_total_ht` et le recalcul |
| 422 | « Option inconnue : … » | id absent du catalogue de référence |
| 429 | « Trop de demandes, réessayez dans quelques minutes. » | anti-spam |
| 503 | « Réservation en ligne momentanément indisponible. » | base indisponible (Pennylane indisponible n'est **pas** une 503, voir plus haut) |

Le site gère déjà : `2xx` (succès), `409` (message + recharge le calendrier), `400`/`422` avec `error` (affiché), tout le reste (message « écrivez-nous à contact@hivingfood.fr » + lien e-mail).

### CORS et anti-spam

- `Access-Control-Allow-Origin` renvoyé **uniquement** pour : `https://hivingstudio.fr`, `https://www.hivingstudio.fr`, et les prévisualisations Vercel du projet `^https://hivingstudio-fr(-[a-z0-9-]+)?\.vercel\.app$` (même règle que `api/_mail.js` du site). `Vary: Origin`. Méthodes `POST, OPTIONS`, en-tête `Content-Type`. Répondre au préflight `OPTIONS` en `204`.
- Origine absente ou autre : `403`, sauf en dev (`localhost`).
- Limite : 5 demandes par IP et par heure, 3 options 48 h simultanées par e-mail ou SIREN (au-delà : `429`).
- Champ piège `website`, longueurs maximales (société 200, nom 200, adresse 200, message 2 000), e-mail vérifié par expression régulière.
- Aucun secret dans le site : l'endpoint est public, la clé Pennylane et la clé Supabase `service_role` restent dans les variables d'environnement du CRM.

## 3. Cycle de vie et statuts

Colonne `studio_status` (nouvelle, voir §5) sur `st_brand_requests` :

```
option_48h ──(devis créé + envoyé)──▶ devis_envoye ──(devis accepté dans Pennylane)──▶ devis_signe
     │                                     │                                              │
     │                                     │                       (facture créée + envoyée) ▼
     │                                     │                                       facture_envoyee
     │                                     │                                              │ (facture payée)
     │                                     │                                              ▼
     └────────────(48 h écoulées sans paiement)────────────────────────────────▶ expiree     payee = confirmee
annulee : à tout moment, par l'équipe (admin CRM) ou à la demande du client
```

| Statut | Date dans le calendrier (`st_bookings`) | Pennylane | E-mail au client |
|---|---|---|---|
| `option_48h` | bloquée (« prise par une marque ») | client créé ou retrouvé ; devis en cours de création | — |
| `devis_envoye` | bloquée | devis `pending`, envoyé par e-mail | e-mail Pennylane du devis (+ e-mail Resend « date bloquée jusqu'au … ») |
| `devis_signe` | bloquée | devis `accepted` | — (enchaîné tout de suite) |
| `facture_envoyee` | bloquée | facture finalisée créée depuis le devis, envoyée par e-mail | e-mail Pennylane de la facture (avec bouton de paiement si activé, §7) |
| `payee` (= confirmée) | **ferme** (`hold_expires_at` effacé) | facture payée ; devis `invoiced` | « Réservation confirmée » (Resend) + copie contact@hivingfood.fr |
| `expiree` | **libérée** | devis `expired` (ou facture annulée par avoir, §8) | « Votre option a expiré, la date est libérée » |
| `annulee` | libérée | devis `denied`, ou avoir si facture émise | « Réservation annulée » |

Délai : `hold_expires_at = created_at + 48 h`. **Point à trancher par Maxime** : un virement classique met 1 à 2 jours ouvrés ; une demande faite un vendredi soir payée par virement peut arriver après 48 h. Proposition : tolérance automatique de 24 h si la facture est envoyée et que le client a signé (`facture_envoyee`), ou paiement par carte / virement instantané conseillé dans l'e-mail.

Réservations à moins de 48 h du tournage : `hold_expires_at = min(created_at + 48 h, début du tournage − 2 h)` ; si moins de 4 h, refuser en ligne (`422` « Pour un tournage aussi proche, écrivez-nous. »).

## 4. Disponibilité (contre `st_bookings`)

- Pour chaque jour `start_date … start_date + days − 1`, de `OPEN_HOUR` à `CLOSE_HOUR` (heure de Paris), aucun `st_bookings` avec `studio_id` identique, `status = 'active'` et période qui se chevauche (`starts_at < fin AND ends_at > début`), créateurs, blocages et marques confondus (même logique que `st_all_busy` et `st_create_brand_request`).
- Vérification et insertion **dans la même transaction** (fonction SQL `SECURITY DEFINER` ou verrou `SELECT … FOR UPDATE` / contrainte d'exclusion `EXCLUDE USING gist (studio_id WITH =, tstzrange(starts_at, ends_at) WITH &&) WHERE (status = 'active')`). Deux demandes simultanées sur la même date : une seule gagne, l'autre reçoit `409 SLOT_TAKEN`.
- L'option 48 h est un vrai `st_bookings` (`kind = 'brand'`, `status = 'active'`, `brand_request_id`, `hold_expires_at`) : elle apparaît donc tout de suite comme « prise par une autre marque » dans le calendrier de `/pro/` et de l'espace créateurs, sans changer le site.
- Expiration ou annulation : `st_bookings.status = 'cancelled'` (ne pas supprimer la ligne : historique).
- Multi-jours : **une** ligne `st_bookings` couvrant toute la période (comme aujourd'hui), ou une par jour si Milan préfère ; dans les deux cas, la libération concerne toute la période.

## 5. Champs à ajouter côté base (à faire par **Milan**, jamais depuis le dépôt du site)

`st_brand_requests` :

| Colonne | Type | Rôle |
|---|---|---|
| `studio_status` | `text` (check : `option_48h`, `devis_envoye`, `devis_signe`, `facture_envoyee`, `payee`, `expiree`, `annulee`) | cycle du §3 (ne pas casser `status` existant, lu par l'admin et `st_get_quote`) |
| `source` | `text` | `hivingstudio.fr/pro`, `hivingstudio.fr/pages/devis.html`, `admin` |
| `idempotency_key` | `uuid unique` | anti double envoi |
| `siren` | `text` | SIREN saisi |
| `pennylane_customer_id` | `bigint` | client Pennylane |
| `pennylane_quote_id` | `bigint` | devis Pennylane |
| `pennylane_quote_number` | `text` | numéro affiché au client |
| `pennylane_invoice_id` | `bigint` | facture Pennylane |
| `pennylane_credit_note_id` | `bigint` | avoir éventuel (§8) |
| `total_ht`, `total_ttc` | `numeric(10,2)` | montants recalculés par le CRM |
| `discount_rate` | `numeric(4,2)` | 0 ou 10 (remise fidélité, §8) |
| `hold_expires_at` | `timestamptz` | fin de l'option 48 h |
| `quote_sent_at`, `quote_signed_at`, `invoice_sent_at`, `paid_at`, `expired_at`, `cancelled_at` | `timestamptz` | jalons |
| `last_sync_at`, `sync_error` | `timestamptz`, `text` | suivi de la tâche planifiée |

`st_bookings` : `hold_expires_at timestamptz` (null = réservation ferme) et index `(studio_id, starts_at, ends_at) where status = 'active'`.

Nouvelle table `st_reservation_events` (journal, §9) : `id`, `brand_request_id`, `at`, `actor` (`site`, `cron`, `admin:<email>`), `event`, `payload jsonb`.

Catalogue « site » (`options[].catalog = 'site'`) : soit une table `st_site_addons` (id, label, unit, price_ht) reprenant `HIVING_ADDONS_FULL`, soit — **recommandé, à décider par Maxime** — un seul catalogue `st_options` pour les deux pages (aujourd'hui `/pro/` vend du matériel, `/pages/devis.html` propose aussi une équipe : styliste, chef, photographe…).

Policies RLS : ces colonnes ne sont **pas** lisibles par la clé publique ; seul le CRM (clé `service_role`, côté serveur) écrit. `st_all_busy` continue de ne renvoyer que studio, période et `kind`.

## 6. Appels Pennylane (API v2)

Base : `https://app.pennylane.com/api/external/v2`, jeton dans l'en-tête `Authorization: Bearer …` (déjà géré par `lib/pennylane/api.ts`). Tous les montants en chaînes. Réutiliser les fonctions existantes du CRM ; ce qui suit précise l'ordre et les paramètres.

| # | Étape | Appel | Doc officielle | Vérifié ? |
|---|---|---|---|---|
| 1 | Retrouver le client | `GET /customers` avec `filter` sur `external_reference` (opérateur `eq`) ; `external_reference = "HS-SIREN-<siren>"` ou, sans SIREN, `"HS-EMAIL-<email en minuscules>"` | [Create a Customer Invoice via API](https://pennylane.readme.io/docs/create-a-customer-invoice-use-case) | oui |
| 2 | Sinon le créer | `POST /company_customers` : `name`, `billing_address` (obligatoires), `reg_no` (SIREN), `emails: [email]`, `recipient` (nom du contact), `external_reference` (doit être **unique**), `billing_language: "fr_FR"` ; scope `customers:all`. Sous-champs de `billing_address` : reprendre ceux déjà utilisés par `ecriture.ts` (la page ne les détaille pas) | [Create a company customer](https://pennylane.readme.io/v2.0/reference/postcompanycustomer) | oui (sous-champs adresse : non détaillés) |
| 3 | Créer le devis | `POST /quotes` (scope `quotes:all`) : client, date du jour, validité = `hold_expires_at`, lignes (§6 bis), `external_reference = "HS-RES-<reservation_id>"`, mention de la règle 48 h dans l'en-tête ou les conditions | [V2 quotes endpoints](https://pennylane.readme.io/changelog/v2-quotes-and-commercial-documents-endpoints) | endpoint oui ; **corps non détaillé** dans les pages consultées → reprendre le format de création de devis déjà en place dans `lib/pennylane/ecriture.ts` |
| 4 | Envoyer le devis | `POST /quotes/:id/send_by_email` (`recipients` facultatif, sinon e-mails du client ; `email_template_id` de type `billing_email_quote` facultatif). Réponse `204`. `409` tant que le PDF n'est pas prêt (quelques minutes) → réessayer via la tâche planifiée | [Send a quote by email](https://pennylane.readme.io/reference/sendbyemailquote) | oui |
| 5 | Détecter la signature | `GET /quotes/:id`, statut `accepted` (valeurs possibles : `pending`, `accepted`, `denied`, `invoiced`, `expired`) | [Retrieve a quote](https://pennylane.readme.io/reference/getquote), [Update status of a quote](https://pennylane.readme.io/reference/updatestatusquote) | statuts oui |
| 6 | Créer la facture | `POST /customer_invoices/create_from_quote` : `quote_id`, `draft: false` (facture finalisée), `external_reference = "HS-FAC-<reservation_id>"`, `customer_invoice_template_id` facultatif ; scope `customer_invoices:all`. La facture reprend les attributs du devis | [V2 create customer invoice from quote](https://pennylane.readme.io/changelog/v2-create-customer-invoice-from-quote) | oui |
| 7 | Envoyer la facture | `POST /customer_invoices/:id/send_by_email` (facture finalisée, PDF prêt, sinon `409` → réessayer). Réponse `204` | [Send a customer invoice by email](https://pennylane.readme.io/v2.0/reference/sendbyemailcustomerinvoice) | oui |
| 8 | Suivre le paiement | `GET /customer_invoices/:id` ; rapprochement : `GET /customer_invoices/:id/matched_transactions` | [Retrieve a customer invoice](https://pennylane.readme.io/v2.0/reference/getcustomerinvoice), [use case](https://pennylane.readme.io/docs/create-a-customer-invoice-use-case) | voir ci-dessous |
| 9 | Mettre à jour le devis | `PUT /quotes/:id/update_status` : `expired` à l'expiration, `denied` à l'annulation (et `invoiced` si Pennylane ne le fait pas seul après l'étape 6) | [Update status of a quote](https://pennylane.readme.io/reference/updatestatusquote) | oui |

**Points non confirmés par la documentation consultée (à tester en bac à sable avant mise en ligne)** :

1. **Champ « payée » de la facture client.** La page de référence ne montre pas le schéma de réponse. Le changelog officiel annonce un booléen `paid` pour les **factures fournisseurs** ([new paid field](https://pennylane.readme.io/changelog/new-paid-field-on-supplier-invoices-endpoints)) ; le connecteur tiers Kestra lit `paid` sur les factures clients ; l'export Data Sharing parle de `is_paid` et `outstanding_balance`. → **Utiliser la logique existante de `lib/pennylane/statut-facture.ts`**, qui suit déjà le paiement des factures du CRM, sans la dupliquer. À défaut : facture payée si `matched_transactions` couvre le total TTC.
2. **Signature en ligne du devis envoyé par API.** Pennylane décrit la signature en un clic depuis l'e-mail du devis et le passage au statut « Accepté » ([article Pennylane](https://www.pennylane.com/fr/blog/produit/signature-electronique-devis)), mais la page de `send_by_email` n'en parle pas. → Tester : devis envoyé par l'API, signé depuis l'e-mail, puis `GET /quotes/:id` doit renvoyer `accepted`. Alternative si ce n'est pas le cas : notre propre e-mail Resend avec un bouton « J'accepte le devis » (lien signé à usage unique vers le CRM) qui appelle `PUT /quotes/:id/update_status` `accepted`.
3. **Lien de paiement par API.** Aucune page consultée ne documente un champ de lien de paiement. → Ne pas le construire nous-mêmes : envoyer la facture avec `send_by_email` ; l'e-mail Pennylane contient le bouton de paiement si le paiement en ligne est activé dans le compte Pennylane de HIVING FOOD (**à vérifier par Maxime** dans Pennylane, réglages de facturation). Sinon, la facture porte l'IBAN et le client paie par virement.
4. **Facturation électronique.** La doc de `send_by_email` prévient : envoyer par e-mail une facture éligible à la facturation électronique empêche ensuite sa transmission par une Plateforme Agréée. À valider avec l'expert-comptable avant l'obligation d'émission (calendrier de la réforme) ; le circuit pourra alors passer par la PA au lieu de l'e-mail.

Erreurs Pennylane : `401/403` → alerte immédiate (jeton) ; `409` PDF pas prêt → réessai au prochain passage ; `422` → `sync_error` + alerte ; `429`/`5xx` → réessai avec attente croissante. Ne jamais recréer un devis ou une facture si `pennylane_quote_id` / `pennylane_invoice_id` existe déjà (rechercher d'abord par `external_reference`).

### 6 bis. Lignes du devis

| Ligne | Libellé | Quantité | Prix unitaire HT | TVA |
|---|---|---|---|---|
| Plateau | « Location Studio Pro · journée 8 h-22 h · du 3 au 4 décembre 2026 » | `days` | `st_studios.price_day` (850 Studio Pro, 1 000 Studio Famille) | `FR_200` |
| Option `st_options` unité `day` | `label` de `st_options` | `days` | `st_options.price` | `FR_200` |
| Option `st_options` autre unité | `label` | 1 | `price` | `FR_200` |
| Option `site` | libellé du catalogue site | `qty` | prix du catalogue de référence | `FR_200` |
| Remise fidélité | « Remise fidélité −10 % (3e tournage de l'année) » | 1 | −10 % du sous-total HT (ou remise globale du devis, si `ecriture.ts` la gère déjà) | `FR_200` |

Utiliser des **produits Pennylane** (`product_id`) pour les deux plateaux et les options récurrentes, créés une fois par l'équipe, plutôt que du texte libre : meilleure compta (comptes 706). Unité : `day` / `jour` pour le plateau.

## 7. Tâche planifiée (toutes les 15 minutes)

Route `GET /api/cron/studio-reservations` protégée par `CRON_SECRET` (cron Vercel du CRM). Pour chaque `st_brand_requests` dont `studio_status` est `option_48h`, `devis_envoye`, `devis_signe` ou `facture_envoyee` :

1. `option_48h` sans `pennylane_quote_id` : créer client + devis (§6, étapes 1 à 3) ; puis envoyer (étape 4) → `devis_envoye`.
2. `devis_envoye` : lire le statut du devis ; `accepted` → `devis_signe`, `quote_signed_at`, puis tout de suite étapes 6 et 7 → `facture_envoyee` ; `denied` → `annulee` (libérer la date).
3. `facture_envoyee` : facture payée (voir §6 point 1) → `payee`, `paid_at`, `st_bookings.hold_expires_at = null`, devis `invoiced`, e-mail de confirmation.
4. `hold_expires_at < now()` et pas payée → `expiree` : `st_bookings.status = 'cancelled'`, devis `expired` (si une facture a déjà été émise : avoir, §8), e-mail d'expiration.
5. Rappel unique 24 h avant l'expiration (« il vous reste 24 h pour signer et régler »), si pas encore payé.

Idempotente (relancer deux fois ne change rien), traitement par lots de 50, une erreur sur une réservation n'arrête pas les autres, verrou pour éviter deux passages simultanés. Bonus si l'offre Pennylane le permet : lire `GET /changelogs/customer_invoices` pour ne traiter que les factures modifiées.

## 8. Cas limites

- **Double réservation** : contrainte du §4 ; le perdant reçoit `409` et le site recharge le calendrier.
- **Double clic / réseau lent** : `idempotency_key`.
- **Client déjà connu** : retrouvé par `external_reference` (SIREN, sinon e-mail) ; ne jamais créer de doublon Pennylane.
- **Prix modifié entre l'affichage et l'envoi** : `422` avec le nouveau total.
- **Multi-jours** : jours consécutifs seulement ; un jour pris dans la période = `409` ; une seule option 48 h pour toute la période. Plusieurs périodes distinctes = plusieurs demandes.
- **Remise fidélité −10 %** : règle publiée sur la page Tarifs : « −10 % à partir du 3e tournage dans l'année ». Le CRM compte les réservations `payee` de l'année civile du même client (même `pennylane_customer_id` ou SIREN) ; à partir de la 3e, ligne de remise sur le devis. Le site n'affiche plus de remise automatique (l'ancien configurateur l'appliquait à partir de 3 jours, ce qui ne correspondait pas à la règle publiée) : **à confirmer par Maxime**.
- **Annulation par le client** avant paiement : `annulee`, devis `denied`, date libérée. Après paiement : appliquer les conditions d'annulation publiées (page Tarifs) ; **remboursement = avoir Pennylane** (avoir lié à la facture, `pennylane_credit_note_id`) puis virement sortant fait par l'équipe ; jamais de suppression de facture.
- **Expiration alors qu'une facture est émise et non payée** : avoir total pour annuler la facture, puis libération.
- **Paiement reçu après expiration** : si la date est encore libre, re-bloquer et confirmer ; sinon alerte équipe (remboursement par avoir ou autre date).
- **Paiement partiel** : reste `facture_envoyee` ; alerte équipe à l'expiration au lieu de libérer automatiquement.
- **Tournage dans moins de 48 h** : voir §3.
- **Sur-mesure** (demi-journée, horaires, équipe de production, décor) : hors parcours automatique, demande par e-mail ; l'équipe fait le devis depuis l'admin CRM et peut réutiliser le même cycle (`source = 'admin'`).
- **Conditions publiées** : la page Tarifs annonce encore « Acompte 30 % à la confirmation. Solde à J-7 », alors que la nouvelle règle est « confirmée à réception du paiement ». **À mettre en cohérence par Maxime** (texte des conditions et, s'il y en a, des CGV : il n'existe pas aujourd'hui de page CGV sur le site, le lien des formulaires pointe vers la page Tarifs).

## 9. E-mails (Resend, depuis le CRM)

Expéditeur `Hiving Studio <noreply@hivingfood.fr>` (domaine déjà vérifié pour le site), réponse à contact@hivingfood.fr, vouvoiement, montants HT puis TTC.

| Quand | Objet | Contenu |
|---|---|---|
| Option créée | « Votre date est bloquée 48 h · Studio Pro, 3 décembre » | récapitulatif, date limite exacte, règle 48 h, « votre devis Pennylane arrive dans un e-mail séparé » |
| 24 h avant expiration | « Il vous reste 24 h pour confirmer » | lien vers l'e-mail du devis / de la facture |
| Payée | « Réservation confirmée » | plateau, dates, horaires 8 h-22 h, adresse 4 rue Mozart 92110 Clichy, contact |
| Expirée | « Votre option a expiré » | date libérée, lien pour réserver à nouveau |
| Annulée | « Réservation annulée » | suite (avoir éventuel) |
| Équipe (contact@hivingfood.fr) | à chaque changement de statut | une ligne + lien admin CRM |

Les e-mails du devis et de la facture eux-mêmes sont ceux de Pennylane (`send_by_email`).

## 10. Journal et suivi

- Chaque appel Pennylane et chaque changement de statut : une ligne dans `st_reservation_events` (sans données bancaires ni jeton).
- `sync_error` visible dans l'admin du CRM ; alerte e-mail à l'équipe après 3 échecs consécutifs sur une même réservation.
- Données personnelles : seules celles nécessaires à la facturation ; conservation alignée sur la politique de confidentialité du site.

## 11. Recette avant de remplir `CRM_RESERVATION_URL`

1. Bac à sable Pennylane : un parcours complet (option → devis → signature → facture → paiement simulé / « marquer payée ») et un parcours expiré.
2. Deux demandes simultanées sur la même date : une `201`, une `409`.
3. Preview Vercel du site avec `CRM_RESERVATION_URL` rempli et `connect-src` mis à jour : réservation depuis `/pro/` et `/pages/devis.html`, sur mobile.
4. Validation de Maxime, puis mise en ligne.
