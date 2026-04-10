import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import DigitalAgencyHero from "@/components/hero/DigitalAgencyHero";
import DigitalAgencyRoll from "@/components/roll/DigitalAgencyRoll";
import DigitalAgencyAbout from "@/components/about/DigitalAgencyAbout";
import DigitalAgencyService from "@/components/service/DigitalAgencyService";
import DigitalAgencyCounter from "@/components/counter/DigitalAgencyCounter";
import DigitalAgencyWorkflow from "@/components/workflow/DigitalAgencyWorkflow";
import HomePortfolioV6 from "@/components/portfolio/HomePortfolioV6";
import DigitalMarketingWorkflow from "@/components/workflow/DigitalMarketingWorkflow";
import DigitalAgencyBlog from "@/components/blog/DigitalAgencyBlog";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";
import Team1 from "@/components/team/Team1";
import Faq1 from "@/components/faq/Faq1";
import HomeProcess from "@/components/home/HomeProcess";

const SITE_URL = "https://novaimpact.io";

const Home = ({ latestPosts }) => {
  const title = "Nova Impact — Digital Agency | SEO, Ads & Web Design";
  const description = "Full-service digital agency: website creation, SEO, Meta Ads, Google Ads, social media & content creation. Based in London & Marseille.";
  const ogImage = `${SITE_URL}/assets/imgs/logo/footer-logo-white.png`;

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": "Nova Impact",
        "legalName": "NOVA IMPACT LTD",
        "url": SITE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_URL}/assets/imgs/logo/footer-logo-white.png`
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+44-7477-884817",
          "contactType": "customer service",
          "email": "contact@novaimpact.io",
          "areaServed": ["GB", "FR", "MA", "EU"],
          "availableLanguage": ["English", "French"]
        },
        "address": [
          {
            "@type": "PostalAddress",
            "streetAddress": "71-75 Shelton Street, Covent Garden",
            "addressLocality": "London",
            "postalCode": "WC2H 9JQ",
            "addressCountry": "GB"
          },
          {
            "@type": "PostalAddress",
            "streetAddress": "Bureau 3, 154 Rue de Rome",
            "addressLocality": "Marseille",
            "postalCode": "13006",
            "addressCountry": "FR"
          }
        ],
        "sameAs": [
          "https://linkedin.com/company/novaimpact",
          "https://instagram.com/novaimpact",
          "https://x.com/novaimpact",
          "https://youtube.com/@novaimpact"
        ],
        "foundingDate": "2022",
        "numberOfEmployees": { "@type": "QuantitativeValue", "value": 10 },
        "knowsAbout": [
          "Digital Marketing", "SEO", "Website Development",
          "Meta Ads", "Google Ads", "Social Media Management",
          "Brand Identity", "Content Creation"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "url": SITE_URL,
        "name": "Nova Impact",
        "description": description,
        "publisher": { "@id": `${SITE_URL}/#organization` },
        "inLanguage": ["en", "fr"],
        "potentialAction": {
          "@type": "SearchAction",
          "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/blog?q={search_term_string}` },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        "url": SITE_URL,
        "name": title,
        "description": description,
        "isPartOf": { "@id": `${SITE_URL}/#website` },
        "about": { "@id": `${SITE_URL}/#organization` },
        "datePublished": "2022-01-01",
        "dateModified": "2026-04-07",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL }]
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        "name": "Nova Impact",
        "image": `${SITE_URL}/assets/imgs/logo/footer-logo-white.png`,
        "url": SITE_URL,
        "telephone": "+44-7477-884817",
        "email": "contact@novaimpact.io",
        "priceRange": "€€",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "71-75 Shelton Street, Covent Garden",
          "addressLocality": "London",
          "postalCode": "WC2H 9JQ",
          "addressCountry": "GB"
        },
        "geo": { "@type": "GeoCoordinates", "latitude": 51.5142, "longitude": -0.1234 },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
          "opens": "09:00",
          "closes": "18:00"
        },
        "serviceArea": { "@type": "GeoShape", "name": "Worldwide" }
      }
    ]
  };

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={SITE_URL} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Nova Impact Digital Agency" />
        <meta property="og:site_name" content="Nova Impact" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:locale:alternate" content="fr_FR" />
        <meta property="article:published_time" content="2022-01-01T00:00:00+00:00" />
        <meta property="article:modified_time" content="2026-04-07T00:00:00+00:00" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@novaimpact" />
        <meta name="twitter:creator" content="@novaimpact" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* Extra SEO */}
        <meta name="author" content="Nova Impact" />
        <meta name="keywords" content="digital agency, SEO, web design, Meta Ads, Google Ads, social media management, brand identity, content creation, London, Marseille" />
        <meta name="theme-color" content="#FFC81A" />

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <DigitalAgencyHero />
          <DigitalAgencyRoll />
          <DigitalAgencyAbout />
          <DigitalAgencyService />
          <DigitalAgencyCounter />
          <HomePortfolioV6 />
          <HomeProcess />
          <DigitalAgencyWorkflow />
          <DigitalMarketingWorkflow />
          <DigitalAgencyBlog posts={latestPosts} />
          <Team1 />
          <Faq1 limit={4} showLink />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </div>
  );
};

export async function getServerSideProps() {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true, slug: true, titleFr: true,
        excerptFr: true, coverImage: true,
        category: true, publishedAt: true,
      },
    });
    return {
      props: {
        latestPosts: JSON.parse(JSON.stringify(posts)),
      },
    };
  } finally {
    await prisma.$disconnect();
  }
}

export default Home;
