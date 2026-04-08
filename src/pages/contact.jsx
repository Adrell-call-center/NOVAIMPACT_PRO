import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import Contact1 from "@/components/contact/Contact1";

const SITE_URL = "https://novaimpact.io";

const Contact = () => {
  const title = "Contact Nova Impact — Digital Agency | London & Marseille";
  const description = "Get in touch with Nova Impact. Contact our team in London or Marseille for digital marketing, SEO, web design, and advertising services. Email: contact@novaimpact.io";
  const ogImage = `${SITE_URL}/assets/imgs/logo/footer-logo-white.png`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${SITE_URL}/contact#webpage`,
        "url": `${SITE_URL}/contact`,
        "name": title,
        "description": description,
        "isPartOf": { "@id": `${SITE_URL}/#website` },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
            { "@type": "ListItem", "position": 2, "name": "Contact", "item": `${SITE_URL}/contact` }
          ]
        }
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": "Nova Impact",
        "url": SITE_URL,
        "telephone": "+44-7477-884817",
        "email": "contact@novaimpact.io",
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
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/contact`} />
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
          <Contact1 />
        </RootLayout>
      </main>
    </>
  );
};

export default Contact;
