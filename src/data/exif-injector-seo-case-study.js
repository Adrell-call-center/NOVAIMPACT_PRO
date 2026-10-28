// Structured data for the EXIF Injector organic-growth SEO case study.
// Traffic + user-growth figures are shown publicly; revenue (MRR / paid-user
// counts) is intentionally kept private per client request.
//
// Sources:
//  - Product analytics (monthly signups / active users) — metaimage monthly stats, 2026-03 → 2026-10
//  - Google Search Console (exifinjector.com) — last 12 months + latest 28 days

export const EXIF_SEO_PATH = "/exif-injector-seo-case-study";

export const liveUrl = "https://exifinjector.com/";

// Verified Google Search Console totals (rolling 12 months to 2026-10).
export const searchTotals = {
  clicks: "12,000+",
  impressions: "415K",
  ctr: "2.2%",
  avgPosition: "10.2",
  nonBranded: "90%",
  adSpend: "$0",
};

// Latest 28-day snapshot (Google Search Console Insights).
export const latest28Days = {
  clicks: "3,530",
  clicksChange: "+35%",
  impressions: "118K",
  impressionsChange: "+17%",
};

// Headline KPI strip.
export const kpis = [
  { value: "0 → 12K+", label: "Organic clicks in ~7 months", sub: "Google Search, last 12 months" },
  { value: "415K", label: "Organic impressions", sub: "Zero paid media" },
  { value: "3,095", label: "Registered users", sub: "100% inbound / organic" },
  { value: "$0", label: "Spent on ads", sub: "No Google or Meta Ads" },
];

// Month-by-month product growth (exact, from analytics). No revenue fields.
export const monthly = [
  { month: "Mar 2026", newUsers: 2, cumulative: 2, growth: null, active: 0 },
  { month: "Apr 2026", newUsers: 46, cumulative: 48, growth: "+2,200%", active: 0 },
  { month: "May 2026", newUsers: 70, cumulative: 118, growth: "+52%", active: 7 },
  { month: "Jun 2026", newUsers: 163, cumulative: 281, growth: "+133%", active: 25 },
  { month: "Jul 2026", newUsers: 297, cumulative: 578, growth: "+82%", active: 33 },
  { month: "Aug 2026", newUsers: 374, cumulative: 952, growth: "+26%", active: 31 },
  { month: "Sep 2026", newUsers: 931, cumulative: 1883, growth: "+149%", active: 143 },
  { month: "Oct 2026", newUsers: 1212, cumulative: 3095, growth: "+30%", active: 229 },
];

// Narrative timeline — what happened each phase and why it compounded.
export const timeline = [
  {
    month: "Mar 2026",
    tag: "Launch & foundation",
    text:
      "EXIF Injector went live. Before writing a single blog post, we shipped a crawlable, fast Next.js architecture, clean metadata tool pages, canonical URLs and structured data — so every page Google found was ready to rank.",
  },
  {
    month: "Apr 2026",
    tag: "First indexation wave",
    text:
      "The tool pages entered the index and the first 46 users arrived — a +2,200% jump off a tiny base. Early signals confirmed demand for free, no-login EXIF viewing, editing and injection.",
  },
  {
    month: "May 2026",
    tag: "Content engine starts",
    text:
      "We began publishing intent-matched guides and comparison articles around high-volume metadata queries (exif viewer, exif editor, batch exif). Signups grew to 70 as more long-tail pages started surfacing.",
  },
  {
    month: "Jun 2026",
    tag: "Breakout",
    text:
      "We rolled out IndexNow and submitted the full URL set for instant indexing, then expanded the programmatic tool and guide pages. New signups jumped +133% to 163 as rankings widened across non-branded terms.",
  },
  {
    month: "Jul 2026",
    tag: "Compounding",
    text:
      "Published content kept maturing in the SERPs. 297 new users joined (+82%) with no additional spend — the classic SEO compounding curve where earlier pages keep earning.",
  },
  {
    month: "Aug 2026",
    tag: "Consolidation",
    text:
      "We doubled down on the pages already gaining traction — refreshing titles, internal links and schema — holding momentum at 374 new signups while strengthening topical authority.",
  },
  {
    month: "Sep 2026",
    tag: "Inflection point",
    text:
      "Authority and rankings matured together: 931 new users in a single month (+149%), active users jumping to 143. Non-branded search became the dominant acquisition channel.",
  },
  {
    month: "Oct 2026",
    tag: "Scaling",
    text:
      "1,212 new users pushed the total past 3,095, with 3,530 organic clicks and 118K impressions in the trailing 28 days (+35% / +17%). The flywheel is now self-sustaining — still $0 in ads.",
  },
];

// The organic levers that drove the growth.
export const strategy = [
  {
    title: "Technical SEO & Core Web Vitals",
    text:
      "Server-rendered Next.js, fast loads, clean canonical/robots rules and valid structured data gave every page the best possible chance to rank from day one.",
  },
  {
    title: "Programmatic tool & landing pages",
    text:
      "Scalable, templated pages targeting each metadata intent (view, edit, inject, remove, convert) captured a wide spread of long-tail, non-branded search demand.",
  },
  {
    title: "Intent-matched content & guides",
    text:
      "Guides and comparison posts answering real questions (“when was this photo taken”, “how to remove C2PA metadata”, tool comparisons) pulled in top-of-funnel traffic that converted into signups.",
  },
  {
    title: "IndexNow & fast indexing",
    text:
      "We pushed new and updated URLs through IndexNow so Google and Bing discovered pages in hours, not weeks — accelerating the whole ranking curve.",
  },
  {
    title: "On-page & internal linking",
    text:
      "Keyword-aligned titles, descriptions, headings and a deliberate internal-linking structure concentrated authority on the pages that mattered most.",
  },
  {
    title: "Rank-driven iteration",
    text:
      "We watched Search Console weekly and reinvested in what was already climbing — refreshing content and expanding topics where the data showed clear momentum.",
  },
];

// Top non-branded queries (Google Search Console, last 12 months).
export const topQueries = [
  { query: "exif injector", clicks: "747", impressions: "1,062", branded: true },
  { query: "jeffrey's image metadata viewer", clicks: "164", impressions: "1,516" },
  { query: "exif tools", clicks: "125", impressions: "9,773" },
  { query: "exifinjector", clicks: "121", impressions: "164", branded: true },
  { query: "exif extractor", clicks: "96", impressions: "6,634" },
  { query: "pic2map", clicks: "47", impressions: "4,294" },
  { query: "exif.tools", clicks: "22", impressions: "1,405" },
  { query: "dreamstime metadata generator", clicks: "21", impressions: "36" },
  { query: "batch exif editor", clicks: "18", impressions: "404" },
];

// Top organic pages (Search Console Insights).
export const topPages = [
  "Image Tools — EXIF Viewer, Editor, Injector & Remover (homepage)",
  "C2PA Remover: Remove C2PA Metadata & Content Credentials",
  "Jeffrey's Image Metadata Viewer vs ExifInject — Comparison",
  "When Was This Photo Taken? How to Find the Date from EXIF Data",
  "Remove Suno AI Metadata from MP3 & WAV — Creator's Guide",
];

// Top countries by organic clicks (last 28 days).
export const topCountries = [
  { country: "United States", share: 15 },
  { country: "India", share: 11 },
  { country: "France", share: 7 },
  { country: "United Kingdom", share: 6 },
  { country: "Indonesia", share: 4 },
];

export const faqs = [
  {
    question: "How did EXIF Injector grow without paid ads?",
    answer:
      "Entirely through organic search. Nova Impact built EXIF Injector on a technically sound, fast Next.js foundation, then scaled programmatic tool pages and intent-matched guides targeting metadata-related searches. Combined with IndexNow for fast indexing and weekly Search Console analysis, the site grew from zero to more than 12,000 organic clicks and 3,095 users in about seven months — with $0 spent on Google or Meta Ads.",
  },
  {
    question: "How long did it take to see SEO results?",
    answer:
      "First meaningful signups appeared within the first full month after launch, but the real inflection came around months 4–7. Organic growth compounds: pages published early keep gaining rankings, so each month's content adds to the last. By September 2026 the site was adding over 900 new users per month from search alone.",
  },
  {
    question: "How much organic traffic does EXIF Injector get?",
    answer:
      "Over the last 12 months EXIF Injector earned more than 12,000 clicks and 415,000+ impressions from Google Search, at an average position of around 10. In the most recent 28 days it reached 3,530 clicks and 118,000 impressions — up 35% and 17% respectively. Around 90% of that traffic is non-branded, meaning it comes from people searching for the problem, not the brand name.",
  },
  {
    question: "What is a SaaS SEO case study?",
    answer:
      "A SaaS SEO case study documents how a software product grew its users and revenue through organic search rather than paid advertising. This one shows the exact month-by-month trajectory of EXIF Injector — an AI metadata SaaS — including the strategy, the traffic growth and the user growth that resulted.",
  },
  {
    question: "What SEO strategies drove the growth?",
    answer:
      "Six levers worked together: technical SEO and fast Core Web Vitals, programmatic tool/landing pages, intent-matched content and guides, IndexNow for rapid indexing, disciplined on-page optimization and internal linking, and weekly rank-driven iteration that reinvested in whatever was already climbing.",
  },
  {
    question: "Can Nova Impact do the same for my SaaS or website?",
    answer:
      "Yes. Nova Impact designs and executes organic growth systems — technical SEO, content, programmatic pages and ongoing optimization — built to acquire users without paid ads. Book a strategy call and we'll map the same approach to your product and market.",
  },
];
