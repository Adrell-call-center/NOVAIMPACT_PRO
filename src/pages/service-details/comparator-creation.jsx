import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import ServiceDetailsDevelopment from "@/components/development/ServiceDetailsDevelopment";
import ServiceDetailsWorkflow from "@/components/workflow/ServiceDetailsWorkflow";
import ServiceDetailsService from "@/components/service/ServiceDetailsService";
import ServiceDetailsFaq from "@/components/faq/ServiceDetailsFaq";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";

const img1 = "/images/comparator-img1.webp";
const img2 = "/images/comparator-img2.webp";
const imgDetail = "/images/comparator-detail.webp";
const imgFaq = "/images/comparator-faq.webp";

const ComparatorCreation = () => {
  return (
    <>
      <Head>
        <title>Comparison Platform & Lead Generation — Nova Impact</title>
        <meta name="description" content="We build comparison platforms and lead generation websites that help users compare the best options in one place and find the most suitable offers based on their needs." />
        <meta name="keywords" content="comparison platform, lead generation, offers comparison, marketplace aggregator, personalized recommendations, trusted providers, decision-making tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://novaimpact.io/service-details/comparator-creation" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://novaimpact.io/service-details/comparator-creation" />
        <meta property="og:title" content="Comparison Platform & Lead Generation — Nova Impact" />
        <meta property="og:description" content="We build comparison platforms and lead generation websites that help users compare offers and find the most suitable solutions based on their needs." />
        <meta property="og:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <meta property="og:site_name" content="Nova Impact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Comparison Platform & Lead Generation — Nova Impact" />
        <meta name="twitter:description" content="We build comparison platforms and lead generation websites that help users find the most suitable offers." />
        <meta name="twitter:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Service",
          "name": "Comparison Platform & Lead Generation",
          "provider": { "@id": "https://novaimpact.io/#organization" },
          "url": "https://novaimpact.io/service-details/comparator-creation",
          "description": "Custom comparison platforms and lead generation websites that help users find the best offers.",
          "serviceType": "Web Development & Lead Generation"
        }) }} />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <ServiceDetailsDevelopment
            title="Comparison Platform & Lead Generation"
            description1="We build high-performance comparison websites and lead generation platforms that connect users with the most relevant offers in their category. Insurance, energy, telecoms, financial products, home services — we've built scalable comparators across multiple sectors."
            description2="Our platforms are engineered for conversion: fast-loading, mobile-optimized, SEO-ready, and designed to guide users from search intent to form submission as efficiently as possible. Every lead generated is qualified and trackable."
            tags={["Comparison Website", "Lead Generation", "Multi-Sector Platforms", "SEO Architecture", "Form Optimization", "API Integrations"]}
            img1={img1}
            img2={img2}
            img1Alt="Comparison platform interface showing multiple offers side by side"
            img2Alt="Analytics dashboard tracking lead generation performance"
          />
          <ServiceDetailsWorkflow steps={[
            { title: "Market Research", description: "We analyze your target sector, the competitive landscape, and user search behavior to design the right platform structure and content architecture." },
            { title: "Platform Design", description: "We design a user experience that makes comparing offers intuitive — clear filters, comparison tables, trust signals, and a conversion-optimized form flow." },
            { title: "Development", description: "We build the platform with clean, scalable code — including provider integrations, dynamic content, and real-time lead tracking capabilities." },
            { title: "SEO & Launch", description: "We deploy with a full SEO setup — sitemap, structured data, speed optimization — and set up analytics so you track every lead source and conversion." },
          ]} />
          <ServiceDetailsService
            img={imgDetail}
            imgAlt="Lead generation dashboard showing conversion rates and qualified leads"
            heading="Build a comparison platform that generates leads on autopilot."
            body1="Comparison platforms are among the highest-converting business models online. When built correctly, they capture users at the peak of purchase intent — at the moment they're actively researching options — and convert them into qualified leads."
            body2="We design and develop comparators that rank on Google, load fast, and guide users smoothly through the comparison process. Whether you're aggregating providers or generating leads for your own services, we build the infrastructure to make it profitable."
          />
          <ServiceDetailsFaq
            faqImg={imgFaq}
            faqImgAlt="Developer building a comparison and lead generation platform"
            title="Comparison Platform — Frequently Asked Questions"
            faqs={[
              { question: "What sectors can you build comparison platforms for?", answer: "We've built comparators for insurance, energy, telecoms, internet providers, financial products, home services, legal services, and more. If there are multiple providers in a market, a comparison platform can work." },
              { question: "How do you generate traffic to the comparator?", answer: "We build platforms with an SEO-first architecture to attract organic traffic from Google. We can also run paid campaigns (Google Ads, Meta Ads) to accelerate initial traffic while organic rankings build." },
              { question: "Can the platform connect with our CRM or lead management system?", answer: "Yes. We integrate your comparator with your CRM, email automation tools, or third-party lead distribution systems via API so every lead flows directly into your sales process." },
              { question: "How long does it take to build a comparison platform?", answer: "A standard comparison platform takes 6–10 weeks from kick-off to launch, depending on the number of categories, providers, and integrations required. We provide a detailed timeline at the start of every project." },
            ]}
          />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </>
  );
};

export default ComparatorCreation;
