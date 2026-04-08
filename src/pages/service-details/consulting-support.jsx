import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import ServiceDetailsDevelopment from "@/components/development/ServiceDetailsDevelopment";
import ServiceDetailsWorkflow from "@/components/workflow/ServiceDetailsWorkflow";
import ServiceDetailsService from "@/components/service/ServiceDetailsService";
import ServiceDetailsFaq from "@/components/faq/ServiceDetailsFaq";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";

const img1 = "/images/consulting-img1.webp";
const img2 = "/images/consulting-img2.webp";
const imgDetail = "/images/consulting-detail.webp";
const imgFaq = "/images/consulting-faq.webp";

const ConsultingSupport = () => {
  return (
    <>
      <Head>
        <title>Consulting & Support Services — Digital Strategy — Nova Impact</title>
        <meta name="description" content="Strategic digital consulting and ongoing support. Performance audits, technology consulting, training, and growth roadmaps for sustained digital success." />
        <meta name="keywords" content="digital consulting, strategy consulting, performance audit, technology consulting, digital training, business growth" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://novaimpact.io/service-details/consulting-support" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://novaimpact.io/service-details/consulting-support" />
        <meta property="og:title" content="Consulting & Support Services — Digital Strategy — Nova Impact" />
        <meta property="og:description" content="Strategic digital consulting and ongoing support. Performance audits, technology consulting, training, and growth roadmaps for sustained digital success." />
        <meta property="og:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <meta property="og:site_name" content="Nova Impact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Consulting & Support — Nova Impact" />
        <meta name="twitter:description" content="Strategic digital consulting — performance audits, technology consulting, training, and growth roadmaps." />
        <meta name="twitter:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Service",
          "name": "Consulting & Support",
          "provider": { "@id": "https://novaimpact.io/#organization" },
          "url": "https://novaimpact.io/service-details/consulting-support",
          "description": "Strategic digital consulting: performance audits, technology assessments, training workshops, and growth roadmaps.",
          "serviceType": "Digital Strategy Consulting"
        }) }} />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <ServiceDetailsDevelopment
            title="Consulting & Support"
            description1="We provide strategic digital consulting and hands-on support to help businesses navigate the digital landscape and build a clear path to growth. Whether you need a one-time audit, an ongoing advisory relationship, or team training, we adapt to your needs."
            description2="Our consultants bring deep expertise across SEO, paid advertising, web development, analytics, and marketing strategy. We work as an extension of your team — identifying opportunities, solving problems, and helping you make better digital decisions faster."
            tags={["Digital Strategy", "Performance Audit", "Technology Assessment", "Team Training", "Growth Roadmap", "Ongoing Advisory"]}
            img1={img1}
            img2={img2}
            img1Alt="Digital consultant presenting strategy and growth roadmap to a business team"
            img2Alt="Business professionals in a strategic consulting session"
          />
          <ServiceDetailsWorkflow steps={[
            { title: "Discovery & Audit", description: "We start with a comprehensive audit of your current digital ecosystem — website, traffic, ads, analytics, tools, and team capabilities — to map what's working and what isn't." },
            { title: "Strategy Development", description: "We develop a prioritized digital roadmap with clear recommendations, timelines, and expected outcomes based on your goals and budget." },
            { title: "Implementation Support", description: "We work alongside your team (or take the lead) to implement recommendations — whether that's a technical fix, a campaign restructure, or a new tool setup." },
            { title: "Ongoing Advisory", description: "On a retainer basis, we serve as your dedicated digital advisor — available for questions, reviews, and strategic guidance as your business evolves." },
          ]} />
          <ServiceDetailsService
            img={imgDetail}
            imgAlt="Digital strategy consultant reviewing performance data with a business owner"
            heading="Clarity, direction, and expertise — when you need it most."
            body1="Many businesses know they need to improve their digital presence but aren't sure where to start or what's holding them back. We bring the outside perspective, technical expertise, and strategic clarity to move forward with confidence."
            body2="From startups defining their first digital strategy to established companies looking to improve performance or adopt new technologies — our consulting service is tailored to your level of maturity, your team's capabilities, and your growth ambitions."
          />
          <ServiceDetailsFaq
            faqImg={imgFaq}
            faqImgAlt="Business consultant providing digital strategy advice"
            title="Consulting & Support — Frequently Asked Questions"
            faqs={[
              { question: "What does a digital consulting engagement look like?", answer: "Every engagement starts with a discovery call to understand your goals and challenges. From there, we deliver a custom audit and roadmap. Depending on your needs, we can provide a one-time strategic report or ongoing monthly advisory support." },
              { question: "Can you train our internal marketing team?", answer: "Yes. We offer training workshops covering SEO, Google Ads, Meta Ads, content strategy, analytics, and more — tailored to your team's current level and delivered remotely or in person." },
              { question: "Do you work with businesses that already have an internal team?", answer: "Absolutely. We frequently work alongside in-house marketing teams — providing expertise, strategic oversight, and specialist skills that complement what your team already does well." },
              { question: "How is consulting priced?", answer: "We offer consulting on a project basis (fixed-scope audits and deliverables) or as a monthly retainer (ongoing advisory and support). Pricing is based on the scope and frequency of engagement — we'll provide a clear proposal after our discovery call." },
            ]}
          />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </>
  );
};

export default ConsultingSupport;
