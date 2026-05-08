# Cloudflare Caching Setup (Step by Step)

This guide configures safe caching for a Next.js-style website:
- no caching for dynamic/admin/API pages
- strong caching for static theme assets (CSS/JS/images/fonts)

Use this for `novaimpact.io`.

## 1) Open Cloudflare Dashboard

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Select your zone: `novaimpact.io`.
3. Go to **Caching** -> **Cache Rules**.
4. Click **Create rule**.

---

## 2) Rule #1 - Bypass Dynamic and Sensitive Paths

Create this rule first (highest priority).

- **Rule name:** `Bypass dynamic paths`
- **Expression (Custom filter expression):**

```txt
(http.request.uri.path contains "/api/") or
starts_with(http.request.uri.path, "/admin") or
starts_with(http.request.uri.path, "/login") or
starts_with(http.request.uri.path, "/dashboard")
```

- **Then choose action settings:**
  - **Cache eligibility:** `Bypass cache`

Click **Deploy**.

---

## 3) Rule #2 - Cache Next.js Build Assets Aggressively

Create this rule second.

- **Rule name:** `Cache Next static assets`
- **Expression:**

```txt
starts_with(http.request.uri.path, "/_next/static/")
```

- **Then choose action settings:**
  - **Cache eligibility:** `Eligible for cache`
  - **Edge TTL:** `1 year`
  - **Browser TTL:** `Respect existing headers` (recommended)

Click **Deploy**.

---

## 4) Rule #3 - Cache Theme Static Files

Create this rule third.

- **Rule name:** `Cache theme static files`
- **Expression:**

```txt
ends_with(http.request.uri.path, ".css") or
ends_with(http.request.uri.path, ".js") or
ends_with(http.request.uri.path, ".mjs") or
ends_with(http.request.uri.path, ".png") or
ends_with(http.request.uri.path, ".jpg") or
ends_with(http.request.uri.path, ".jpeg") or
ends_with(http.request.uri.path, ".webp") or
ends_with(http.request.uri.path, ".svg") or
ends_with(http.request.uri.path, ".ico") or
ends_with(http.request.uri.path, ".woff") or
ends_with(http.request.uri.path, ".woff2") or
ends_with(http.request.uri.path, ".ttf")
```

- **Then choose action settings:**
  - **Cache eligibility:** `Eligible for cache`
  - **Edge TTL:** `1 month` (or `1 year` if files are versioned/hashes)
  - **Browser TTL:** `Respect existing headers`

Click **Deploy**.

If your asset URLs sometimes use uppercase extensions, either normalize file names to lowercase or add uppercase variants (for example, `.CSS`, `.JS`).

---

## 4.1) "Then..." Actions - Detailed Settings

When you create/edit a Cache Rule in Cloudflare, the **Then...** panel is where you define behavior.

### A) Cache eligibility (Required)

This controls whether Cloudflare can cache the response at all.

- **Bypass cache**
  - Use this for dynamic/sensitive routes:
    - `/api/*`
    - `/admin/*`
    - `/login`
    - `/dashboard`
  - Result: Cloudflare will not cache these responses.

- **Eligible for cache**
  - Use this for static files:
    - `/_next/static/*`
    - `.css`, `.js`, images, fonts
  - Result: response can be cached, subject to headers/rules.

### B) Edge TTL (Optional but recommended)

Edge TTL tells Cloudflare how long to keep cached content on Cloudflare edge servers.

- For **bypass rules**:
  - Leave Edge TTL unused (not relevant when bypassing).

- For **Next static build assets** (`/_next/static/`):
  - Set **Edge TTL = 1 year**
  - Reason: filenames are hashed/versioned, so long cache is safe.

- For **theme static files** (`css/js/images/fonts`):
  - If filenames are versioned/hashed -> **Edge TTL = 1 year**
  - If filenames are not versioned -> **Edge TTL = 1 month** (safer)

### C) Browser TTL

This controls how long visitors' browsers keep files.

- Recommended default: **Respect existing headers**
- If you must force:
  - static assets: 7 days to 1 month
  - never force long browser TTL for dynamic HTML

### D) Important behavior note

Even with `Eligible for cache`, Cloudflare still considers:
- origin `Cache-Control` headers
- other cache settings/rules
- request method/status

So the best setup is:
1. correct **Cache Rule**
2. correct **origin headers**
3. correct **rule order**

---

## 5) Rule Order (Important)

Make sure order is:
1. `Bypass dynamic paths`
2. `Cache Next static assets`
3. `Cache theme static files`

If order is wrong, bypass may not work correctly.

---

## 6) Recommended Origin Cache Headers

At your app/server level:

- For static hashed assets:

```txt
Cache-Control: public, max-age=31536000, immutable
```

- For HTML pages:

```txt
Cache-Control: no-cache
```

This keeps pages fresh but static files fast.

---

## 7) Quick Verification

After deploying rules:

1. Open your site in browser.
2. Open DevTools -> **Network**.
3. Refresh once, then refresh again.
4. Check response headers:
   - static files should show Cloudflare cache behavior (`cf-cache-status: HIT` after warm-up)
   - API/admin should not be cached

---

## 8) Optional Purge After Theme Changes

If you changed CSS/JS and need immediate update:

1. Cloudflare -> **Caching** -> **Configuration**
2. Click **Purge cache**
3. Prefer **Custom Purge** for changed paths, or **Purge Everything** only if needed.

---

## 9) Exact UI Click Path (Per Rule)

For each rule:

1. Go to **Caching** -> **Cache Rules** -> **Create rule**
2. Enter **Rule name**
3. Under **If incoming requests match...**, choose **Custom filter expression**
4. Paste expression
5. Under **Then...**
   - Set **Cache eligibility** (Bypass or Eligible)
   - Set **Edge TTL** if needed
   - Set **Browser TTL** (usually Respect existing headers)
6. Click **Deploy**
7. Reorder rules if necessary (drag/drop)

---

## Notes for Your Mail Issue

Caching does not fix Gmail SMTP rejection.  
For email delivery, you still need SPF, DKIM, and DMARC configured for `novaimpact.io`.
