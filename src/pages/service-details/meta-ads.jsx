import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import ServiceDetailsDevelopment from "@/components/development/ServiceDetailsDevelopment";
import ServiceDetailsWorkflow from "@/components/workflow/ServiceDetailsWorkflow";
import ServiceDetailsService from "@/components/service/ServiceDetailsService";
import ServiceDetailsFaq from "@/components/faq/ServiceDetailsFaq";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";

const img1 = "/images/meta-ads-img1.webp";
const img2 = "/images/meta-ads-img2.webp";
const imgDetail = "/images/meta-ads-detail.webp";
const imgFaq = "/images/meta-ads-faq.webp";

const MetaAds = () => {
  return (
    <>
      <Head>
        <title>Meta Ads Services — Facebook & Instagram Advertising — Nova Impact</title>
        <meta name="description" content="Professional Meta Ads management for Facebook and Instagram. Targeted ad campaigns, A/B testing, and ROI optimization to maximize your paid social media performance." />
        <meta name="keywords" content="meta ads, facebook ads, instagram ads, paid social media, ad campaigns, retargeting, social media advertising" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://novaimpact.io/service-details/meta-ads" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://novaimpact.io/service-details/meta-ads" />
        <meta property="og:title" content="Meta Ads Services — Facebook & Instagram Advertising — Nova Impact" />
        <meta property="og:description" content="Professional Meta Ads management for Facebook and Instagram. Targeted ad campaigns, A/B testing, and ROI optimization." />
        <meta property="og:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <meta property="og:site_name" content="Nova Impact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Meta Ads Services — Nova Impact" />
        <meta name="twitter:description" content="Professional Meta Ads management for Facebook and Instagram. Targeted campaigns and ROI optimization." />
        <meta name="twitter:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Service",
          "name": "Meta Ads (Facebook & Instagram Advertising)",
          "provider": { "@id": "https://novaimpact.io/#organization" },
          "url": "https://novaimpact.io/service-details/meta-ads",
          "description": "Targeted Facebook and Instagram ad campaigns with A/B testing and ROI optimization.",
          "serviceType": "Social Media Advertising"
        }) }} />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <ServiceDetailsDevelopment
            title="Meta Ads (Facebook & Instagram)"
            description1="We design, launch, and optimize targeted ad campaigns on Facebook and Instagram to maximize your ROI. From awareness to conversion, we manage every stage of the funnel — reaching the right audience with the right message at the right moment."
            description2="Our Meta Ads specialists handle audience segmentation, creative design, A/B testing, pixel setup, and retargeting. We continuously monitor performance and optimize daily to ensure your budget delivers the best possible return."
            tags={["Facebook Ads", "Instagram Ads", "Audience Targeting", "Retargeting Campaigns", "A/B Creative Testing", "Pixel & Conversion Tracking"]}
            img1={img1}
            img2={img2}
            img1Alt="Social media advertising campaigns on Facebook and Instagram"
            img2Alt="Meta Ads campaign manager showing performance metrics"
          />
          <ServiceDetailsWorkflow steps={[
            { title: "Audit & Strategy", description: "We audit your existing accounts, define your target audiences, and build a campaign structure aligned with your business objectives." },
            { title: "Creative Production", description: "We create scroll-stopping ad visuals and copy — static images, carousels, videos, and stories — tailored to each placement and audience." },
            { title: "Launch & Test", description: "We launch campaigns with controlled A/B tests on creatives, audiences, and bidding strategies to find winning combinations fast." },
            { title: "Optimize & Scale", description: "We optimize daily based on performance data — cutting what doesn't work and scaling what does to maximize your ROAS." },
          ]} />
          <ServiceDetailsService
            img={imgDetail}
            imgAlt="Meta Ads dashboard showing ROAS and campaign performance"
            heading="Turn your ad budget into measurable business growth."
            body1="We manage Meta advertising for brands across e-commerce, services, real estate, coaching, and more. Our campaigns are built to generate real results — qualified leads, online sales, and booked appointments."
            body2="With over 3 billion active users on Facebook and Instagram, Meta remains one of the highest-ROI advertising platforms when managed correctly. We ensure every euro you spend works harder through precise targeting and continuous optimization."
          />
          <ServiceDetailsFaq
            faqImg={imgFaq}
            faqImgAlt="Digital marketer reviewing Facebook and Instagram ad performance"
            title="Meta Ads — Frequently Asked Questions"
            faqs={[
              { question: "What is the minimum budget recommended for Meta Ads?", answer: "We generally recommend a minimum monthly ad spend of €500–€1,000 to gather enough data for effective optimization. The ideal budget depends on your industry, goals, and audience size." },
              { question: "How quickly will I see results from Meta Ads?", answer: "Meta Ads can generate results within days of launch. However, the learning phase typically takes 7–14 days as the algorithm optimizes delivery. Significant ROAS improvements usually appear from week 2–3 onwards." },
              { question: "Do you create the ad creatives as well?", answer: "Yes. Our service includes copywriting and visual design for all ad formats — images, carousels, reels, and stories. We test multiple creatives to identify top performers." },
              { question: "Can you run ads for both Facebook and Instagram?", answer: "Absolutely. We manage campaigns across the full Meta ecosystem — Facebook Feed, Instagram Feed, Stories, Reels, Messenger, and the Audience Network — with placement-specific optimizations." },
            ]}
          />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </>
  );
};

export default MetaAds;
