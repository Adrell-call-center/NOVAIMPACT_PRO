import Head from "next/head";
import { useEffect, useRef } from "react";
import RootLayout from "@/components/common/layout/RootLayout";
import PortfolioElementV2 from "@/components/portfolio/PortfolioElementV2";
import PortfolioV2CTA from "@/components/cta/PortfolioV2CTA";
import animationCharCome from "@/lib/utils/animationCharCome";

const SITE_URL = "https://novaimpact.io";

const OurWork = () => {
  const charAnim = useRef();
  useEffect(() => {
    animationCharCome(charAnim.current);
  }, []);

  const title = "Portfolio — Nova Impact | Client Success Stories";
  const description = "Explore Nova Impact's portfolio of successful digital projects. Website creation, SEO campaigns, Meta Ads, Google Ads, and brand identity projects for clients across Europe and beyond.";
  const ogImage = `${SITE_URL}/assets/imgs/logo/footer-logo-white.png`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/portfolio#webpage`,
    "url": `${SITE_URL}/portfolio`,
    "name": title,
    "description": description,
    "isPartOf": { "@id": `${SITE_URL}/#website` },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": `${SITE_URL}/portfolio` }
      ]
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/portfolio`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/portfolio`} />
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
          <section className="pt-150 pb-130 portfolio-v2">
            <div className="container">
              <div className="row">
                <div className="col-xxl-8 col-xl-7 col-lg-6 col-md-6">
                  <div className="sec-title-wrapper">
                    <h2
                      className="sec-title-2 animation__char_come"
                      ref={charAnim}
                    >
                      Client <br /> Success Stories
                    </h2>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-6">
                  <div className="blog__text">
                    <p>
                      Crafting new bright brands, unique visual systems and
                      digital experience focused on a wide range of original
                      collabs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <PortfolioElementV2 />
          <PortfolioV2CTA />
        </RootLayout>
      </main>
    </>
  );
};

export default OurWork;
