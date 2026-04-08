import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import ServiceDetailsDevelopment from "@/components/development/ServiceDetailsDevelopment";
import ServiceDetailsWorkflow from "@/components/workflow/ServiceDetailsWorkflow";
import ServiceDetailsService from "@/components/service/ServiceDetailsService";
import ServiceDetailsFaq from "@/components/faq/ServiceDetailsFaq";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";

const img1 = "/images/seo-img1.webp";
const img2 = "/images/seo-img2.webp";
const imgDetail = "/images/seo-detail.webp";
const imgFaq = "/images/seo-faq.webp";

const SEO = () => {
  return (
    <>
      <Head>
        <title>SEO Services — Search Engine Optimization — Nova Impact</title>
        <meta name="description" content="Professional SEO services to improve your organic visibility. Technical audits, on-page optimization, content strategy, and link building for sustainable search engine rankings." />
        <meta name="keywords" content="seo, search engine optimization, technical seo, on-page seo, link building, local seo, organic traffic, google rankings" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://novaimpact.io/service-details/seo" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://novaimpact.io/service-details/seo" />
        <meta property="og:title" content="SEO Services — Search Engine Optimization — Nova Impact" />
        <meta property="og:description" content="Professional SEO services to improve your organic visibility. Technical audits, on-page optimization, content strategy, and link building." />
        <meta property="og:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <meta property="og:site_name" content="Nova Impact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SEO Services — Nova Impact" />
        <meta name="twitter:description" content="Professional SEO to improve organic visibility. Technical audits, on-page optimization, content strategy, and link building." />
        <meta name="twitter:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Service",
          "name": "SEO (Search Engine Optimization)",
          "provider": { "@id": "https://novaimpact.io/#organization" },
          "url": "https://novaimpact.io/service-details/seo",
          "description": "Technical SEO audits, on-page optimization, content strategy, and link building.",
          "serviceType": "Search Engine Optimization"
        }) }} />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <ServiceDetailsDevelopment
            title="SEO (Search Engine Optimization)"
            description1="We improve your organic visibility through comprehensive technical SEO audits, on-page optimization, content strategy, and ethical link building. Our data-driven approach helps you rank higher on Google and attract qualified organic traffic that converts."
            description2="Our SEO specialists stay ahead of algorithm updates and industry trends. We focus on sustainable, long-term strategies that deliver measurable improvements in visibility, traffic, and revenue — not quick fixes that fade."
            tags={["Technical SEO Audit", "On-Page Optimization", "Content Strategy", "Link Building", "Local SEO", "Core Web Vitals"]}
            img1={img1}
            img2={img2}
            img1Alt="SEO analyst reviewing organic traffic data and rankings"
            img2Alt="Laptop showing Google search ranking improvements"
          />
          <ServiceDetailsWorkflow steps={[
            { title: "SEO Audit", description: "We start with a full technical audit of your website — crawl errors, indexability, page speed, structured data, and content gaps." },
            { title: "Keyword Strategy", description: "We identify the high-intent keywords your audience is searching for and map them to the right pages on your site." },
            { title: "On-Page & Technical", description: "We optimize your meta tags, headings, content, internal linking, and fix all technical issues blocking your rankings." },
            { title: "Track & Scale", description: "Monthly reporting on rankings, traffic, and conversions. We continuously refine the strategy based on real performance data." },
          ]} />
          <ServiceDetailsService
            img={imgDetail}
            imgAlt="SEO dashboard showing organic traffic growth over time"
            heading="Rank higher. Get found. Grow sustainably."
            body1="Our clients see an average +340% increase in organic traffic within 6 months. We combine technical expertise with content strategy to build lasting search visibility for your business."
            body2="We work across all industries and markets — B2B, e-commerce, local businesses, and international brands. Every strategy is built from scratch around your specific goals, competitors, and audience."
          />
          <ServiceDetailsFaq
            faqImg={imgFaq}
            faqImgAlt="SEO strategy planning session"
            title="SEO — Frequently Asked Questions"
            faqs={[
              { question: "How long does SEO take to show results?", answer: "SEO is a long-term investment. Most clients start seeing measurable ranking improvements within 3–4 months. Significant traffic growth typically occurs between months 4 and 6, and compounds over time." },
              { question: "Do you guarantee first-page rankings?", answer: "No ethical SEO agency can guarantee specific rankings — Google's algorithm is complex and constantly evolving. What we guarantee is a proven methodology, full transparency, and a track record of delivering real results." },
              { question: "What's included in your SEO service?", answer: "Our SEO service includes a full technical audit, keyword research, on-page optimization, content recommendations, link building, and monthly reporting. We handle everything end-to-end." },
              { question: "Can you help with local SEO?", answer: "Yes. We optimize your Google Business Profile, local citations, and location-specific content to help you appear in local search results and Google Maps for your target area." },
            ]}
          />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </>
  );
};

export default SEO;
