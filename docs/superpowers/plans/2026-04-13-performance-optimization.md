# Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce first-load time and improve Core Web Vitals (LCP, FCP, CLS, TTI) across the Nova Impact website.

**Architecture:** Four independent optimization layers: (1) ISR replaces SSR on the homepage, (2) dynamic imports shrink the JS bundle for headers/footers and GSAP plugins, (3) CSS/font cleanup removes ~400KB of duplicate stylesheet weight, (4) HTTP cache headers ensure repeat visitors pay nothing for static assets.

**Tech Stack:** Next.js 13.2 (Pages Router), GSAP 3, Bootstrap 5, FontAwesome SVG Core, next/font/google, Prisma

---

## File Map

| File | Change |
|------|--------|
| `src/pages/index.js` | `getServerSideProps` → `getStaticProps` + `revalidate: 60` |
| `src/components/common/layout/RootLayout.jsx` | Static header/footer imports → `next/dynamic` |
| `src/components/common/ScrollSmootherComponents.jsx` | Top-level plugin import → dynamic `import()` in `useEffect` |
| `src/components/common/CommonAnimation.jsx` | Top-level plugin imports → dynamic `import()` in `useEffect` |
| `src/components/hero/DigitalAgencyHero.jsx` | Remove duplicate FA CSS, lazy-load GSAP plugins |
| `src/components/team/CreativeAgencyTeam.jsx` | Remove duplicate FA CSS, lazy-load ScrollTrigger |
| `src/pages/_document.js` | Remove Google Fonts `<link>` tags |
| `src/pages/_app.js` | Add `next/font/google` Kanit, apply to root |
| `next.config.js` | Add `headers()` for static asset caching |

---

## Task 1: ISR on Homepage

**Files:**
- Modify: `src/pages/index.js`

- [ ] **Step 1: Replace `getServerSideProps` with `getStaticProps`**

Open `src/pages/index.js`. Find the export at the bottom of the file (around line 110+):

```js
// REMOVE THIS:
export async function getServerSideProps() {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true, slug: true, titleFr: true,
        excerptFr: true, coverImage: true,
        category: true, publishedAt: true,
      },
    });
    return {
      props: {
        latestPosts: JSON.parse(JSON.stringify(posts)),
      },
    };
  } finally {
    await prisma.$disconnect();
  }
}
```

Replace it with:

```js
export async function getStaticProps() {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true, slug: true, titleFr: true,
        excerptFr: true, coverImage: true,
        category: true, publishedAt: true,
      },
    });
    return {
      props: {
        latestPosts: JSON.parse(JSON.stringify(posts)),
      },
      revalidate: 60,
    };
  } finally {
    await prisma.$disconnect();
  }
}
```

- [ ] **Step 2: Verify the dev server still works**

```bash
cd c:/laragon/www/NOVAIMPACT_PRO
npm run dev
```

Open `http://localhost:3000` — homepage must load and show blog posts. Check browser DevTools Network tab: the HTML response should arrive much faster (no DB wait on subsequent visits in production).

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.js
git commit -m "perf: switch homepage from SSR to ISR (revalidate 60s)"
```

---

## Task 2: Dynamic Imports for Headers and Footers

**Files:**
- Modify: `src/components/common/layout/RootLayout.jsx`

- [ ] **Step 1: Replace all static header/footer imports with `next/dynamic`**

Open `src/components/common/layout/RootLayout.jsx`. Replace the entire block of static imports at the top of the file:

```js
// REMOVE THESE 10 static imports:
import Header1 from "@/components/header/Header1";
import Header2 from "@/components/header/Header2";
import Header3 from "@/components/header/Header3";
import Header4 from "@/components/header/Header4";
import Header5 from "@/components/header/Header5";
import Footer1 from "@/components/footer/Footer1";
import Footer2 from "@/components/footer/Footer2";
import Footer3 from "@/components/footer/Footer3";
import Footer4 from "@/components/footer/Footer4";
import Footer5 from "@/components/footer/Footer5";
```

Replace with:

```js
import dynamic from "next/dynamic";

const Header1 = dynamic(() => import("@/components/header/Header1"));
const Header2 = dynamic(() => import("@/components/header/Header2"));
const Header3 = dynamic(() => import("@/components/header/Header3"));
const Header4 = dynamic(() => import("@/components/header/Header4"));
const Header5 = dynamic(() => import("@/components/header/Header5"));
const Footer1 = dynamic(() => import("@/components/footer/Footer1"));
const Footer2 = dynamic(() => import("@/components/footer/Footer2"));
const Footer3 = dynamic(() => import("@/components/footer/Footer3"));
const Footer4 = dynamic(() => import("@/components/footer/Footer4"));
const Footer5 = dynamic(() => import("@/components/footer/Footer5"));
```

Note: Do NOT add `{ ssr: false }` — these components contain nav/footer HTML that should still be server-rendered for SEO. The dynamic import here simply splits them into separate JS chunks so unused ones are never sent to the browser.

- [ ] **Step 2: Verify the site still renders header and footer**

With `npm run dev` running, visit `http://localhost:3000`. Confirm:
- Header is visible
- Footer is visible
- Navigation links work
- Dark mode toggle still works

- [ ] **Step 3: Commit**

```bash
git add src/components/common/layout/RootLayout.jsx
git commit -m "perf: dynamic import headers/footers to reduce JS bundle per page"
```

---

## Task 3: Lazy-Load GSAP Plugins in ScrollSmootherComponents

**Files:**
- Modify: `src/components/common/ScrollSmootherComponents.jsx`

- [ ] **Step 1: Move plugin import inside `useEffect`**

Open `src/components/common/ScrollSmootherComponents.jsx`. Replace the entire file content with:

```js
import { useEffect } from "react";
import { gsap } from "gsap";

const ScrollSmootherComponents = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@/plugins").then(({ ScrollSmoother }) => {
        gsap.registerPlugin(ScrollSmoother);
        let device_width = window.innerWidth;
        let tHero = gsap.context(() => {
          ScrollSmoother.create({
            smooth: 1,
            effects: device_width < 1025 ? false : true,
            smoothTouch: false,
            normalizeScroll: false,
            ignoreMobileResize: true,
          });
        });
        return () => tHero.revert();
      });
    }
  }, []);
  return <div></div>;
};

export default ScrollSmootherComponents;
```

- [ ] **Step 2: Verify smooth scroll still works**

With `npm run dev` running, visit `http://localhost:3000`. Scroll down the page — the smooth scrolling effect should still be active on desktop.

- [ ] **Step 3: Commit**

```bash
git add src/components/common/ScrollSmootherComponents.jsx
git commit -m "perf: lazy-load ScrollSmoother plugin after first paint"
```

---

## Task 4: Lazy-Load GSAP Plugins in CommonAnimation

**Files:**
- Modify: `src/components/common/CommonAnimation.jsx`

- [ ] **Step 1: Read the current file to understand its full structure**

Read `src/components/common/CommonAnimation.jsx` fully before editing — it is 161 lines and the plugin usage is spread throughout the `useEffect`.

- [ ] **Step 2: Replace top-level plugin imports with dynamic import inside `useEffect`**

At the top of `CommonAnimation.jsx`, the current imports are:

```js
import { gsap } from "gsap";
import {
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  SplitText,
} from "@/plugins";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
```

Replace those lines with just:

```js
import { gsap } from "gsap";
```

Then, inside the `useEffect` (at the very beginning, before any GSAP code runs), add the dynamic import and wrap all existing animation code inside the `.then()` callback:

```js
useEffect(() => {
  if (typeof window !== "undefined") {
    import("@/plugins").then(({ ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText }) => {
      gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

      // ... ALL existing animation code goes here unchanged ...

    });
  }
}, []);
```

The key rule: every reference to `ScrollTrigger`, `SplitText`, `ScrollToPlugin`, `ScrollSmoother` inside `useEffect` must be inside the `.then()` callback. Do not move any other code — only wrap existing code.

- [ ] **Step 3: Verify animations still trigger on scroll**

With `npm run dev` running, visit `http://localhost:3000`. Scroll through the page and confirm:
- Button hover effects work
- Scroll-triggered animations fire (counters, text reveals, etc.)
- No console errors about `ScrollTrigger is not defined`

- [ ] **Step 4: Commit**

```bash
git add src/components/common/CommonAnimation.jsx
git commit -m "perf: lazy-load GSAP plugins in CommonAnimation after first paint"
```

---

## Task 5: Lazy-Load GSAP in DigitalAgencyHero + Remove Duplicate FA CSS

**Files:**
- Modify: `src/components/hero/DigitalAgencyHero.jsx`

- [ ] **Step 1: Remove duplicate FontAwesome import and lazy-load SplitText**

Open `src/components/hero/DigitalAgencyHero.jsx`. Make two changes:

**Change 1** — Remove line 4 (the duplicate FA import):
```js
// REMOVE THIS LINE:
import "@fortawesome/fontawesome-free/css/all.min.css";
```

**Change 2** — The top of the file currently has:
```js
import { gsap } from "gsap";
import { SplitText } from "@/plugins";
```

Replace with just:
```js
import { gsap } from "gsap";
```

**Change 3** — Inside `useEffect`, the current code starts with:
```js
useEffect(() => {
  if (typeof window !== "undefined") {
    let tHero = gsap.context(() => {
      gsap.set(".experience", { y: 50, opacity: 0 });
      let split_hero__title = new SplitText(heroTitle.current, { type: "chars" });
      let split_hero__subtitle = new SplitText(heroSubTitle.current, { type: "chars words" });
      // ... more animation code
    });
    return () => tHero.revert();
  }
}, []);
```

Replace with:
```js
useEffect(() => {
  if (typeof window !== "undefined") {
    import("@/plugins").then(({ SplitText }) => {
      let tHero = gsap.context(() => {
        gsap.set(".experience", { y: 50, opacity: 0 });
        let split_hero__title = new SplitText(heroTitle.current, { type: "chars" });
        let split_hero__subtitle = new SplitText(heroSubTitle.current, { type: "chars words" });

        gsap.from(split_hero__title.chars, {
          duration: 1,
          x: 70,
          autoAlpha: 0,
          stagger: 0.1,
        });
        gsap.from(
          split_hero__subtitle.words,
          { duration: 1, x: 50, autoAlpha: 0, stagger: 0.05 },
          "-=1"
        );
        gsap.to(
          ".experience",
          { y: 0, opacity: 1, duration: 2, ease: "power2.out" },
          "-=1.5"
        );
      });
      // Note: cleanup handled by component unmount via gsap.context
    });
  }
}, []);
```

- [ ] **Step 2: Verify hero animations still play**

With `npm run dev`, visit `http://localhost:3000`. Confirm the hero title and subtitle animate in on load. Confirm no console errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/DigitalAgencyHero.jsx
git commit -m "perf: remove duplicate FA CSS, lazy-load SplitText in hero"
```

---

## Task 6: Remove Duplicate FA CSS in CreativeAgencyTeam + Lazy-Load ScrollTrigger

**Files:**
- Modify: `src/components/team/CreativeAgencyTeam.jsx`

- [ ] **Step 1: Read the full file**

Read `src/components/team/CreativeAgencyTeam.jsx` to understand all GSAP usage before editing.

- [ ] **Step 2: Remove duplicate FA CSS and lazy-load ScrollTrigger**

At the top of `CreativeAgencyTeam.jsx`:

```js
// REMOVE these two lines:
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ScrollTrigger } from "@/plugins";
gsap.registerPlugin(ScrollTrigger);
```

Replace with just:
```js
import { gsap } from "gsap";
```

Then inside the `useEffect`, wrap all animation code that uses `ScrollTrigger`:

```js
useEffect(() => {
  if (typeof window !== "undefined") {
    import("@/plugins").then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      // ... ALL existing animation code unchanged inside here
    });
  }
}, []);
```

- [ ] **Step 3: Verify team section animations still work**

Navigate to a page that uses `CreativeAgencyTeam`. Scroll to the team section — animations should trigger. No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/team/CreativeAgencyTeam.jsx
git commit -m "perf: remove duplicate FA CSS, lazy-load ScrollTrigger in team component"
```

---

## Task 7: Replace Google Fonts Link with next/font

**Files:**
- Modify: `src/pages/_document.js`
- Modify: `src/pages/_app.js`

- [ ] **Step 1: Remove the Google Fonts `<link>` tags from `_document.js`**

Open `src/pages/_document.js`. Remove these lines:

```js
// REMOVE ALL of these:
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link
  href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

The `_document.js` `<Head>` section should now only contain the charset meta and favicon links.

- [ ] **Step 2: Add `next/font/google` in `_app.js`**

Open `src/pages/_app.js`. Add the font import and apply it. The updated file should look like:

```js
import { Kanit } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../public/assets/scss/master.scss";
import "@/styles/extra.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-kanit",
});

export default function App({ Component, pageProps }) {
  return (
    <main className={kanit.className}>
      <Component {...pageProps} />
    </main>
  );
}
```

- [ ] **Step 3: Verify font renders correctly**

With `npm run dev`, visit `http://localhost:3000`. The Kanit font should render identically to before. Open DevTools → Network tab → filter by "Font" — you should see fonts loaded from `/_next/static/` (local) instead of `fonts.googleapis.com`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/_document.js src/pages/_app.js
git commit -m "perf: replace Google Fonts link tag with next/font for zero layout shift"
```

---

## Task 8: HTTP Cache Headers for Static Assets

**Files:**
- Modify: `next.config.js`

- [ ] **Step 1: Add `headers()` to next.config.js**

Open `next.config.js`. Add a `headers()` async function inside `nextConfig`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'images.pexels.com',
      'images.unsplash.com',
      'img.youtube.com',
      'i.ytimg.com',
      'i.vimeocdn.com',
      'vumbnail.com',
      'cdn.coverr.co',
      'storage.googleapis.com',
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 604800,
  },
  experimental: {
    optimizePackageImports: ['swiper', '@fortawesome/free-solid-svg-icons', '@fortawesome/react-fontawesome'],
  },
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/blog/:lang(fr|en)/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        has: [{ type: 'query', key: 'lang' }],
        destination: '/blog/:slug*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

- [ ] **Step 2: Verify cache headers are set**

```bash
npm run build && npm run start
```

Then run:
```bash
curl -I http://localhost:3000/images/hero-background.webp
```

Expected output includes:
```
Cache-Control: public, max-age=31536000, immutable
```

- [ ] **Step 3: Commit**

```bash
git add next.config.js
git commit -m "perf: add long-lived Cache-Control headers for static assets"
```

---

## Final Verification

- [ ] Run `npm run build` — build must complete with no errors
- [ ] Run `npm run start` — visit `http://localhost:3000`, all pages must load correctly
- [ ] Confirm hero animations play, smooth scroll works, dark mode toggles correctly
- [ ] Confirm FontAwesome icons are visible (header, footer, hero, team sections)
- [ ] Confirm blog posts appear on the homepage
- [ ] Open DevTools Network tab — fonts should load from `/_next/static/` not `fonts.googleapis.com`
- [ ] Run a Lighthouse audit in Chrome DevTools on `http://localhost:3000` — Performance score should be 80+
