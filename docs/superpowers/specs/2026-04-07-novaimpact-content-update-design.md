# Nova Impact — Content Update Design Spec
**Date:** 2026-04-07  
**Scope:** Replace all Axtra demo content with Nova Impact branding across all pages. Keep all design, styling, and animation code untouched.

---

## Context

The project is a Next.js 13 site built on the Axtra theme (Pages Router, Bootstrap 5, GSAP, Swiper). The home page lives at `/digital-agency`. All other supporting pages already exist with Axtra demo placeholder content. The goal is to update all text/copy/contact-info in-place with Nova Impact branding while preserving the Axtra design exactly.

---

## 1. Navigation — `src/data/navData.json`

Replace the existing megamenu structure with Nova Impact's simplified nav:

```
Home               → /digital-agency
Services ▼         → dropdown
  Website Creation
  Social Media Management
  Content Creation
  Meta Ads (Facebook & Instagram)
  Google Ads
  SEO (Search Engine Optimization)
  Brand Identity
  Comparator Creation (Personalized)
  Consulting & Support
  (all link to /service)
Case Studies ▼     → dropdown
  Our Solutions    → /portfolio-v4  (grid/masonry layout, each card → /portfolio-details)
  Our Work         → /portfolio-v5  (each card → /portfolio-details)
About              → /about
Blog               → /blog-dark
Contact            → /contact
[Start Project 🚀] → /contact  (CTA button)
```

---

## 2. Home Page Components (`/digital-agency`)

### DigitalAgencyHero.jsx
- Main title: **"NOVA IMPACT"**
- Subtitle: **"Your Partner for a Powerful Online Presence"**
- Description: "We help brands grow, scale, and stand out online through strategy, design, and performance-driven marketing."
- CTA button: **"Start Your Project"** → `/contact`
- Stat line: "From website creation to digital campaigns — solutions tailored to your business goals."

### DigitalAgencyAbout.jsx (homepage about section)
- Title: **"We unlock the potential of your business online"**
- Content: "At Nova Impact, we combine creativity, technology, and marketing to build digital experiences that convert. Results first — every action we take is focused on delivering real business impact."
- Button: **"Explore Us"** → `/about`

### DigitalAgencyService.jsx
- Section label: "Services"
- Title: **"Solutions We Provide"**
- Intro: "From strategy to execution, Nova Impact delivers digital solutions tailored to your business goals."
- 9 services (show first 4 on homepage, "View all" links to `/service`):
  1. Website Creation
  2. Social Media Management
  3. Meta Ads (Facebook & Instagram)
  4. Google Ads
  5. SEO (Search Engine Optimization)
  6. Content Creation
  7. Brand Identity
  8. Comparator Creation (Personalized)
  9. Consulting & Support
- Button: **"View All Services"** → `/service`

### DigitalAgencyCounter.jsx (Stats)
- **8X** — Increase in search traffic
- **+385%** — Mobile traffic growth
- **78%** — Increase in page views
- **15+** — Years of experience

### DigitalAgencyTestimonial.jsx
- Section title: **"What Our Clients Say"**
- Client 1: **Zoom Assurance** — "Nova Impact transformed our online presence. Our traffic and conversions improved dramatically within months."
- Client 2: **JBSWITCH** — "A professional and responsive team. They understood our needs and delivered beyond expectations."
- Client 3: **Mutuelle Pro Santé** — "Excellent collaboration from start to finish. Clear strategy, great execution, and strong results."

### DigitalAgencyBlog.jsx
- Section title: **"Latest Insights"**
- 6 posts:
  1. High-Speed Internet Trends
  2. Why Use Comparison Platforms?
  3. Telecom & Internet Evolution
  4. The Strategic Role of Agencies
  5. Understanding Digital Growth
  6. The Future of Comparison Platforms
- Button: **"Read More"** → `/blog-dark`

### DigitalAgencyCTA.jsx
- Title: **"Be Visible. Be Found."**
- Description: "Stop hiding from your customers. Start building a strong digital presence today."
- Email placeholder: "Enter your email to get started"
- Button: **"Launch My Project"**

---

## 3. About Page — `/about`

### AboutHero / page header
- Title: **"About Us"**
- Breadcrumb: Home → About

### AboutStory
- Section: **"Who We Are"** — "A team of passionate digital experts dedicated to helping businesses grow online through innovation and strategy."
- Section: **"What We Do"** — "We combine creativity, technology, and marketing to build digital experiences that convert."
- Section: **"Our Philosophy"** — "Results first. Every action we take is focused on delivering real business impact."

### AboutCounter
Same stats as homepage: 8X, +385%, 78%, 15+

### AboutTestimonial
Same 3 client testimonials as homepage.

---

## 4. Services Page — `/service`

- Page hero title: **"Our Services"**
- All 9 Nova Impact services listed with full descriptions:
  - **Website Creation** — Modern, fast, and conversion-focused websites designed to represent your brand and drive results.
  - **Social Media Management** — We build and manage your presence across platforms to engage your audience and grow your brand.
  - **Content Creation** — High-quality, impactful content tailored to your audience and business objectives.
  - **Meta Ads (Facebook & Instagram)** — Targeted ad campaigns designed to maximize ROI and bring qualified traffic.
  - **Google Ads** — Data-driven campaigns to capture demand and increase conversions.
  - **SEO (Search Engine Optimization)** — Improve your visibility on Google and attract organic traffic that converts.
  - **Brand Identity** — We craft strong, memorable brands that resonate with your audience.
  - **Comparator Creation (Personalized)** — We build custom comparison platforms tailored to your niche to drive traffic, leads, and monetization.
  - **Consulting & Support** — Strategic guidance to help you make the right digital decisions.

---

## 5. Portfolio Details — `/portfolio-details`

- All portfolio cards (from `/portfolio-v4` and `/portfolio-v5`) link here
- Project title: **"Zoom Assurance"** (primary example)
- Category: Digital Strategy & SEO
- Description: Full case study detail for Zoom Assurance
- CTA: "Start Your Project" → `/contact`

---

## 6. Contact Page — `/contact` — `Contact1.jsx`

- Title: **"Let's Get in Touch"**
- Intro: "We're excited to hear from you. Let's build something great together."
- CTA: **"Say hello to Nova Impact"**
- Phone: **+33 7 00 00 00 00**
- Email: **contact@novaimpact.co**
- Address: **Marseille, France**
- Form button: **"Send Message"**

---

## 7. Team Page — `/team` — `Team1.jsx`

- Title: **"Our Team"**
- Description: "A team of passionate digital experts — designers, strategists, and marketers — dedicated to growing your business online."
- Bottom title: "Your digital growth powered by our dedicated team"
- Bottom description: "More than a team — a growth partner. Our experts in design, SEO, ads, and content work together to deliver measurable results."
- Button: **"Join Our Team"** → `/contact`
- Keep existing 4 placeholder team members (images stay); update job titles to:
  - CEO & Founder
  - SEO Strategist
  - Digital Marketing Manager
  - Lead Designer

---

## 8. FAQ Page — `/faq` — `Faq1.jsx`

- Title: **"FAQ"**
- Subtitle: **"Frequently asked questions about Nova Impact's services."**
- 5 Q&As:
  1. **What services does Nova Impact offer?** — We offer website creation, social media management, content creation, Meta Ads, Google Ads, SEO, brand identity, comparator creation, and consulting.
  2. **How long does a website project take?** — Depending on complexity, most websites are delivered within 4–8 weeks from kickoff.
  3. **Do you work with small businesses?** — Yes. We work with businesses of all sizes, from startups to established brands.
  4. **How do I get started?** — Simply contact us via our contact page or email contact@novaimpact.co. We'll schedule a free discovery call.
  5. **What makes Nova Impact different?** — We're results-driven. Every strategy we deploy is focused on measurable business outcomes, not vanity metrics.

---

## 9. Blog Page — `/blog-dark` — `Blog1.jsx`

- Section title: **"Latest Insights"**
- 6 articles with Nova Impact blog titles (keep existing Axtra images):
  1. High-Speed Internet Trends
  2. Why Use Comparison Platforms?
  3. Telecom & Internet Evolution
  4. The Strategic Role of Agencies
  5. Understanding Digital Growth
  6. The Future of Comparison Platforms

---

## 10. Portfolio Page — `/portfolio-v5`

- Section title: **"Our Work"**
- 3 case studies (keep existing images):
  - **Zoom Assurance** — Digital Strategy & SEO
  - **JBSWITCH** — Website Creation & Google Ads
  - **Mutuelle Pro Santé** — Brand Identity & Meta Ads

---

## 11. Portfolio Details — `/portfolio-details`

- Project title: **"Zoom Assurance"**
- Category: Digital Strategy & SEO
- Description: Full case study detail for Zoom Assurance
- CTA: "Start Your Project" → `/contact`

---

## 12. Header & Footer

### Header3.jsx
- Remove/update support center phone to **+33 7 00 00 00 00**
- Logo files stay as-is (user will swap later)

### Footer3.jsx (or whichever footer is used)
- Company name: **Nova Impact**
- Address: **Marseille, France**
- Email: **contact@novaimpact.co**
- Phone: **+33 7 00 00 00 00**
- Services list: all 9 Nova Impact services
- Copyright: **© 2026 Nova Impact — All rights reserved**

---

## Files to Modify

| File | Change |
|---|---|
| `src/data/navData.json` | Replace nav with Nova Impact structure |
| `src/components/hero/DigitalAgencyHero.jsx` | Nova Impact hero copy |
| `src/components/about/DigitalAgencyAbout.jsx` | Nova Impact about copy |
| `src/components/service/DigitalAgencyService.jsx` | 9 services |
| `src/components/counter/DigitalAgencyCounter.jsx` | Stats numbers |
| `src/components/testimonial/DigitalAgencyTestimonial.jsx` | 3 client quotes |
| `src/components/blog/DigitalAgencyBlog.jsx` | 6 blog titles |
| `src/components/cta/DigitalAgencyCTA.jsx` | "Be Visible. Be Found." |
| `src/components/contact/Contact1.jsx` | Nova Impact contact info |
| `src/components/faq/Faq1.jsx` | 5 Nova Impact Q&As |
| `src/components/team/Team1.jsx` | Team descriptions |
| `src/components/header/Header3.jsx` | Phone number |
| `src/components/footer/Footer3.jsx` | Full footer content |
| `src/pages/about.jsx` | Meta title/description |
| `src/pages/service.jsx` | Meta title/description |
| `src/pages/service-details.jsx` | Meta title/description |
| `src/pages/contact.jsx` | Meta title/description |
| `src/pages/team.jsx` | Meta title/description |
| `src/pages/faq.jsx` | Meta title/description |
| `src/pages/blog-dark.jsx` | Meta title/description |
| `src/pages/portfolio-v5.jsx` | Meta title/description |
| `src/pages/portfolio-details.jsx` | Meta title/description |
| `src/pages/digital-agency.jsx` | Meta title/description |

---

## Verification

1. Run `npm run dev` and visit `http://localhost:3001/digital-agency`
2. Check navbar shows Nova Impact menu items and dropdowns work
3. Verify hero shows "NOVA IMPACT" headline
4. Check all 9 services render on `/service`
5. Check contact info (Marseille, +33...) on `/contact` and footer
6. Visit `/blog-dark`, `/portfolio-v5`, `/faq`, `/team`, `/about` and confirm Nova Impact copy
7. Confirm no design/animation regressions — all Axtra effects intact
