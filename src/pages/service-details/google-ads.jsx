import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import ServiceDetailsDevelopment from "@/components/development/ServiceDetailsDevelopment";
import ServiceDetailsWorkflow from "@/components/workflow/ServiceDetailsWorkflow";
import ServiceDetailsService from "@/components/service/ServiceDetailsService";
import ServiceDetailsFaq from "@/components/faq/ServiceDetailsFaq";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";

const img1 = "/images/google-ads-img1.webp";
const img2 = "/images/google-ads-img2.webp";
const imgDetail = "/images/google-ads-detail.webp";
const imgFaq = "/images/google-ads-faq.webp";

const GoogleAds = () => {
  return (
    <>
      <Head>
        <title>Google Ads Services — Search, Display & YouTube Advertising — Nova Impact</title>
        <meta name="description" content="Professional Google Ads management. Search campaigns, display advertising, and YouTube ads to drive qualified traffic and generate measurable leads for your business." />
        <meta name="keywords" content="google ads, search ads, display ads, youtube ads, ppc campaigns, keyword research, paid search" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://novaimpact.io/service-details/google-ads" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://novaimpact.io/service-details/google-ads" />
        <meta property="og:title" content="Google Ads Services — Search, Display & YouTube Advertising — Nova Impact" />
        <meta property="og:description" content="Professional Google Ads management. Search campaigns, display advertising, and YouTube ads to drive qualified traffic and generate measurable leads." />
        <meta property="og:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <meta property="og:site_name" content="Nova Impact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Google Ads Services — Nova Impact" />
        <meta name="twitter:description" content="Professional Google Ads management — Search, Display, and YouTube campaigns to drive qualified traffic." />
        <meta name="twitter:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Service",
          "name": "Google Ads",
          "provider": { "@id": "https://novaimpact.io/#organization" },
          "url": "https://novaimpact.io/service-details/google-ads",
          "description": "Search, Display, and YouTube ad campaign management to drive qualified traffic and generate measurable leads.",
          "serviceType": "Pay-Per-Click Advertising"
        }) }} />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <ServiceDetailsDevelopment
            title="Google Ads"
            description1="We manage Google Ads campaigns across Search, Display, Shopping, and YouTube to put your business in front of people actively looking for what you offer. Every campaign is built around your conversion goals — not vanity metrics."
            description2="Through precise keyword research, quality score optimization, and conversion tracking, we ensure every euro of ad spend is accountable. We provide full transparency with monthly reports and proactive optimizations to grow your ROAS month over month."
            tags={["Search Campaigns", "Display Advertising", "Shopping Ads", "YouTube Ads", "Keyword Research", "Conversion Tracking"]}
            img1={img1}
            img2={img2}
            img1Alt="Google Ads campaign setup and search advertising management"
            img2Alt="PPC analytics dashboard showing click-through rates and conversions"
          />
          <ServiceDetailsWorkflow steps={[
            { title: "Account Audit", description: "We audit your existing Google Ads account (or set up a new one), analyzing campaign structure, keyword quality, bidding strategy, and wasted spend." },
            { title: "Keyword Strategy", description: "We research high-intent keywords, build negative keyword lists, and structure campaigns by theme to maximize relevance and Quality Score." },
            { title: "Ad Creation", description: "We write compelling ad copy with strong calls-to-action and set up responsive search ads, display banners, and video assets where relevant." },
            { title: "Optimize & Report", description: "We monitor performance daily, adjust bids, pause underperformers, and scale winners. You receive a clear monthly report showing cost, leads, and ROAS." },
          ]} />
          <ServiceDetailsService
            img={imgDetail}
            imgAlt="Google Ads performance dashboard with conversion data"
            heading="Appear at the top of Google when your customers are ready to buy."
            body1="Google Search Ads place your business in front of high-intent users at the exact moment they're searching for your product or service. When managed correctly, it's one of the fastest ways to generate qualified leads and online sales."
            body2="We manage campaigns for businesses across all sectors — local services, e-commerce, SaaS, real estate, legal, healthcare, and more. Every account is managed with the same precision: no automated scripts, no set-it-and-forget-it."
          />
          <ServiceDetailsFaq
            faqImg={imgFaq}
            faqImgAlt="Business team reviewing Google Ads strategy"
            title="Google Ads — Frequently Asked Questions"
            faqs={[
              { question: "How much should I spend on Google Ads?", answer: "There's no universal answer — it depends on your industry, competition, and goals. We typically recommend a minimum of €500/month in ad spend. We'll give you a realistic estimate based on your specific market during the discovery call." },
              { question: "How soon will I get leads from Google Ads?", answer: "Google Search Ads can generate leads within 24–48 hours of going live. The first 2–4 weeks are an optimization phase where we refine keywords, bids, and ad copy based on real data." },
              { question: "What's the difference between Google Ads and SEO?", answer: "Google Ads deliver immediate visibility through paid placements. SEO builds long-term organic rankings for free. The two work best together — ads for immediate traffic, SEO for sustainable growth." },
              { question: "Do you manage Shopping campaigns for e-commerce?", answer: "Yes. We set up and manage Google Shopping campaigns including product feed optimization, Smart Shopping, and Performance Max campaigns tailored to your e-commerce store." },
            ]}
          />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </>
  );
};

export default GoogleAds;
