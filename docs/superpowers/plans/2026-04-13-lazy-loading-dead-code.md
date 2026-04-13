# Lazy Loading + Dead Code Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Delete 8 unused header/footer files, simplify RootLayout to render Header3/Footer3 directly, and lazy-load all 11 below-fold homepage sections so the initial JS bundle is minimal.

**Architecture:** Task 1 deletes dead files and collapses RootLayout's switch logic into a direct render. Task 2 converts all below-fold homepage section imports from static to `next/dynamic` with `ssr: false`. Both tasks are independent and safe to do sequentially.

**Tech Stack:** Next.js 13.2 Pages Router, `next/dynamic`, React

---

## File Map

| File | Change |
|------|--------|
| `src/components/header/Header1.jsx` | Delete |
| `src/components/header/Header2.jsx` | Delete |
| `src/components/header/Header4.jsx` | Delete |
| `src/components/header/Header5.jsx` | Delete |
| `src/components/footer/Footer1.jsx` | Delete |
| `src/components/footer/Footer2.jsx` | Delete |
| `src/components/footer/Footer4.jsx` | Delete |
| `src/components/footer/Footer5.jsx` | Delete |
| `src/components/common/layout/RootLayout.jsx` | Simplify: remove switches, render Header3/Footer3 directly |
| `src/pages/index.js` | Convert 12 static section imports to `next/dynamic` with `ssr: false` |

---

## Task 1: Delete Unused Header/Footer Variants + Simplify RootLayout

**Files:**
- Delete: `src/components/header/Header1.jsx`
- Delete: `src/components/header/Header2.jsx`
- Delete: `src/components/header/Header4.jsx`
- Delete: `src/components/header/Header5.jsx`
- Delete: `src/components/footer/Footer1.jsx`
- Delete: `src/components/footer/Footer2.jsx`
- Delete: `src/components/footer/Footer4.jsx`
- Delete: `src/components/footer/Footer5.jsx`
- Modify: `src/components/common/layout/RootLayout.jsx`

- [ ] **Step 1: Delete the 8 unused files**

```bash
cd c:/laragon/www/NOVAIMPACT_PRO
rm src/components/header/Header1.jsx
rm src/components/header/Header2.jsx
rm src/components/header/Header4.jsx
rm src/components/header/Header5.jsx
rm src/components/footer/Footer1.jsx
rm src/components/footer/Footer2.jsx
rm src/components/footer/Footer4.jsx
rm src/components/footer/Footer5.jsx
```

- [ ] **Step 2: Replace RootLayout.jsx with the simplified version**

The current `RootLayout.jsx` imports all 5 header and footer variants via `next/dynamic` and uses two switch functions (`HeaderContent`, `FooterContent`) to pick between them. Since every page in the site uses `header="header3"` and `footer="footer3"`, replace the entire file with this simplified version that renders `Header3` and `Footer3` directly:

```jsx
import { useEffect, useRef, useState } from "react";
import Header3 from "@/components/header/Header3";
import Footer3 from "@/components/footer/Footer3";
import Preloader from "@/components/preloader/Preloader";
import CommonAnimation from "../CommonAnimation";
import ScrollSmootherComponents from "../ScrollSmootherComponents";
import CursorAnimation from "../CursorAnimation";
import Switcher from "../Switcher";
import ScrollTop from "../ScrollTop";

export default function RootLayout({
  children,
  header = "",
  footer = "",
  defaultMode = "",
}) {
  const [mode, setMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nova-theme-mode") || defaultMode;
    }
    return defaultMode;
  });

  const cursor1 = useRef();
  const cursor2 = useRef();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (mode === "dark") {
        document.querySelector("body").classList.add("dark");
      } else {
        document.querySelector("body").classList.remove("dark");
      }
      localStorage.setItem("nova-theme-mode", mode);
    }
  }, [mode]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleThemeChange = (e) => {
        setMode(e.detail);
      };
      window.addEventListener("theme-change", handleThemeChange);
      return () => window.removeEventListener("theme-change", handleThemeChange);
    }
  }, []);

  return (
    <>
      <CommonAnimation>
        <div className="has-smooth" id="has_smooth"></div>
        <ScrollSmootherComponents />
        <div className="cursor" id="team_cursor">
          Drag
        </div>
        <Preloader />
        <CursorAnimation cursor1={cursor1} cursor2={cursor2} />
        <Switcher
          setMode={setMode}
          mode={mode}
          cursor1={cursor1}
          cursor2={cursor2}
        />
        <ScrollTop />
        <Header3 />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            {children}
            {footer !== "none" && <Footer3 />}
          </div>
        </div>
      </CommonAnimation>
    </>
  );
}
```

Key changes from the original:
- Removed `import dynamic from "next/dynamic"` and all 10 dynamic header/footer imports
- Removed `HeaderContent` and `FooterContent` switch functions
- Removed unused `navData` state and `allNavData` import
- Added direct `import Header3` and `import Footer3`
- Renders `<Header3 />` directly (no navData prop — Header3 doesn't accept one)
- Renders `<Footer3 />` conditionally: `{footer !== "none" && <Footer3 />}` — this handles `error.jsx` which passes `footer="none"`
- The `header` and `footer` props are kept in the signature to avoid touching all page files

- [ ] **Step 3: Verify the build compiles**

```bash
npm run build
```

Expected: Build completes with no errors. The output should NOT include chunks named `Header1`, `Header2`, `Header4`, `Header5`, `Footer1`, `Footer2`, `Footer4`, `Footer5`.

- [ ] **Step 4: Verify pages render correctly**

Start the server and spot-check:
```bash
npm run start
```

Visit:
- `http://localhost:3000` — header and footer visible
- `http://localhost:3000/about` — header and footer visible
- `http://localhost:3000/contact` — header and footer visible

Check that the error page still works (it uses `footer="none"`):
- Navigate to a non-existent URL like `http://localhost:3000/does-not-exist` — should render 404 without footer, OR visit `http://localhost:3000/error` directly — header visible, no footer.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "perf: remove unused header/footer variants, simplify RootLayout to Header3/Footer3"
```

---

## Task 2: Lazy-Load Below-Fold Homepage Sections

**Files:**
- Modify: `src/pages/index.js`

- [ ] **Step 1: Replace static imports with next/dynamic imports**

Open `src/pages/index.js`. The current import block at the top looks like:

```js
import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import DigitalAgencyHero from "@/components/hero/DigitalAgencyHero";
import DigitalAgencyRoll from "@/components/roll/DigitalAgencyRoll";
import DigitalAgencyAbout from "@/components/about/DigitalAgencyAbout";
import DigitalAgencyService from "@/components/service/DigitalAgencyService";
import DigitalAgencyCounter from "@/components/counter/DigitalAgencyCounter";
import DigitalAgencyWorkflow from "@/components/workflow/DigitalAgencyWorkflow";
import HomePortfolioV6 from "@/components/portfolio/HomePortfolioV6";
import DigitalMarketingWorkflow from "@/components/workflow/DigitalMarketingWorkflow";
import DigitalAgencyBlog from "@/components/blog/DigitalAgencyBlog";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";
import Team1 from "@/components/team/Team1";
import Faq1 from "@/components/faq/Faq1";
import HomeProcess from "@/components/home/HomeProcess";
```

Replace with:

```js
import Head from "next/head";
import dynamic from "next/dynamic";
import RootLayout from "@/components/common/layout/RootLayout";
import DigitalAgencyHero from "@/components/hero/DigitalAgencyHero";

const DigitalAgencyRoll        = dynamic(() => import("@/components/roll/DigitalAgencyRoll"),            { ssr: false });
const DigitalAgencyAbout       = dynamic(() => import("@/components/about/DigitalAgencyAbout"),          { ssr: false });
const DigitalAgencyService     = dynamic(() => import("@/components/service/DigitalAgencyService"),      { ssr: false });
const DigitalAgencyCounter     = dynamic(() => import("@/components/counter/DigitalAgencyCounter"),      { ssr: false });
const DigitalAgencyWorkflow    = dynamic(() => import("@/components/workflow/DigitalAgencyWorkflow"),    { ssr: false });
const HomePortfolioV6          = dynamic(() => import("@/components/portfolio/HomePortfolioV6"),         { ssr: false });
const DigitalMarketingWorkflow = dynamic(() => import("@/components/workflow/DigitalMarketingWorkflow"), { ssr: false });
const DigitalAgencyBlog        = dynamic(() => import("@/components/blog/DigitalAgencyBlog"),            { ssr: false });
const DigitalAgencyCTA         = dynamic(() => import("@/components/cta/DigitalAgencyCTA"),              { ssr: false });
const Team1                    = dynamic(() => import("@/components/team/Team1"),                        { ssr: false });
const Faq1                     = dynamic(() => import("@/components/faq/Faq1"),                          { ssr: false });
const HomeProcess              = dynamic(() => import("@/components/home/HomeProcess"),                  { ssr: false });
```

Rules:
- `Head`, `RootLayout`, `DigitalAgencyHero` stay as static imports — they are needed for SSR (meta tags, layout shell, hero LCP element)
- All 12 below-fold sections become `next/dynamic` with `ssr: false`
- The rest of the file (JSX, `getStaticProps`, schema JSON-LD) is **not touched**

- [ ] **Step 2: Verify the homepage loads correctly**

```bash
npm run build && npm run start
```

Visit `http://localhost:3000`:
- Hero section renders immediately on load
- Scroll down — all sections (Roll ticker, About, Service, Counter, Workflow, Portfolio, Blog, Team, FAQ, Process, CTA) appear as you scroll
- No console errors about undefined components
- Dark mode toggle still works
- Animations still fire on scroll

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.js
git commit -m "perf: lazy-load all below-fold homepage sections with next/dynamic"
```
