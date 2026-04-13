# Lazy Loading + Dead Code Removal Design
**Date:** 2026-04-13
**Project:** NOVAIMPACT PRO (Next.js 13.2, Pages Router)
**Goal:** Eliminate unused template code and lazy-load all below-fold homepage sections so the initial JS bundle is minimal and the page appears instantly.

---

## Problem Summary

1. **Dead template code:** The site uses only `Header3` and `Footer3` on every page, but `RootLayout` imports and switches between 5 header variants and 5 footer variants via `next/dynamic`. Header1/2/4/5 and Footer1/2/4/5 are never rendered. They exist only as dead files and dead imports.

2. **Eager homepage sections:** All 11 below-fold sections on the homepage are statically imported — their JS, GSAP animations, and Swiper library all load at page start, blocking the time-to-interactive even though the user hasn't scrolled to them yet.

---

## Section 1 — Delete Unused Headers/Footers + Simplify RootLayout

### Files to delete
- `src/components/header/Header1.jsx`
- `src/components/header/Header2.jsx`
- `src/components/header/Header4.jsx`
- `src/components/header/Header5.jsx`
- `src/components/footer/Footer1.jsx`
- `src/components/footer/Footer2.jsx`
- `src/components/footer/Footer4.jsx`
- `src/components/footer/Footer5.jsx`

### RootLayout simplification
**File:** `src/components/common/layout/RootLayout.jsx`

Remove the `HeaderContent` and `FooterContent` switch functions entirely. Remove all `next/dynamic` header/footer imports. Import `Header3` and `Footer3` as static imports and render them directly.

The `header` and `footer` props remain on the `RootLayout` component signature for the `error.jsx` page which passes `footer="none"` — handle that single case inline.

```jsx
import Header3 from "@/components/header/Header3";
import Footer3 from "@/components/footer/Footer3";

export default function RootLayout({ children, footer = "footer3" }) {
  // ...
  return (
    <>
      <Header3 />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          {children}
          {footer !== "none" && <Footer3 />}
        </div>
      </div>
    </>
  );
}
```

The `header` prop is no longer needed since only Header3 exists, but keeping it in the signature avoids touching every page file.

---

## Section 2 — Lazy-Load Below-Fold Homepage Sections

**File:** `src/pages/index.js`

Keep `DigitalAgencyHero` as a static import (above the fold, needed for LCP and SSR).

Convert all 11 other sections to `next/dynamic` with `{ ssr: false }`:

```js
import dynamic from "next/dynamic";

const DigitalAgencyRoll        = dynamic(() => import("@/components/roll/DigitalAgencyRoll"),               { ssr: false });
const DigitalAgencyAbout       = dynamic(() => import("@/components/about/DigitalAgencyAbout"),             { ssr: false });
const DigitalAgencyService     = dynamic(() => import("@/components/service/DigitalAgencyService"),         { ssr: false });
const DigitalAgencyCounter     = dynamic(() => import("@/components/counter/DigitalAgencyCounter"),         { ssr: false });
const DigitalAgencyWorkflow    = dynamic(() => import("@/components/workflow/DigitalAgencyWorkflow"),       { ssr: false });
const HomePortfolioV6          = dynamic(() => import("@/components/portfolio/HomePortfolioV6"),            { ssr: false });
const DigitalMarketingWorkflow = dynamic(() => import("@/components/workflow/DigitalMarketingWorkflow"),    { ssr: false });
const DigitalAgencyBlog        = dynamic(() => import("@/components/blog/DigitalAgencyBlog"),               { ssr: false });
const Team1                    = dynamic(() => import("@/components/team/Team1"),                           { ssr: false });
const Faq1                     = dynamic(() => import("@/components/faq/Faq1"),                             { ssr: false });
const HomeProcess              = dynamic(() => import("@/components/home/HomeProcess"),                     { ssr: false });
const DigitalAgencyCTA         = dynamic(() => import("@/components/cta/DigitalAgencyCTA"),                 { ssr: false });
```

**Why `ssr: false`:** These components all use GSAP ScrollTrigger, Swiper, or jQuery inside `useEffect`. They can't meaningfully server-render and disabling SSR avoids hydration mismatches and unnecessary server work.

**SEO impact:** None. The hero, meta tags, schema.org JSON-LD, and canonical URLs are all in the static part of the page. Below-fold sections are not crawled for their rendered HTML anyway.

---

## Success Criteria

- `npm run build` completes with no errors
- Homepage loads and displays the hero immediately
- Below-fold sections render as the user scrolls
- No console errors about missing components
- Header3 and Footer3 display correctly on all pages
- `error.jsx` still renders without a footer (footer="none" case handled)
- Build output no longer includes Header1/2/4/5 or Footer1/2/4/5 chunks
