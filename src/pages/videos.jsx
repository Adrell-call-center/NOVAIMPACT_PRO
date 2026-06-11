import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import VideoGalleryPage from "@/components/video/VideoGalleryPage";
import PortfolioV2CTA from "@/components/cta/PortfolioV2CTA";

const SITE_URL = "https://novaimpact.io";

const Videos = () => {
  const title = "Videos — Nova Impact | Campaign Reels & Creative Work";
  const description =
    "Watch Nova Impact campaign reels, brand content, and behind-the-scenes videos. Social media, paid ads, and creative production from our studio.";
  const ogImage = `${SITE_URL}/assets/imgs/logo/footer-logo-white.png`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/videos#webpage`,
    url: `${SITE_URL}/videos`,
    name: title,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Videos",
          item: `${SITE_URL}/videos`,
        },
      ],
    },
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/videos`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/videos`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="Nova Impact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <VideoGalleryPage />
          <PortfolioV2CTA />
        </RootLayout>
      </main>
    </>
  );
};

export default Videos;
