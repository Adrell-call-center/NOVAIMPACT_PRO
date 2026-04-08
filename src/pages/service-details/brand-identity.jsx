import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import ServiceDetailsDevelopment from "@/components/development/ServiceDetailsDevelopment";
import ServiceDetailsWorkflow from "@/components/workflow/ServiceDetailsWorkflow";
import ServiceDetailsService from "@/components/service/ServiceDetailsService";
import ServiceDetailsFaq from "@/components/faq/ServiceDetailsFaq";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";

const img1 = "/images/brand-identity-img1.webp";
const img2 = "/images/brand-identity-img2.webp";
const imgDetail = "/images/brand-identity-detail.webp";
const imgFaq = "/images/brand-identity-faq.webp";

const BrandIdentity = () => {
  return (
    <>
      <Head>
        <title>Brand Identity Services — Logo Design & Visual Identity — Nova Impact</title>
        <meta name="description" content="Professional brand identity services. Logo design, color systems, typography, and brand guidelines that communicate your values and help you stand out in the market." />
        <meta name="keywords" content="brand identity, logo design, visual identity, brand guidelines, branding, brand strategy, corporate identity" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://novaimpact.io/service-details/brand-identity" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://novaimpact.io/service-details/brand-identity" />
        <meta property="og:title" content="Brand Identity Services — Logo Design & Visual Identity — Nova Impact" />
        <meta property="og:description" content="Professional brand identity — logo design, color systems, typography, and brand guidelines that communicate your values." />
        <meta property="og:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <meta property="og:site_name" content="Nova Impact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Brand Identity — Nova Impact" />
        <meta name="twitter:description" content="Logo design, color systems, typography, and brand guidelines that communicate your values and differentiate you." />
        <meta name="twitter:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Service",
          "name": "Brand Identity",
          "provider": { "@id": "https://novaimpact.io/#organization" },
          "url": "https://novaimpact.io/service-details/brand-identity",
          "description": "Logo design, color systems, typography, and brand guidelines to build recognition and trust.",
          "serviceType": "Branding"
        }) }} />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <ServiceDetailsDevelopment
            title="Brand Identity"
            description1="We craft brand identities that make businesses unforgettable. From logo design and color palettes to typography systems and comprehensive brand guidelines, every element is designed to communicate your values and set you apart from competitors."
            description2="A strong brand identity is more than a logo — it's the full visual and verbal language of your business. We ensure your brand is consistent, memorable, and built to scale across every touchpoint: digital, print, signage, and beyond."
            tags={["Logo Design", "Color System", "Typography", "Brand Guidelines", "Visual Identity", "Brand Strategy"]}
            img1={img1}
            img2={img2}
            img1Alt="Brand identity designer creating a visual identity system"
            img2Alt="Logo design and brand color palette presentation"
          />
          <ServiceDetailsWorkflow steps={[
            { title: "Brand Discovery", description: "We start with an in-depth discovery session to understand your vision, values, positioning, audience, and competitors — the foundation of every great brand." },
            { title: "Concept Design", description: "Our designers develop 2–3 distinct creative directions based on the discovery. You review concepts and provide feedback to guide the final direction." },
            { title: "Identity Development", description: "We refine the chosen direction into a complete identity system: logo suite, color palette, typography, iconography, and usage rules." },
            { title: "Brand Guidelines", description: "We deliver a comprehensive brand guidelines document so every team member, partner, and vendor uses your brand consistently and correctly." },
          ]} />
          <ServiceDetailsService
            img={imgDetail}
            imgAlt="Complete brand identity system displayed across business materials"
            heading="Your brand is the first impression you never get to make twice."
            body1="We build brand identities that communicate professionalism, build trust, and attract the right clients from the first interaction. Whether you're launching a new brand or rebranding an established business, we deliver a visual identity you'll be proud of."
            body2="Our branding process is strategic, not just aesthetic. We align every design decision with your positioning and target audience — so your brand doesn't just look good, it works hard to grow your business."
          />
          <ServiceDetailsFaq
            faqImg={imgFaq}
            faqImgAlt="Brand designer presenting logo concepts and visual identity"
            title="Brand Identity — Frequently Asked Questions"
            faqs={[
              { question: "What's included in a brand identity package?", answer: "Our standard brand identity package includes: logo design (primary, secondary, and icon versions), color palette, typography system, and a brand guidelines document. We also offer extended packages with business card design, social media templates, and stationery." },
              { question: "How long does brand identity design take?", answer: "A complete brand identity project typically takes 3–5 weeks from kick-off to final delivery. This includes the discovery session, concept presentation, revision rounds, and final file delivery." },
              { question: "How many revision rounds do I get?", answer: "We include 2 rounds of revisions at the concept stage and 2 rounds on the final chosen direction. Additional revision rounds can be added to any package if needed." },
              { question: "What file formats will I receive?", answer: "You'll receive all final logo files in vector format (AI, EPS, SVG) and raster formats (PNG, JPG) across multiple sizes and backgrounds — everything you need for web, print, and any future use." },
            ]}
          />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </>
  );
};

export default BrandIdentity;
