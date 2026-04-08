import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import ServiceHero from "@/components/hero/ServiceHero";
import Service1 from "@/components/service/Service1";
import ServiceBrand from "@/components/brand/ServiceBrand";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";

const SITE_URL = "https://novaimpact.io";

const Service = () => {
  const title = "Our Services — Nova Impact | Digital Marketing, SEO & Web Design";
  const description = "Explore Nova Impact's full range of digital services: website creation, SEO, Meta Ads, Google Ads, social media management, content creation, and brand identity.";
  const ogImage = `${SITE_URL}/assets/imgs/logo/footer-logo-white.png`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/service#webpage`,
        "url": `${SITE_URL}/service`,
        "name": title,
        "description": description,
        "isPartOf": { "@id": `${SITE_URL}/#website` },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
            { "@type": "ListItem", "position": 2, "name": "Services", "item": `${SITE_URL}/service` }
          ]
        }
      },
      {
        "@type": "ItemList",
        "name": "Nova Impact Services",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Website Creation", "url": `${SITE_URL}/service-details/website-creation` },
          { "@type": "ListItem", "position": 2, "name": "SEO", "url": `${SITE_URL}/service-details/seo` },
          { "@type": "ListItem", "position": 3, "name": "Meta Ads", "url": `${SITE_URL}/service-details/meta-ads` },
          { "@type": "ListItem", "position": 4, "name": "Google Ads", "url": `${SITE_URL}/service-details/google-ads` },
          { "@type": "ListItem", "position": 5, "name": "Social Media Management", "url": `${SITE_URL}/service-details/social-media-management` },
          { "@type": "ListItem", "position": 6, "name": "Content Creation", "url": `${SITE_URL}/service-details/content-creation` },
          { "@type": "ListItem", "position": 7, "name": "Brand Identity", "url": `${SITE_URL}/service-details/brand-identity` },
          { "@type": "ListItem", "position": 8, "name": "Comparator Creation", "url": `${SITE_URL}/service-details/comparator-creation` },
          { "@type": "ListItem", "position": 9, "name": "Consulting & Support", "url": `${SITE_URL}/service-details/consulting-support` }
        ]
      }
    ]
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/service`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/service`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="Nova Impact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <ServiceHero />
          <Service1 />
          <ServiceBrand />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </>
  );
};

export default Service;
