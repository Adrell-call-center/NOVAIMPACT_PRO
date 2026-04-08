import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import Team1 from "@/components/team/Team1";
import TeamCounter from "@/components/counter/TeamCounter";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";

const SITE_URL = "https://novaimpact.io";

const Team = () => {
  const title = "Our Team — Nova Impact | Digital Marketing Experts";
  const description = "Meet the Nova Impact team — strategists, designers, developers, and digital marketers working together to deliver measurable results for brands across Europe and beyond.";
  const ogImage = `${SITE_URL}/assets/imgs/logo/footer-logo-white.png`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/team#webpage`,
    "url": `${SITE_URL}/team`,
    "name": title,
    "description": description,
    "isPartOf": { "@id": `${SITE_URL}/#website` },
    "about": { "@id": `${SITE_URL}/#organization` },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "Team", "item": `${SITE_URL}/team` }
      ]
    }
  };

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/team`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/team`} />
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
          <Team1 />
          <TeamCounter />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </div>
  );
};

export default Team;
