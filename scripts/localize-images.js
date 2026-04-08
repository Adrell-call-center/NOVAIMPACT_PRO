#!/usr/bin/env node
/**
 * Downloads all remote images (Unsplash + Pexels) and gives each a descriptive name.
 * Then updates all source files to use local /images/ paths.
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "../public/images");

// ─── IMAGE MAP ───────────────────────────────────────────────────────────────
// key   = local filename (no path)
// value = remote URL to download from
const IMAGES = {
  // ── HERO ─────────────────────────────────────────────────────────────────
  "hero-background.jpg":
    "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "about-hero.jpg":
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&h=800&q=80",

  // ── FOOTER ───────────────────────────────────────────────────────────────
  "footer-background.jpg":
    "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=2560",

  // ── ABOUT ────────────────────────────────────────────────────────────────
  "about-team-meeting.jpg":
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=1067&q=80",
  "about-team-collaboration.jpg":
    "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=440&h=587&q=80",
  "about-values-workspace.jpg":
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&h=600&q=80",
  "about-values-brainstorm.jpg":
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&h=800&q=80",

  // ── STORY ────────────────────────────────────────────────────────────────
  "story-consulting-team.jpg":
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&h=900&q=80",
  "story-strategy-meeting.jpg":
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1040&h=693&q=80",
  "story-social-media-team.jpg":
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=820&h=547&q=80",

  // ── TEAM / TESTIMONIALS ───────────────────────────────────────────────────
  "team-member-male-1.jpg":
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&h=800&q=80",
  "team-member-female-1.jpg":
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=800&q=80",
  "team-member-male-2.jpg":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=800&q=80",
  "team-member-female-2.jpg":
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&h=800&q=80",

  // ── FAQ ───────────────────────────────────────────────────────────────────
  "faq-office.jpg":
    "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&h=800&q=80",

  // ── HOME RESULTS ─────────────────────────────────────────────────────────
  "results-analytics.jpg":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&h=534&q=80",
  "results-data.jpg":
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&h=534&q=80",
  "results-social-media.jpg":
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&h=534&q=80",

  // ── SERVICES (hero images) ────────────────────────────────────────────────
  "service-hero-left.jpg":
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=870&h=1160&q=80",
  "service-hero-right.jpg":
    "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=440&h=587&q=80",
  "service-hero-background.jpg":
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=920&h=1227&q=80",

  // ── SERVICE CARDS ─────────────────────────────────────────────────────────
  "service-content-creation.jpg":
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=560&h=747&q=80",
  "service-social-media.jpg":
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=560&h=747&q=80",
  "service-meta-ads.jpg":
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=560&h=747&q=80",
  "service-google-ads.jpg":
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=560&h=747&q=80",

  // Service1 grid
  "service-grid-content-a.jpg":
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&h=800&q=80",
  "service-grid-comparator.jpg":
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&h=800&q=80",
  "service-grid-web-dev.jpg":
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&h=800&q=80",
  "service-grid-social-media.jpg":
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&h=800&q=80",
  "service-grid-social-mgmt.jpg":
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&h=800&q=80",
  "service-grid-seo.jpg":
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=600&h=800&q=80",
  "service-grid-analytics.jpg":
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&h=800&q=80",
  "service-grid-team-meeting.jpg":
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&h=800&q=80",
  "service-grid-technology.jpg":
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&h=800&q=80",
  "service-grid-meta-ads.jpg":
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&h=800&q=80",
  "service-grid-collaboration.jpg":
    "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=600&h=800&q=80",
  "service-grid-google-ads.jpg":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=800&q=80",

  // ── SERVICE DETAIL: Website Creation ─────────────────────────────────────
  "website-creation-img1.jpg":
    "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&h=600&q=80",
  "website-creation-img2.jpg":
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&h=800&q=80",
  "website-creation-detail.jpg":
    "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1260&h=710&q=80",
  "website-creation-faq.jpg":
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&h=800&q=80",

  // ── SERVICE DETAIL: Comparator Creation ──────────────────────────────────
  "comparator-img1.jpg":
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&h=600&q=80",
  "comparator-img2.jpg":
    "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=600&h=800&q=80",
  "comparator-detail.jpg":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1260&h=710&q=80",
  "comparator-faq.jpg":
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&h=800&q=80",

  // ── SERVICE DETAIL: Brand Identity ───────────────────────────────────────
  "brand-identity-img1.jpg":
    "https://images.unsplash.com/photo-1634084462412-b54873c0a56d?auto=format&fit=crop&w=800&h=600&q=80",
  "brand-identity-img2.jpg":
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&h=800&q=80",
  "brand-identity-detail.jpg":
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1260&h=710&q=80",
  "brand-identity-faq.jpg":
    "https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&w=600&h=800&q=80",

  // ── SERVICE DETAIL: Google Ads ────────────────────────────────────────────
  "google-ads-img1.jpg":
    "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=800&h=600&q=80",
  "google-ads-img2.jpg":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=800&q=80",
  "google-ads-detail.jpg":
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1260&h=710&q=80",
  "google-ads-faq.jpg":
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&h=800&q=80",

  // ── SERVICE DETAIL: Consulting & Support ──────────────────────────────────
  "consulting-img1.jpg":
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&h=600&q=80",
  "consulting-img2.jpg":
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&h=800&q=80",
  "consulting-detail.jpg":
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1260&h=710&q=80",
  "consulting-faq.jpg":
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&h=800&q=80",

  // ── SERVICE DETAIL: Content Creation ─────────────────────────────────────
  "content-creation-img1.jpg":
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&h=600&q=80",
  "content-creation-img2.jpg":
    "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&h=800&q=80",
  "content-creation-detail.jpg":
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1260&h=710&q=80",
  "content-creation-faq.jpg":
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&h=800&q=80",

  // ── SERVICE DETAIL: Social Media Management ───────────────────────────────
  "social-media-mgmt-img1.jpg":
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&h=600&q=80",
  "social-media-mgmt-img2.jpg":
    "https://images.unsplash.com/photo-1600096194534-95cf5ece2e2e?auto=format&fit=crop&w=600&h=800&q=80",
  "social-media-mgmt-detail.jpg":
    "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=1260&h=710&q=80",
  "social-media-mgmt-faq.jpg":
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&h=800&q=80",

  // ── SERVICE DETAIL: Meta Ads ──────────────────────────────────────────────
  "meta-ads-img1.jpg":
    "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=800&h=600&q=80",
  "meta-ads-img2.jpg":
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&h=800&q=80",
  "meta-ads-detail.jpg":
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1260&h=710&q=80",
  "meta-ads-faq.jpg":
    "https://images.unsplash.com/photo-1579869847557-1f67382cc158?auto=format&fit=crop&w=600&h=800&q=80",

  // ── SERVICE DETAIL: SEO ───────────────────────────────────────────────────
  "seo-img1.jpg":
    "https://images.unsplash.com/photo-1572177812156-58036aae439c?auto=format&fit=crop&w=800&h=600&q=80",
  "seo-img2.jpg":
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=600&h=800&q=80",
  "seo-detail.jpg":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1260&h=710&q=80",
  "seo-faq.jpg":
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&h=800&q=80",

  // ── SERVICE DETAIL: ServiceDetailsService ─────────────────────────────────
  "service-details-main.jpg":
    "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1260&q=80",

  // ── PORTFOLIO ─────────────────────────────────────────────────────────────
  "portfolio-analytics.jpg":
    "https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1540",
  "portfolio-website.jpg":
    "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1540",
  "portfolio-marketing.jpg":
    "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1540",
  "portfolio-branding.jpg":
    "https://images.pexels.com/photos/326508/pexels-photo-326508.jpeg?auto=compress&cs=tinysrgb&w=1540",
  "portfolio-macbook.jpg":
    "https://images.pexels.com/photos/39284/macbook-apple-imac-computer-39284.jpeg?auto=compress&cs=tinysrgb&w=1540",
  "portfolio-imac.jpg":
    "https://images.pexels.com/photos/38544/imac-apple-mockup-app-38544.jpeg?auto=compress&cs=tinysrgb&w=1540",
  "portfolio-coding.jpg":
    "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1540",
};

// ─── SOURCE FILE REPLACEMENTS ────────────────────────────────────────────────
// Each entry: [file, oldValue, newLocalPath]
const REPLACEMENTS = [
  // _document.js - remove pexels preconnect
  ["src/pages/_document.js",
   `        <link rel="preconnect" href="https://images.pexels.com" />\n`, ""],

  // Hero
  ["src/components/hero/DigitalAgencyHero.jsx",
   `"https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1920"`,
   `"/images/hero-background.jpg"`],

  // Footer
  ["src/components/footer/Footer3.jsx",
   `"https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=2560"`,
   `"/images/footer-background.jpg"`],

  // About hero
  ["src/components/hero/AboutHero.jsx",
   `"/images/unsplash/photo-1522071820081-009f0129c71c.jpg"`,
   `"/images/about-hero.jpg"`],

  // About - DigitalAgencyAbout
  ["src/components/about/DigitalAgencyAbout.jsx",
   `"/images/unsplash/photo-1522202176988-66273c2fd55f.jpg"`, `"/images/about-team-meeting.jpg"`],
  ["src/components/about/DigitalAgencyAbout.jsx",
   `"/images/unsplash/photo-1556155092-490a1ba16284.jpg"`, `"/images/about-team-collaboration.jpg"`],

  // About - AboutValues
  ["src/components/about/AboutValues.jsx",
   `"/images/unsplash/photo-1504384308090-c894fdcc538d.jpg"`, `"/images/about-values-workspace.jpg"`],
  ["src/components/about/AboutValues.jsx",
   `"/images/unsplash/photo-1515187029135-18ee286d815b.jpg"`, `"/images/about-values-brainstorm.jpg"`],

  // Story
  ["src/components/story/AboutStory.jsx",
   `"/images/unsplash/photo-1600880292203-757bb62b4baf.jpg"`, `"/images/story-consulting-team.jpg"`],
  ["src/components/story/AboutStory.jsx",
   `"/images/unsplash/photo-1522202176988-66273c2fd55f.jpg"`, `"/images/about-team-meeting.jpg"`],
  ["src/components/story/AboutStory.jsx",
   `"/images/unsplash/photo-1553877522-43269d4ea984.jpg"`, `"/images/story-strategy-meeting.jpg"`],
  ["src/components/story/AboutStory.jsx",
   `"/images/unsplash/photo-1557804506-669a67965ba0.jpg"`, `"/images/story-social-media-team.jpg"`],

  // Team1
  ["src/components/team/Team1.jsx",
   `"/images/unsplash/photo-1560250097-0b93528c311a.jpg"`, `"/images/team-member-male-1.jpg"`],
  ["src/components/team/Team1.jsx",
   `"/images/unsplash/photo-1573496359142-b8d87734a5a2.jpg"`, `"/images/team-member-female-1.jpg"`],
  ["src/components/team/Team1.jsx",
   `"/images/unsplash/photo-1507003211169-0a1dd7228f2d.jpg"`, `"/images/team-member-male-2.jpg"`],
  ["src/components/team/Team1.jsx",
   `"/images/unsplash/photo-1494790108377-be9c29b29330.jpg"`, `"/images/team-member-female-2.jpg"`],

  // AboutTeam
  ["src/components/team/AboutTeam.jsx",
   `"/images/unsplash/photo-1560250097-0b93528c311a.jpg"`, `"/images/team-member-male-1.jpg"`],
  ["src/components/team/AboutTeam.jsx",
   `"/images/unsplash/photo-1573496359142-b8d87734a5a2.jpg"`, `"/images/team-member-female-1.jpg"`],
  ["src/components/team/AboutTeam.jsx",
   `"/images/unsplash/photo-1507003211169-0a1dd7228f2d.jpg"`, `"/images/team-member-male-2.jpg"`],
  ["src/components/team/AboutTeam.jsx",
   `"/images/unsplash/photo-1494790108377-be9c29b29330.jpg"`, `"/images/team-member-female-2.jpg"`],

  // FAQ
  ["src/components/faq/ServiceDetailsFaq.jsx",
   `"/images/unsplash/photo-1551434678-e076c223a692.jpg"`, `"/images/faq-office.jpg"`],

  // Testimonials - Digital Agency
  ["src/components/testimonial/DigitalAgencyTestimonial.jsx",
   `"/images/unsplash/photo-1573496359142-b8d87734a5a2.jpg"`, `"/images/team-member-female-1.jpg"`],
  ["src/components/testimonial/DigitalAgencyTestimonial.jsx",
   `"/images/unsplash/photo-1494790108377-be9c29b29330.jpg"`, `"/images/team-member-female-2.jpg"`],
  ["src/components/testimonial/DigitalAgencyTestimonial.jsx",
   `"/images/unsplash/photo-1507003211169-0a1dd7228f2d.jpg"`, `"/images/team-member-male-2.jpg"`],

  // Testimonials - Startup
  ["src/components/testimonial/StartupAgencyTestimonial.jsx",
   `"/images/unsplash/photo-1573496359142-b8d87734a5a2.jpg"`, `"/images/team-member-female-1.jpg"`],
  ["src/components/testimonial/StartupAgencyTestimonial.jsx",
   `"/images/unsplash/photo-1494790108377-be9c29b29330.jpg"`, `"/images/team-member-female-2.jpg"`],
  ["src/components/testimonial/StartupAgencyTestimonial.jsx",
   `"/images/unsplash/photo-1507003211169-0a1dd7228f2d.jpg"`, `"/images/team-member-male-2.jpg"`],

  // Home Results
  ["src/components/home/HomeResults.jsx",
   `"/images/unsplash/photo-1460925895917-afdab827c52f.jpg"`, `"/images/results-analytics.jpg"`],
  ["src/components/home/HomeResults.jsx",
   `"/images/unsplash/photo-1504868584819-f8e8b4b6d7e3.jpg"`, `"/images/results-data.jpg"`],
  ["src/components/home/HomeResults.jsx",
   `"/images/unsplash/photo-1563986768609-322da13575f3.jpg"`, `"/images/results-social-media.jpg"`],

  // Service Hero
  ["src/components/hero/ServiceHero.jsx",
   `"/images/unsplash/photo-1522202176988-66273c2fd55f.jpg"`, `"/images/service-hero-left.jpg"`],
  ["src/components/hero/ServiceHero.jsx",
   `"/images/unsplash/photo-1556155092-490a1ba16284.jpg"`, `"/images/service-hero-right.jpg"`],
  ["src/components/hero/ServiceHero.jsx",
   `"/images/unsplash/photo-1542744173-8e7e53415bb0.jpg"`, `"/images/service-hero-background.jpg"`],

  // DigitalAgencyService
  ["src/components/service/DigitalAgencyService.jsx",
   `"/images/unsplash/photo-1499750310107-5fef28a66643.jpg"`, `"/images/service-content-creation.jpg"`],
  ["src/components/service/DigitalAgencyService.jsx",
   `"/images/unsplash/photo-1611162617213-7d7a39e9b1d7.jpg"`, `"/images/service-social-media.jpg"`],
  ["src/components/service/DigitalAgencyService.jsx",
   `"/images/unsplash/photo-1563986768609-322da13575f3.jpg"`, `"/images/service-meta-ads.jpg"`],
  ["src/components/service/DigitalAgencyService.jsx",
   `"/images/unsplash/photo-1542744173-8e7e53415bb0.jpg"`, `"/images/service-google-ads.jpg"`],

  // ServiceElementV2
  ["src/components/service/ServiceElementV2.jsx",
   `"/images/unsplash/photo-1499750310107-5fef28a66643.jpg"`, `"/images/service-content-creation.jpg"`],
  ["src/components/service/ServiceElementV2.jsx",
   `"/images/unsplash/photo-1611162617213-7d7a39e9b1d7.jpg"`, `"/images/service-social-media.jpg"`],
  ["src/components/service/ServiceElementV2.jsx",
   `"/images/unsplash/photo-1563986768609-322da13575f3.jpg"`, `"/images/service-meta-ads.jpg"`],
  ["src/components/service/ServiceElementV2.jsx",
   `"/images/unsplash/photo-1542744173-8e7e53415bb0.jpg"`, `"/images/service-google-ads.jpg"`],

  // Service1
  ["src/components/service/Service1.jsx",
   `"/images/unsplash/photo-1499750310107-5fef28a66643.jpg"`, `"/images/service-grid-content-a.jpg"`],
  ["src/components/service/Service1.jsx",
   `"/images/unsplash/photo-1498050108023-c5249f4df085.jpg"`, `"/images/service-grid-comparator.jpg"`],
  ["src/components/service/Service1.jsx",
   `"/images/unsplash/photo-1461749280684-dccba630e2f6.jpg"`, `"/images/service-grid-web-dev.jpg"`],
  ["src/components/service/Service1.jsx",
   `"/images/unsplash/photo-1611162617213-7d7a39e9b1d7.jpg"`, `"/images/service-grid-social-media.jpg"`],
  ["src/components/service/Service1.jsx",
   `"/images/unsplash/photo-1516321318423-f06f85e504b3.jpg"`, `"/images/service-grid-social-mgmt.jpg"`],
  ["src/components/service/Service1.jsx",
   `"/images/unsplash/photo-1432888498266-38ffec3eaf0a.jpg"`, `"/images/service-grid-seo.jpg"`],
  ["src/components/service/Service1.jsx",
   `"/images/unsplash/photo-1542744173-8e7e53415bb0.jpg"`, `"/images/service-grid-analytics.jpg"`],
  ["src/components/service/Service1.jsx",
   `"/images/unsplash/photo-1522202176988-66273c2fd55f.jpg"`, `"/images/service-grid-team-meeting.jpg"`],
  ["src/components/service/Service1.jsx",
   `"/images/unsplash/photo-1519389950473-47ba0277781c.jpg"`, `"/images/service-grid-technology.jpg"`],
  ["src/components/service/Service1.jsx",
   `"/images/unsplash/photo-1563986768609-322da13575f3.jpg"`, `"/images/service-grid-meta-ads.jpg"`],
  ["src/components/service/Service1.jsx",
   `"/images/unsplash/photo-1556155092-490a1ba16284.jpg"`, `"/images/service-grid-collaboration.jpg"`],
  ["src/components/service/Service1.jsx",
   `"/images/unsplash/photo-1551288049-bebda4e38f71.jpg"`, `"/images/service-grid-google-ads.jpg"`],

  // ServiceDetailsService
  ["src/components/service/ServiceDetailsService.jsx",
   `"/images/unsplash/photo-1467232004584-a241de8bcf5d.jpg"`, `"/images/service-details-main.jpg"`],

  // Website Creation
  ["src/pages/service-details/website-creation.jsx",
   `"/images/unsplash/photo-1547658719-da2b51169166.jpg"`, `"/images/website-creation-img1.jpg"`],
  ["src/pages/service-details/website-creation.jsx",
   `"/images/unsplash/photo-1461749280684-dccba630e2f6.jpg"`, `"/images/website-creation-img2.jpg"`],
  ["src/pages/service-details/website-creation.jsx",
   `"/images/unsplash/photo-1467232004584-a241de8bcf5d.jpg"`, `"/images/website-creation-detail.jpg"`],
  ["src/pages/service-details/website-creation.jsx",
   `"/images/unsplash/photo-1531482615713-2afd69097998.jpg"`, `"/images/website-creation-faq.jpg"`],

  // Comparator
  ["src/pages/service-details/comparator-creation.jsx",
   `"/images/unsplash/photo-1454165804606-c3d57bc86b40.jpg"`, `"/images/comparator-img1.jpg"`],
  ["src/pages/service-details/comparator-creation.jsx",
   `"/images/unsplash/photo-1543286386-713bdd548da4.jpg"`, `"/images/comparator-img2.jpg"`],
  ["src/pages/service-details/comparator-creation.jsx",
   `"/images/unsplash/photo-1551288049-bebda4e38f71.jpg"`, `"/images/comparator-detail.jpg"`],
  ["src/pages/service-details/comparator-creation.jsx",
   `"/images/unsplash/photo-1498050108023-c5249f4df085.jpg"`, `"/images/comparator-faq.jpg"`],

  // Brand Identity
  ["src/pages/service-details/brand-identity.jsx",
   `"/images/unsplash/photo-1634084462412-b54873c0a56d.jpg"`, `"/images/brand-identity-img1.jpg"`],
  ["src/pages/service-details/brand-identity.jsx",
   `"/images/unsplash/photo-1626785774573-4b799315345d.jpg"`, `"/images/brand-identity-img2.jpg"`],
  ["src/pages/service-details/brand-identity.jsx",
   `"/images/unsplash/photo-1524758631624-e2822e304c36.jpg"`, `"/images/brand-identity-detail.jpg"`],
  ["src/pages/service-details/brand-identity.jsx",
   `"/images/unsplash/photo-1509343256512-d77a5cb3791b.jpg"`, `"/images/brand-identity-faq.jpg"`],

  // Google Ads
  ["src/pages/service-details/google-ads.jsx",
   `"/images/unsplash/photo-1573804633927-bfcbcd909acd.jpg"`, `"/images/google-ads-img1.jpg"`],
  ["src/pages/service-details/google-ads.jsx",
   `"/images/unsplash/photo-1551288049-bebda4e38f71.jpg"`, `"/images/google-ads-img2.jpg"`],
  ["src/pages/service-details/google-ads.jsx",
   `"/images/unsplash/photo-1504868584819-f8e8b4b6d7e3.jpg"`, `"/images/google-ads-detail.jpg"`],
  ["src/pages/service-details/google-ads.jsx",
   `"/images/unsplash/photo-1542744173-8e7e53415bb0.jpg"`, `"/images/google-ads-faq.jpg"`],

  // Consulting
  ["src/pages/service-details/consulting-support.jsx",
   `"/images/unsplash/photo-1600880292203-757bb62b4baf.jpg"`, `"/images/consulting-img1.jpg"`],
  ["src/pages/service-details/consulting-support.jsx",
   `"/images/unsplash/photo-1521791136064-7986c2920216.jpg"`, `"/images/consulting-img2.jpg"`],
  ["src/pages/service-details/consulting-support.jsx",
   `"/images/unsplash/photo-1553877522-43269d4ea984.jpg"`, `"/images/consulting-detail.jpg"`],
  ["src/pages/service-details/consulting-support.jsx",
   `"/images/unsplash/photo-1559136555-9303baea8ebd.jpg"`, `"/images/consulting-faq.jpg"`],

  // Content Creation
  ["src/pages/service-details/content-creation.jsx",
   `"/images/unsplash/photo-1552664730-d307ca884978.jpg"`, `"/images/content-creation-img1.jpg"`],
  ["src/pages/service-details/content-creation.jsx",
   `"/images/unsplash/photo-1542744094-3a31f272c490.jpg"`, `"/images/content-creation-img2.jpg"`],
  ["src/pages/service-details/content-creation.jsx",
   `"/images/unsplash/photo-1499750310107-5fef28a66643.jpg"`, `"/images/content-creation-detail.jpg"`],
  ["src/pages/service-details/content-creation.jsx",
   `"/images/unsplash/photo-1455390582262-044cdead277a.jpg"`, `"/images/content-creation-faq.jpg"`],

  // Social Media Management
  ["src/pages/service-details/social-media-management.jsx",
   `"/images/unsplash/photo-1516321318423-f06f85e504b3.jpg"`, `"/images/social-media-mgmt-img1.jpg"`],
  ["src/pages/service-details/social-media-management.jsx",
   `"/images/unsplash/photo-1600096194534-95cf5ece2e2e.jpg"`, `"/images/social-media-mgmt-img2.jpg"`],
  ["src/pages/service-details/social-media-management.jsx",
   `"/images/unsplash/photo-1562577309-4932fdd64cd1.jpg"`, `"/images/social-media-mgmt-detail.jpg"`],
  ["src/pages/service-details/social-media-management.jsx",
   `"/images/unsplash/photo-1557804506-669a67965ba0.jpg"`, `"/images/social-media-mgmt-faq.jpg"`],

  // Meta Ads
  ["src/pages/service-details/meta-ads.jsx",
   `"/images/unsplash/photo-1611926653458-09294b3142bf.jpg"`, `"/images/meta-ads-img1.jpg"`],
  ["src/pages/service-details/meta-ads.jsx",
   `"/images/unsplash/photo-1611162617213-7d7a39e9b1d7.jpg"`, `"/images/meta-ads-img2.jpg"`],
  ["src/pages/service-details/meta-ads.jsx",
   `"/images/unsplash/photo-1563986768609-322da13575f3.jpg"`, `"/images/meta-ads-detail.jpg"`],
  ["src/pages/service-details/meta-ads.jsx",
   `"/images/unsplash/photo-1579869847557-1f67382cc158.jpg"`, `"/images/meta-ads-faq.jpg"`],

  // SEO
  ["src/pages/service-details/seo.jsx",
   `"/images/unsplash/photo-1572177812156-58036aae439c.jpg"`, `"/images/seo-img1.jpg"`],
  ["src/pages/service-details/seo.jsx",
   `"/images/unsplash/photo-1432888498266-38ffec3eaf0a.jpg"`, `"/images/seo-img2.jpg"`],
  ["src/pages/service-details/seo.jsx",
   `"/images/unsplash/photo-1460925895917-afdab827c52f.jpg"`, `"/images/seo-detail.jpg"`],
  ["src/pages/service-details/seo.jsx",
   `"/images/unsplash/photo-1553877522-43269d4ea984.jpg"`, `"/images/seo-faq.jpg"`],

  // Portfolio
  ["src/components/portfolio/Portfolio1.jsx",
   `"https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1540"`,
   `"/images/portfolio-analytics.jpg"`],
  ["src/components/portfolio/Portfolio1.jsx",
   `"https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1540"`,
   `"/images/portfolio-website.jpg"`],
  ["src/components/portfolio/Portfolio1.jsx",
   `"https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1540"`,
   `"/images/portfolio-marketing.jpg"`],
  ["src/components/portfolio/Portfolio1.jsx",
   `"https://images.pexels.com/photos/326508/pexels-photo-326508.jpeg?auto=compress&cs=tinysrgb&w=1540"`,
   `"/images/portfolio-branding.jpg"`],
  ["src/components/portfolio/Portfolio1.jsx",
   `"https://images.pexels.com/photos/39284/macbook-apple-imac-computer-39284.jpeg?auto=compress&cs=tinysrgb&w=1540"`,
   `"/images/portfolio-macbook.jpg"`],
  ["src/components/portfolio/Portfolio1.jsx",
   `"https://images.pexels.com/photos/38544/imac-apple-mockup-app-38544.jpeg?auto=compress&cs=tinysrgb&w=1540"`,
   `"/images/portfolio-imac.jpg"`],
  ["src/components/portfolio/Portfolio1.jsx",
   `"https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1540"`,
   `"/images/portfolio-coding.jpg"`],
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      console.log(`  SKIP (exists): ${path.basename(dest)}`);
      return resolve();
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 1. Download images
  console.log("\n=== Downloading images ===");
  for (const [filename, url] of Object.entries(IMAGES)) {
    const dest = path.join(OUTPUT_DIR, filename);
    process.stdout.write(`  ${filename}... `);
    try {
      await download(url, dest);
      if (!fs.existsSync(dest) || fs.statSync(dest).size === 0)
        throw new Error("empty file");
      console.log("OK");
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
    }
  }

  // 2. Apply replacements in source files
  console.log("\n=== Updating source files ===");
  const root = path.join(__dirname, "..");
  const changed = new Set();
  for (const [file, oldVal, newVal] of REPLACEMENTS) {
    const abs = path.join(root, file);
    if (!fs.existsSync(abs)) { console.log(`  MISSING: ${file}`); continue; }
    let content = fs.readFileSync(abs, "utf8");
    if (content.includes(oldVal)) {
      content = content.split(oldVal).join(newVal);
      fs.writeFileSync(abs, content);
      changed.add(file);
    }
  }
  for (const f of changed) console.log(`  Updated: ${f}`);

  // 3. Remove old unsplash subfolder if now empty
  const oldDir = path.join(OUTPUT_DIR, "unsplash");
  if (fs.existsSync(oldDir)) {
    const remaining = fs.readdirSync(oldDir);
    if (remaining.length === 0) {
      fs.rmdirSync(oldDir);
      console.log("\nRemoved empty: public/images/unsplash/");
    } else {
      console.log(`\nNote: public/images/unsplash/ still has ${remaining.length} files (may be safe to delete manually)`);
    }
  }

  console.log("\nAll done!");
}

main();
