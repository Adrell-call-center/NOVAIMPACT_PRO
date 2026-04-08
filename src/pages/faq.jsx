import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import Faq1 from "@/components/faq/Faq1";
import FaqCTA from "@/components/cta/FaqCTA";

const SITE_URL = "https://novaimpact.io";

const Faq = () => {
  const title = "FAQs — Nova Impact | Digital Marketing Questions Answered";
  const description = "Frequently asked questions about Nova Impact's digital marketing services including SEO, Meta Ads, Google Ads, website creation, and social media management.";
  const ogImage = `${SITE_URL}/assets/imgs/logo/footer-logo-white.png`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/faq#webpage`,
        "url": `${SITE_URL}/faq`,
        "name": title,
        "description": description,
        "isPartOf": { "@id": `${SITE_URL}/#website` },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
            { "@type": "ListItem", "position": 2, "name": "FAQ", "item": `${SITE_URL}/faq` }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What digital marketing services does Nova Impact offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Nova Impact offers website creation, SEO, Meta Ads, Google Ads, social media management, content creation, brand identity, comparator creation, and consulting & support."
            }
          },
          {
            "@type": "Question",
            "name": "Where is Nova Impact based?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Nova Impact has offices in London (Covent Garden) and Marseille, and serves clients worldwide."
            }
          },
          {
            "@type": "Question",
            "name": "How can I contact Nova Impact?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can reach Nova Impact by email at contact@novaimpact.io or by phone at +44 7477 884817."
            }
          }
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
        <link rel="canonical" href={`${SITE_URL}/faq`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/faq`} />
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
          <Faq1 />
          <FaqCTA />
        </RootLayout>
      </main>
    </>
  );
};

export default Faq;
