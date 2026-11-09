# 2026-11-09 — Passage d'OVH à GitHub + Vercel

**Décision (Maxime)** : le site hivingstudio.fr quitte l'hébergement mutualisé OVH pour GitHub (organisation `hivingweb`, dépôt public) + Vercel (équipe Hiving), sur le modèle du CRM.

- Les DNS restent chez OVH ; seuls les enregistrements `@` et `www` du site pointeront vers Vercel, après validation sur l'adresse de test. MX/SPF/DKIM/DMARC inchangés.
- Dépôt public (protection de `main` gratuite) : donc **aucun secret, aucune donnée personnelle** dans le dépôt.
- Médias lourds sur Vercel Blob, pas dans Git.
- La base Supabase lue par le site est celle du CRM : lecture seule, rien n'y est modifié depuis ce dépôt.
