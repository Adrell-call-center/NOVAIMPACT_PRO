# Coolify — Storage & Scheduled Posts Setup

---

## 1. Persistent Uploads Volume

By default, every redeploy creates a **new container** — anything written inside the container (like `/app/public/uploads`) is lost.

### Step-by-step in Coolify

1. Open your service in Coolify → **Storages** tab.
2. Click **Add Storage**.
3. Fill in:
   | Field | Value |
   |-------|-------|
   | Name | `uploads` |
   | Source Path (host) | `/data/coolify/volumes/novaimpact/uploads` |
   | Destination Path (container) | `/app/public/uploads` |
4. Click **Save** then **Redeploy**.

From now on, every uploaded file written to `/app/public/uploads` inside the container is stored on the host machine at the source path and survives all future redeploys and restarts.

### Verify it works

SSH into your server and check:

```bash
ls /data/coolify/volumes/novaimpact/uploads
```

Files should appear there after uploading from the admin panel.

### Backup recommendation

Add a daily cron on the server to back up the uploads folder:

```bash
# /etc/cron.d/novaimpact-uploads-backup
0 3 * * * root tar -czf /backups/uploads-$(date +\%F).tar.gz /data/coolify/volumes/novaimpact/uploads
```

---

## 2. Scheduled Posts — Surviving Redeploys & Restarts

### How scheduling works in this project

A post is **scheduled** when:
- `status = 'PUBLISHED'`
- `publishedAt` = a future date

The blog query always filters: `status = 'PUBLISHED' AND publishedAt <= NOW()`.
So the post is hidden until its date arrives — **no cron job is needed to flip a status flag**.

### Why scheduled posts survive redeploys

The schedule data lives in **PostgreSQL**, not in the container. As long as your database is persistent (Coolify managed DB, external Supabase, Neon, PlanetScale, etc.), all scheduled posts are safe across:

- Container restarts
- Redeploys
- Server reboots

Nothing is lost because there is no in-memory state — every page request queries the database fresh.

### What you must ensure

| Thing | How to confirm |
|-------|----------------|
| Database is NOT inside the app container | `DATABASE_URL` in your `.env` points to a separate service or external host |
| `DATABASE_URL` is set as an environment variable in Coolify | Coolify → Service → **Environment Variables** |
| DB volume is persistent (if self-hosted on Coolify) | Coolify → your DB service → **Storages** tab shows a volume mount |

### Setting DATABASE_URL in Coolify

1. Go to your service → **Environment Variables**.
2. Add:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   ```
3. Save and redeploy.

Never put credentials in the Dockerfile or commit them to git.

---

## 3. Checklist Before Every Deploy

- [ ] `DATABASE_URL` environment variable is set in Coolify
- [ ] Uploads volume is mounted (`/app/public/uploads` → host path)
- [ ] Run Prisma migrations as part of the deploy (see below)

### Running Prisma migrations on deploy

In your `docker-entrypoint.sh`, make sure you have:

```bash
#!/bin/sh
set -e

# Run DB migrations before starting the app
npx prisma migrate deploy

exec node server.js
```

This ensures the schema is always up to date after a redeploy without losing any data.

---

## 4. Quick Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Uploaded images 404 after redeploy | Volume not mounted | Add the Storages mount in Coolify |
| Scheduled posts appear immediately | Old code without `publishedAt <= NOW()` filter | Pull latest code and redeploy |
| Scheduled posts disappear after redeploy | They were never in the DB (used local SQLite file inside container) | Switch to external PostgreSQL |
| DB migrations not applied | `entrypoint.sh` missing `prisma migrate deploy` | Add it to the entrypoint script |
