import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import ServiceDetailsDevelopment from "@/components/development/ServiceDetailsDevelopment";
import ServiceDetailsWorkflow from "@/components/workflow/ServiceDetailsWorkflow";
import ServiceDetailsService from "@/components/service/ServiceDetailsService";
import ServiceDetailsFaq from "@/components/faq/ServiceDetailsFaq";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";

const img1 = "/images/social-media-mgmt-img1.webp";
const img2 = "/images/social-media-mgmt-img2.jpg";
const imgDetail = "/images/social-media-mgmt-detail.webp";
const imgFaq = "/images/social-media-mgmt-faq.webp";

const SocialMediaManagement = () => {
  return (
    <>
      <Head>
        <title>Social Media Management Services — Nova Impact</title>
        <meta name="description" content="Professional social media management services. Content planning, community engagement, and performance reporting across Instagram, Facebook, LinkedIn, and more." />
        <meta name="keywords" content="social media management, community management, content planning, social media strategy, Instagram management, Facebook management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://novaimpact.io/service-details/social-media-management" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://novaimpact.io/service-details/social-media-management" />
        <meta property="og:title" content="Social Media Management Services — Nova Impact" />
        <meta property="og:description" content="Professional social media management. Content planning, community engagement, and performance reporting across Instagram, Facebook, LinkedIn, and more." />
        <meta property="og:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <meta property="og:site_name" content="Nova Impact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Social Media Management — Nova Impact" />
        <meta name="twitter:description" content="Professional social media management. Content planning, community engagement, and performance reporting." />
        <meta name="twitter:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Service",
          "name": "Social Media Management",
          "provider": { "@id": "https://novaimpact.io/#organization" },
          "url": "https://novaimpact.io/service-details/social-media-management",
          "description": "End-to-end social media management — content planning, community engagement, and performance reporting.",
          "serviceType": "Social Media Management"
        }) }} />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <ServiceDetailsDevelopment
            title="Social Media Management"
            description1="We manage your social media presence end-to-end — from strategy and content creation to scheduling, community management, and monthly performance reporting. We build brands that people follow, trust, and buy from."
            description2="Our team creates platform-specific content that resonates with your target audience on Instagram, Facebook, LinkedIn, TikTok, and more. Every post, story, and reel is designed to build your brand equity and drive measurable engagement."
            tags={["Instagram Management", "Facebook Management", "LinkedIn Strategy", "Content Calendar", "Community Management", "Monthly Reporting"]}
            img1={img1}
            img2={img2}
            img1Alt="Social media manager creating and scheduling content across platforms"
            img2Alt="Smartphone showing Instagram and social media engagement metrics"
          />
          <ServiceDetailsWorkflow steps={[
            { title: "Strategy & Audit", description: "We audit your current presence, define your brand voice, identify your audience, and build a 30-day content strategy aligned with your goals." },
            { title: "Content Creation", description: "Our creative team produces original visuals, videos, carousels, and captions tailored to each platform's format and your brand identity." },
            { title: "Scheduling & Publishing", description: "We manage your content calendar, schedule posts at peak engagement times, and handle all community interactions and DM responses." },
            { title: "Reporting & Optimization", description: "Monthly performance reports covering reach, engagement, follower growth, and top-performing content — with recommendations for the next month." },
          ]} />
          <ServiceDetailsService
            img={imgDetail}
            imgAlt="Brand social media content displayed on Instagram and Facebook"
            heading="Build a social media presence that drives real business results."
            body1="Social media isn't just about posting regularly — it's about posting the right content for the right audience at the right time. We take care of everything so you can focus on running your business."
            body2="Our clients see consistent follower growth, higher engagement rates, and direct impact on leads and sales. We manage everything from strategy to execution — so your brand is always active, relevant, and professionally represented online."
          />
          <ServiceDetailsFaq
            faqImg={imgFaq}
            faqImgAlt="Social media strategist planning content calendar"
            title="Social Media Management — FAQ"
            faqs={[
              { question: "Which social media platforms do you manage?", answer: "We manage Instagram, Facebook, LinkedIn, TikTok, X (Twitter), Pinterest, and YouTube. We recommend the most relevant platforms based on your industry and target audience." },
              { question: "How many posts per week do you publish?", answer: "Our standard packages include 3–5 posts per week per platform. We adapt the frequency based on your goals and the platform's best practices for organic reach." },
              { question: "Do you create the visuals and write the captions?", answer: "Yes. Our service includes full content production — graphic design, short-form video editing, copywriting, and hashtag strategy. You review and approve everything before it goes live." },
              { question: "Can I see results in the first month?", answer: "You'll see increased activity, improved visual consistency, and better engagement from month 1. Follower growth and measurable business impact typically become visible from month 2–3 as the algorithm recognizes consistent quality." },
            ]}
          />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </>
  );
};

export default SocialMediaManagement;
