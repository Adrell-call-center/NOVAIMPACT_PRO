import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import ServiceDetailsDevelopment from "@/components/development/ServiceDetailsDevelopment";
import ServiceDetailsWorkflow from "@/components/workflow/ServiceDetailsWorkflow";
import ServiceDetailsService from "@/components/service/ServiceDetailsService";
import ServiceDetailsFaq from "@/components/faq/ServiceDetailsFaq";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";

const img1 = "/images/content-creation-img1.webp";
const img2 = "/images/content-creation-img2.webp";
const imgDetail = "/images/content-creation-detail.webp";
const imgFaq = "/images/content-creation-faq.webp";

const ContentCreation = () => {
  return (
    <>
      <Head>
        <title>Content Creation Services — Nova Impact</title>
        <meta name="description" content="Professional content creation services. Blog writing, video scripts, graphic design, and brand copywriting that resonates with your audience and strengthens your brand identity." />
        <meta name="keywords" content="content creation, blog writing, copywriting, video scripts, graphic design, brand content, visual storytelling" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://novaimpact.io/service-details/content-creation" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://novaimpact.io/service-details/content-creation" />
        <meta property="og:title" content="Content Creation Services — Nova Impact" />
        <meta property="og:description" content="Professional content creation — blog writing, video scripts, graphic design, and brand copywriting that resonates with your audience." />
        <meta property="og:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <meta property="og:site_name" content="Nova Impact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Content Creation Services — Nova Impact" />
        <meta name="twitter:description" content="Blog writing, video scripts, graphic design, and brand copywriting that resonates with your audience." />
        <meta name="twitter:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Service",
          "name": "Content Creation",
          "provider": { "@id": "https://novaimpact.io/#organization" },
          "url": "https://novaimpact.io/service-details/content-creation",
          "description": "Blog writing, video scripts, graphic design, and brand copywriting that educates, engages, and converts.",
          "serviceType": "Content Marketing"
        }) }} />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <ServiceDetailsDevelopment
            title="Content Creation"
            description1="From SEO blog posts and social media content to video scripts, email campaigns, and brand storytelling — we create content that educates, engages, and drives action. Every piece is crafted with your audience and business goals in mind."
            description2="Great content is the foundation of every digital strategy. We combine strategic thinking with creative execution to produce content that builds trust, improves your search rankings, and converts readers into customers."
            tags={["SEO Blog Writing", "Copywriting", "Video Scripts", "Email Campaigns", "Graphic Design", "Brand Storytelling"]}
            img1={img1}
            img2={img2}
            img1Alt="Content creation team brainstorming ideas and writing copy"
            img2Alt="Writer producing SEO-optimized blog content at a desk"
          />
          <ServiceDetailsWorkflow steps={[
            { title: "Content Audit", description: "We audit your existing content to identify gaps, underperforming pages, and opportunities to improve visibility and engagement." },
            { title: "Editorial Strategy", description: "We build a content calendar aligned with your SEO goals, audience pain points, and the buyer journey from awareness to decision." },
            { title: "Creation & Review", description: "Our writers and designers produce content tailored to your brand voice. You review every piece before it's published or delivered." },
            { title: "Publish & Promote", description: "We publish, optimize, and distribute your content — through your channels or ours — to maximize reach and measurable impact." },
          ]} />
          <ServiceDetailsService
            img={imgDetail}
            imgAlt="Content strategist reviewing articles and planning editorial calendar"
            heading="Content that gets read, shared, and ranked on Google."
            body1="We produce content that serves two audiences simultaneously: your human readers and search engines. Every article, caption, and email is written to communicate clearly, reflect your brand, and achieve a measurable business outcome."
            body2="Whether you need a full content strategy, a one-time landing page, or a team of writers producing weekly articles — we adapt to your scale and budget. All content is original, plagiarism-free, and delivered on time."
          />
          <ServiceDetailsFaq
            faqImg={imgFaq}
            faqImgAlt="Writer creating content for blogs and social media"
            title="Content Creation — Frequently Asked Questions"
            faqs={[
              { question: "What types of content do you produce?", answer: "We produce blog articles, landing page copy, social media captions, email sequences, video scripts, product descriptions, ad copy, whitepapers, and brand guidelines. If it requires words or visuals, we can handle it." },
              { question: "Do you write in French and English?", answer: "Yes. Our team produces content in both French and English. We also handle bilingual content strategies for brands targeting audiences in France, the UK, and international markets." },
              { question: "Is the content SEO-optimized?", answer: "Yes. All blog content is written with target keywords, proper heading structure, internal linking, and meta description recommendations included as standard." },
              { question: "How do you match my brand voice?", answer: "We start every engagement with a brand voice session where we define your tone, style, vocabulary, and what to avoid. We then produce a sample piece for your review before proceeding with full production." },
            ]}
          />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </>
  );
};

export default ContentCreation;
