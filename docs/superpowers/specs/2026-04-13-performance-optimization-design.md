# Performance Optimization Design
**Date:** 2026-04-13  
**Project:** NOVAIMPACT PRO (Next.js 13.2, Pages Router)  
**Goal:** Dramatically reduce first-load time and improve Core Web Vitals (LCP, FCP, CLS, TTI) for better SEO rankings.

---

## Problem Summary

The site suffers from slow first loads due to four compounding issues:

1. Homepage runs `getServerSideProps` — every visitor triggers a DB query and full server render, making TTFB 300–800ms+.
2. RootLayout statically imports all 5 headers and 5 footers — ~8 unused components ship in every page's JS bundle.
3. GSAP plugins (ScrollSmoother, SplitText, ScrollToPlugin, ~150KB) load synchronously, blocking first paint.
4. FontAwesome CSS (~400KB) is imported twice in hero and team components, despite already being globally loaded.
5. Google Fonts loaded via a render-blocking `<link>` tag.
6. No HTTP cache headers on static assets — browsers re-validate on every visit.

---

## Section 1 — Data Fetching: ISR

**File:** `src/pages/index.js`

Replace `getServerSideProps` with `getStaticProps` + `revalidate: 60`.

```js
export async function getStaticProps() {
  // same Prisma query
  return {
    props: { latestPosts: ... },
    revalidate: 60, // regenerate in background every 60s
  };
}
```

**Effect:** Homepage is pre-built as static HTML. TTFB drops to <50ms. Google crawls a fully-rendered page. Blog posts stay fresh within 60 seconds.

---

## Section 2 — JS Bundle: Dynamic Imports

### 2a. RootLayout headers/footers
**File:** `src/components/common/layout/RootLayout.jsx`

Replace all static `import Header1 ... Header5` and `import Footer1 ... Footer5` with `next/dynamic`:

```js
import dynamic from 'next/dynamic';
const Header1 = dynamic(() => import('@/components/header/Header1'));
// ... etc for all 5 headers and 5 footers
```

Only the one header/footer actually used on a given page will be bundled for that page.

### 2b. GSAP plugins
**Files:** `src/plugins/index.js`, `src/components/common/CommonAnimation.jsx`, `src/components/common/ScrollSmootherComponents.jsx`, `src/components/hero/DigitalAgencyHero.jsx`

Load GSAP plugins inside `useEffect` via dynamic `import()` instead of top-level synchronous imports. This defers ~150KB of JS until after first paint.

```js
useEffect(() => {
  import('@/plugins').then(({ ScrollTrigger, SplitText, ScrollSmoother }) => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    // ... init animations
  });
}, []);
```

**Effect:** Initial JS bundle shrinks. Page becomes interactive (TTI) faster. Animations still play — just after first paint.

---

## Section 3 — CSS & Font Optimization

### 3a. Remove duplicate FontAwesome CSS
**Files:** `src/components/hero/DigitalAgencyHero.jsx`, `src/components/team/CreativeAgencyTeam.jsx`

Remove:
```js
import "@fortawesome/fontawesome-free/css/all.min.css";
```

FontAwesome is already globally loaded via `@fortawesome/fontawesome-svg-core/styles.css` in `_app.js`. This duplicate adds ~400KB of CSS unnecessarily.

### 3b. Next/font for Google Fonts
**File:** `src/pages/_document.js` and `src/pages/_app.js`

Replace the render-blocking `<link>` tag in `_document.js`:
```html
<link href="https://fonts.googleapis.com/css2?family=Kanit:..." rel="stylesheet" />
```

With `next/font/google` in `_app.js`:
```js
import { Kanit } from 'next/font/google';
const kanit = Kanit({ subsets: ['latin'], weight: ['300','400','500','600','700'], display: 'swap' });
```

Apply via `className` on the root element. This eliminates the extra DNS lookup + network round-trip for fonts, enables font preloading, and sets CLS for fonts to 0.

### 3c. Hero image priority
**File:** `src/components/hero/DigitalAgencyHero.jsx`

Ensure the hero background `<Image>` has `priority` prop set. This adds `<link rel="preload">` for the LCP image automatically.

---

## Section 4 — HTTP Cache Headers

**File:** `next.config.js`

Add `headers()` to serve static assets with long-lived cache:

```js
async headers() {
  return [
    {
      source: '/assets/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      source: '/images/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
  ];
}
```

**Effect:** Repeat visitors load assets from browser cache instantly. CDN (Cloudflare, etc.) also caches these aggressively.

---

## Success Criteria

- Lighthouse Performance score: target 85+ (from estimated ~40–55)
- LCP: target < 2.5s
- TTFB: target < 200ms on homepage
- No regressions in animations, dark mode, or navigation
- FontAwesome icons still display correctly
- Blog posts on homepage update within 60s of DB change
