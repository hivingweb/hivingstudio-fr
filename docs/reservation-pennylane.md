# Réservation des plateaux avec devis et facture Pennylane : spécification côté CRM

Pour : l'équipe du CRM Hiving (Joseph, Milan). Rédigée le 9 novembre 2026, à la demande de Maxime.
Brief court à coller dans Claude Code : `docs/brief-crm-reservation.md`.

> **Mise à jour du 9 novembre 2026 (décision de Maxime)** : en attendant le CRM, le site parle **directement** à Pennylane via ses propres fonctions Vercel (`api/reservation.js`, `api/cron-paiements.js`). Voir la section **« Version autonome site »** en fin de document. La spécification CRM ci-dessous reste la cible à terme.

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

---

## Version autonome site (sans CRM)

Décision de Maxime (9 novembre 2026) : le site hivingstudio.fr parle **directement** à Pennylane, sans attendre le CRM. Branche `modif/reservation-pennylane-v2`.

### En bref

| Étape | Qui | Quoi |
|---|---|---|
| 1. Le client clique « Réserver » (`/pro/` ou `/pages/devis.html`) | page → `POST /api/reservation` | contrôles, **prix recalculé par le serveur**, disponibilité, client + devis Pennylane, date bloquée dans la base, devis envoyé par e-mail Pennylane, récapitulatif par e-mail (client + contact@hivingfood.fr) |
| 2. Le client signe le devis (lien de l'e-mail Pennylane) | `GET /api/cron-paiements` (toutes les 15 min) | facture **finalisée** créée depuis le devis et envoyée par e-mail Pennylane (bouton de paiement si le paiement en ligne est activé) |
| 3. Le client paie | tâche planifiée | e-mail « Réservation confirmée » au client + alerte « réservation payée : à confirmer dans l'admin » à contact@hivingfood.fr |
| 3 bis. Rien dans les 48 h | tâche planifiée | devis passé « expiré » dans Pennylane, e-mail « option expirée » au client, alerte « date à libérer dans l'admin » |
| 4. Confirmer ou libérer la date | **l'équipe, dans l'admin** | bouton « Confirmer » (`st_confirm_brand`) ou « Libérer » : le site n'a pas le droit d'écrire autrement dans la base du CRM |

Message affiché au client : « Votre devis Pennylane vient de partir par e-mail. Votre date est bloquée 48 h. Elle est confirmée à réception du paiement. »

### Fichiers

| Fichier | Rôle |
|---|---|
| `api/reservation.js` | la réservation (réponse `{ ok, quoteNumber, holdUntil, quoteSent, totalHt, totalTtc }`) |
| `api/cron-paiements.js` | la tâche planifiée (signé → facture, payé → confirmation, 48 h → expiré) |
| `api/_studio.js` | **grille de prix serveur** (Studio Pro 850 €, Studio Famille 1 000 € HT/jour, copie du catalogue `HIVING_ADDONS_FULL` de `site-data.jsx`), heure de Paris, règle des 48 h |
| `api/_pennylane.js` | appels à l'API Pennylane v2 (mode `DRY_RUN` compris) |
| `api/_base.js` | base du CRM avec la clé **publique** : lecture `st_options`, RPC `st_all_busy`, RPC `st_create_brand_request` (déjà utilisées par `/pro/`) |
| `tests/reservation.test.js` | tests avec Pennylane, base et Resend simulés : `node tests/reservation.test.js` |

**Si un prix change** sur le site (plateau ou option de `site-data.jsx`), le changer **aussi** dans `api/_studio.js` : sinon le serveur répond « Le prix a changé : nouveau total … » et le client ne peut pas réserver. Les options de `/pro/` (`st_options`) sont lues dans la base au moment de la demande : rien à faire.

### Ce que fait `POST /api/reservation`, dans l'ordre

1. Origine limitée à hivingstudio.fr, www et aux prévisualisations `hivingstudio-fr-….vercel.app` (CORS, `403` sinon) ; champ piège `website` (rempli → `200` factice, rien créé) ; corps ≤ 20 Ko (`413`) ; 5 demandes par IP et par heure (`429`).
2. Validation : plateau `pro`/`famille`, date `AAAA-MM-JJ` pas passée, 1 à 10 jours, société, nom, e-mail, adresse, code postal, ville, SIREN facultatif (9 chiffres, ou SIRET 14 → 9 premiers), conditions acceptées (`400` avec message en français).
3. Option : 48 h, ou jusqu'à 2 h avant le tournage si c'est plus tôt ; moins de 4 h → `422` « écrivez-nous ».
4. **Prix** : recalculé depuis la grille serveur ; les prix envoyés par le navigateur sont ignorés ; si `client_total_ht` diffère de plus de 1 € → `422` « Le prix a changé : nouveau total X € HT ». Option inconnue, incluse ou à 0 € (sur devis) → `422`.
5. Disponibilité : lecture `st_all_busy` (8 h-22 h, heure de Paris, sur toute la période) → `409 SLOT_TAKEN` si un jour est pris.
6. Pennylane : client retrouvé par `external_reference` (`HS-SIREN-<siren>` ou `HS-EMAIL-<e-mail>`), sinon créé (`POST /company_customers`) ; devis créé (`POST /quotes`) : une ligne plateau × jours, une ligne par option, TVA `FR_200`, objet « Location Hiving Studio · Studio Pro · du … au … », texte libre avec la règle des 48 h et l'heure limite, date de validité = jour de fin de l'option, `external_reference = HS-RES-<fin d'option AAAAMMJJHHMM UTC>-<6 caractères>`.
7. Base : `st_create_brand_request` (exactement comme `/pro/`, aucune colonne inventée). La **référence du devis Pennylane** (numéro, id, `HS-RES-…`), l'heure limite, le total HT et les options du catalogue site sont écrits dans le champ libre `p_needs` (« Un mot sur votre projet »), visible dans l'admin. Si la base répond `SLOT_TAKEN` (deux clients en même temps) : le devis est passé « refusé » dans Pennylane et le client reçoit `409`.
8. Envoi du devis : `POST /quotes/:id/send_by_email` (réessayé 5 fois toutes les 4 s si le PDF n'est pas prêt, `409`).
9. E-mails Resend : récapitulatif au client (vouvoiement, HT puis TTC, règle des 48 h) et à contact@hivingfood.fr (avec « À FAIRE » si le devis n'a pas pu être créé ou envoyé).

Pennylane en panne : la date est **quand même** bloquée (étape 7), `quoteNumber` vaut `null`, l'équipe reçoit « À FAIRE : devis Pennylane non créé, le faire à la main ». Base en panne avant l'étape 7 : `503`, la page reprend l'ancien circuit.

### Modes

| Réglage Vercel | Comportement |
|---|---|
| pas de `PENNYLANE_API_KEY` (aujourd'hui) | `/api/reservation` répond `501 { fallback: true }` sans rien faire ; les pages reprennent **l'ancien circuit** : `/pro/` → `st_create_brand_request`, `/pages/devis.html` → `/api/contact` (ou `CRM_RESERVATION_URL` s'il est rempli). La tâche planifiée ne fait rien. |
| `PENNYLANE_DRY_RUN=1` | **aucun appel à Pennylane et rien d'écrit dans la base** : chaque requête Pennylane et l'appel `st_create_brand_request` sont seulement **journalisés** (Vercel → *Logs*) ; les deux e-mails Resend partent avec « [TEST] » dans l'objet ; numéro de devis factice `DRY-RUN-…`. La tâche planifiée ne fait rien. |
| `PENNYLANE_API_KEY` sans `DRY_RUN` | circuit complet. |

Sur la page, `/api/reservation` est essayée **en premier** ; tout autre résultat que `200`, `409`, `400/413/422/429` (avec message) déclenche l'ancien circuit, donc rien ne casse tant que la clé n'est pas posée.

### Tâche planifiée `GET /api/cron-paiements`

Déclarée dans `vercel.json` (`"crons"`, `*/15 * * * *`), protégée par `CRON_SECRET` (Vercel envoie `Authorization: Bearer <CRON_SECRET>` ; sans la bonne valeur : `401`). Elle lit les devis des 21 derniers jours dont la référence commence par `HS-RES-` :

| Statut du devis Pennylane | Action | Ce qui empêche de la refaire |
|---|---|---|
| `pending` et option échue | `PUT /quotes/:id/update_status` `expired` ; e-mail « Votre option a expiré » ; alerte équipe « date à libérer dans l'admin » | le devis n'est plus `pending` |
| `accepted`, pas de facture `HS-FAC-<id du devis>` | `POST /customer_invoices/create_from_quote` (`draft: false`, `external_reference: HS-FAC-<id>`) puis `send_by_email` ; alerte équipe « devis signé » | la facture est retrouvée par sa référence avant toute création |
| `accepted`, facture payée | e-mail « Réservation confirmée » (8 h-22 h, 4 rue Mozart, 92110 Clichy) ; alerte « Réservation payée : à confirmer dans l'admin » ; devis passé `invoiced` | le devis est `invoiced` |
| `accepted`, facture impayée à l'échéance | alerte équipe « option échue, facture impayée » (attendre le virement ou annuler par avoir) | envoyée par le seul passage dont le créneau de 15 min contient l'échéance |
| `invoiced`, `denied`, `expired` | rien | — |

Convention du site : **`invoiced` = payé et client prévenu**. Si Pennylane passe tout seul le devis en `invoiced` à la création de la facture, la tâche le remet en `accepted` jusqu'au paiement. Tous les e-mails portent en plus une clé d'idempotence Resend (`Idempotency-Key`, 24 h) contre un double passage.

### Limites connues (à lever avec le CRM ou en recette)

- **Pas de base à nous** : l'état vit dans les statuts Pennylane. Si Pennylane refuse de remettre un devis `invoiced` en `accepted` (non documenté), le paiement de ce devis ne sera pas détecté : l'équipe le verra dans Pennylane. À vérifier en recette.
- **Envoi du devis ou de la facture** : s'il échoue encore après 5 essais (PDF pas prêt), il **n'est pas réessayé** automatiquement (rien pour s'en souvenir) : l'équipe reçoit « À FAIRE : cliquer Envoyer dans Pennylane ». Si cela arrive souvent en recette, prévoir un champ d'état côté CRM.
- **Date libérée à la main** : la tâche ne peut pas annuler le créneau dans la base (pas de droit d'écriture) ; elle prévient l'équipe, qui libère dans l'admin. Idem pour la confirmation (`st_confirm_brand`).
- **Devis refusé par le client** (`denied`) : pas d'alerte automatique (rien pour s'en souvenir) ; la date reste bloquée jusqu'à libération dans l'admin.
- **Limite par IP et double clic** : mémoire de l'instance Vercel (meilleur effort) ; le blocage en base (`SLOT_TAKEN`) reste la vraie protection contre la double réservation.
- **Facture impayée à l'échéance** : l'alerte unique suppose que la tâche tourne bien toutes les 15 min ; un passage manqué = pas d'alerte (la facture reste visible dans Pennylane).
- **Remise fidélité −10 %** : non appliquée automatiquement (à ajouter à la main sur le devis si besoin).
- **Plan Vercel** : une tâche toutes les 15 min demande l'offre **Pro** de Vercel. En offre Hobby, Vercel refuse le déploiement d'une tâche plus fréquente qu'une fois par jour : vérifier l'offre de l'équipe « Hiving » avant de fusionner (sinon passer `schedule` à `0 7 * * *` et accepter un suivi quotidien).

### Vérification contre la documentation officielle Pennylane (9 novembre 2026)

Certaines pages de référence n'ont pas pu être lues (accès bloqué depuis l'outil, ou schéma de réponse non affiché) : elles sont marquées « non confirmé ». **À valider en recette avant de passer en réel.**

| Appel / champ | Statut | Source |
|---|---|---|
| Base `https://app.pennylane.com/api/external/v2`, `Authorization: Bearer` | confirmé | [cas d'usage facture client](https://pennylane.readme.io/docs/create-a-customer-invoice-use-case) |
| `GET /customers?filter=[{"field":"external_reference","operator":"eq","value":…}]` | confirmé | idem |
| `POST /company_customers` : `name`, `emails`, `external_reference`, `billing_address.address / postal_code / city / country` | confirmé | idem |
| `reg_no`, `recipient`, `billing_language` sur le client | confirmé dans la spec CRM (§6), non relu ici | §6 ci-dessus |
| Lignes : `label`, `quantity`, `unit`, `raw_currency_unit_price` (chaîne), `vat_rate: "FR_200"` | confirmé (factures) ; supposé identique pour les devis | cas d'usage facture client |
| `POST /quotes` existe (scope `quotes:all`) | confirmé | [changelog devis v2](https://pennylane.readme.io/changelog/v2-quotes-and-commercial-documents-endpoints) |
| Corps de `POST /quotes` : `customer_id`, `date`, `deadline`, `invoice_lines`, `pdf_invoice_subject`, `pdf_invoice_free_text`, `currency`, `language` | **confirmé par la page « Update a quote »** (mêmes champs) ; page « Create a quote » non lue | [update a quote](https://pennylane.readme.io/reference/updatequote) |
| `external_reference` à la création du devis | **non confirmé** (indispensable : la tâche retrouve les devis par cette référence) | — |
| Réponse du devis : `id`, `quote_number`, `status`, `customer.id` | **non confirmé** (schéma non affiché) ; repli sur `label` puis `id` pour le numéro | [retrieve a quote](https://pennylane.readme.io/reference/getquote) |
| `GET /quotes` avec filtre `date gteq`, pagination `items / has_more / next_cursor` | **non confirmé** (page non lue) | — |
| `POST /quotes/:id/send_by_email` : `204`, `409` si PDF pas prêt | confirmé | [send a quote by email](https://pennylane.readme.io/reference/sendbyemailquote) |
| `PUT /quotes/:id/update_status` : `pending`, `accepted`, `denied`, `invoiced`, `expired` | confirmé | [update status of a quote](https://pennylane.readme.io/reference/updatestatusquote) |
| `POST /customer_invoices/create_from_quote` : `quote_id`, `draft` (obligatoires), `external_reference`, scope `customer_invoices:all`, réponse `201` | confirmé (schéma de réponse non affiché) | [create from quote](https://pennylane.readme.io/reference/createcustomerinvoicefromquote) |
| `GET /customer_invoices?filter=[external_reference eq …]` | **non confirmé** (filtre) ; en cas d'erreur la tâche **ne crée pas** de facture | — |
| `POST /customer_invoices/:id/send_by_email` | confirmé (spec CRM §6) | §6 ci-dessus |
| Facture payée : booléen `paid` sur `GET /customer_invoices/:id` | **non confirmé par Pennylane** (schéma non affiché) ; utilisé par le connecteur Kestra ; repli sur `status: "paid"` puis `remaining_amount <= 0` | [Kestra, facture payée](https://kestra.io/plugins/plugin-pennylane/customer-invoices/io.kestra.plugin.pennylane.customerinvoices.customerinvoicepaidtrigger) |
| Signature en ligne du devis → statut `accepted` | non confirmé (voir §6 point 2) | — |
| Bouton de paiement dans l'e-mail de facture | non confirmé par l'API ; dépend du réglage Pennylane (voir plus bas) | — |

### À faire par Maxime

**1. Créer la clé Pennylane** : Pennylane → **Paramètres → Connectivité → Développeurs** → « Générer un jeton API » (API v2). Droits : **`customers:all`**, **`quotes:all`**, **`customer_invoices:all`** (lecture et écriture). Copier le jeton une seule fois, ne jamais l'envoyer par e-mail ni dans une conversation.

**2. Activer le paiement en ligne des factures** : Pennylane → **Paramètres → Facturation** (rubrique paiement en ligne / « Encaissement ») : activer le paiement par carte ou prélèvement (GoCardless, Stripe ou l'offre Pennylane selon le compte HIVING FOOD). Une fois activé, l'e-mail Pennylane de chaque facture contient un bouton « Payer ». Sinon la facture porte l'IBAN et le client paie par virement (1 à 2 jours ouvrés : voir le point « tolérance » du §3).

**3. Variables Vercel** (projet `hivingstudio-fr` → *Settings* → *Environment Variables*, cocher *Production* et *Preview*) :

| Variable | Valeur |
|---|---|
| `PENNYLANE_API_KEY` | le jeton du point 1 (secret) |
| `CRON_SECRET` | une longue chaîne aléatoire (au moins 32 caractères), inventée une fois (secret) |
| `RESEND_API_KEY` | déjà prévue pour `/api/contact` |
| `PENNYLANE_DRY_RUN` | `1` pour la phase de test, puis **supprimer** la variable |

Puis *Deployments* → *Redeploy*.

**4. Tester en `DRY_RUN`** (rien n'est créé) : poser `PENNYLANE_DRY_RUN=1` (Preview seulement), ouvrir l'URL de prévisualisation `/pro/`, réserver une date avec votre e-mail. Attendu : message « Votre devis Pennylane (N° DRY-RUN-…) vient de partir par e-mail… », deux e-mails « [TEST] » (vous et contact@hivingfood.fr), et dans Vercel → *Logs* les lignes `[pennylane DRY_RUN] POST /quotes …` avec les lignes du devis et le total. Rien dans Pennylane, rien dans l'admin.

**5. Tester en réel avec une réservation d'un jour** : retirer `PENNYLANE_DRY_RUN`, redéployer, réserver **1 jour** sur une date lointaine avec la société HIVING et votre e-mail. Vérifier : client et devis dans Pennylane (référence `HS-RES-…`), e-mail Pennylane du devis, demande dans l'admin avec la référence du devis dans le message. Signer le devis depuis l'e-mail ; au plus 15 min après : facture créée et reçue. La marquer payée dans Pennylane (« Marquer comme payée ») ; au plus 15 min après : « Réservation confirmée » et alerte « à confirmer dans l'admin ». Faire un second essai sans signer pour voir l'expiration (ou attendre 48 h). Enfin, annuler la facture de test par un avoir et libérer la date dans l'admin.
