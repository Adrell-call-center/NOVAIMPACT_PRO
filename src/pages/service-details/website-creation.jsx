import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import ServiceDetailsDevelopment from "@/components/development/ServiceDetailsDevelopment";
import ServiceDetailsWorkflow from "@/components/workflow/ServiceDetailsWorkflow";
import ServiceDetailsService from "@/components/service/ServiceDetailsService";
import ServiceDetailsFaq from "@/components/faq/ServiceDetailsFaq";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";

const img1 = "/images/website-creation-img1.webp";
const img2 = "/images/website-creation-img2.webp";
const imgDetail = "/images/website-creation-detail.webp";
const imgFaq = "/images/website-creation-faq.webp";

const WebsiteCreation = () => {
  return (
    <>
      <Head>
        <title>Website Creation Services — Nova Impact</title>
        <meta name="description" content="Professional website creation services. We design fast, responsive, SEO-optimized websites tailored to your business goals. Landing pages, e-commerce, and custom web solutions." />
        <meta name="keywords" content="website creation, web design, web development, responsive websites, e-commerce, SEO websites" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://novaimpact.io/service-details/website-creation" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://novaimpact.io/service-details/website-creation" />
        <meta property="og:title" content="Website Creation Services — Nova Impact" />
        <meta property="og:description" content="Professional website creation services. We design fast, responsive, SEO-optimized websites tailored to your business goals." />
        <meta property="og:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <meta property="og:site_name" content="Nova Impact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Website Creation Services — Nova Impact" />
        <meta name="twitter:description" content="Professional website creation services. Fast, responsive, SEO-optimized websites tailored to your business goals." />
        <meta name="twitter:image" content="https://novaimpact.io/assets/imgs/logo/footer-logo-white.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Service",
          "name": "Website Creation",
          "provider": { "@id": "https://novaimpact.io/#organization" },
          "url": "https://novaimpact.io/service-details/website-creation",
          "description": "Professional website creation services including landing pages, e-commerce, and custom web solutions.",
          "serviceType": "Web Design & Development"
        }) }} />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <ServiceDetailsDevelopment
            title="Website Creation"
            description1="We design and develop fast, responsive, and SEO-optimized websites tailored to your business goals. From simple landing pages to complex e-commerce platforms, we build digital experiences that convert visitors into customers."
            description2="Every website we create is built with clean code, optimized performance, and mobile-first design principles. We ensure your site loads quickly, ranks well on search engines, and delivers an exceptional user experience across all devices."
            tags={["Custom Web Design", "WordPress & Next.js", "E-commerce Solutions", "Responsive & Mobile-First", "SEO-Ready Architecture", "Performance Optimization"]}
            img1={img1}
            img2={img2}
            img1Alt="Web designer working on a modern website interface"
            img2Alt="Developer writing clean code for a responsive website"
          />
          <ServiceDetailsWorkflow steps={[
            { title: "Discovery", description: "We analyze your business, your target audience, and your competitors to define the right structure and positioning for your website." },
            { title: "Design", description: "Our designers create a custom visual identity for your site — wireframes, mockups, and a UI that reflects your brand and converts." },
            { title: "Development", description: "We build your site with clean, performant code — fully responsive, SEO-ready, and integrated with the tools you need." },
            { title: "Launch & Support", description: "We handle deployment, speed testing, and SEO setup. Post-launch, we remain available for updates and ongoing improvements." },
          ]} />
          <ServiceDetailsService
            img={imgDetail}
            imgAlt="Professional website displayed across multiple devices"
            heading="A website that works as hard as you do — 24/7."
            body1="Your website is your most powerful sales tool. We build sites that load in under 2 seconds, rank on Google, and guide visitors toward conversion — whether that's a form submission, a call, or a purchase."
            body2="We work with WordPress, Next.js, Webflow, and custom stacks depending on your needs. Every project includes on-page SEO setup, analytics integration, and a full handover so you stay in control."
          />
          <ServiceDetailsFaq
            faqImg={imgFaq}
            faqImgAlt="Web design consultation meeting"
            title="Website Creation — FAQ"
            faqs={[
              { question: "How long does it take to build a website?", answer: "A landing page typically takes 1–2 weeks. A full business website takes 3–5 weeks. E-commerce projects range from 4–8 weeks depending on the number of products and integrations required." },
              { question: "Will my website be optimized for Google?", answer: "Yes. Every website we build includes on-page SEO setup: meta tags, semantic HTML, optimized images, fast loading speeds, and structured data markup." },
              { question: "Can I update the website myself after launch?", answer: "Absolutely. We build on CMS platforms (WordPress, Webflow) that let you edit content easily, or we provide full training so you can manage your site independently." },
              { question: "Do you offer maintenance and hosting?", answer: "Yes. We offer monthly maintenance packages covering hosting, security updates, backups, and content changes so your site stays fast, secure, and up to date." },
            ]}
          />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </>
  );
};

export default WebsiteCreation;
