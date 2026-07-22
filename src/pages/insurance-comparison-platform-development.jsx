import RootLayout from "@/components/common/layout/RootLayout";
import InsuranceComparatorLanding from "@/components/insurance-comparator/InsuranceComparatorLanding";
import PageSeo from "@/components/seo/PageSeo";
import content from "@/data/insurance-comparator-en";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema-helpers";
import { ORGANIZATION_ID, SITE_NAME, SITE_URL } from "@/lib/site";

const EN_PATH = "/insurance-comparison-platform-development";
const FR_PATH = "/developpement-comparateur-assurance";

function pageSchema() {
  const url = absoluteUrl(EN_PATH);
  return {
    "@context": "https://schema.org",
    "@graph": [
      webPageSchema({
        url,
        name: content.title,
        description: content.description,
        type: "WebPage",
      }),
      breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "Services", url: absoluteUrl("/service") },
        { name: content.hero.title, url },
      ]),
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: content.hero.title,
        description: content.description,
        provider: { "@id": ORGANIZATION_ID },
        url,
        serviceType: "Insurance Comparison Platform Development",
        areaServed: "Worldwide",
        brand: { "@type": "Brand", name: SITE_NAME },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: content.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}

export default function InsuranceComparisonPlatformDevelopment() {
  return (
    <div>
      <PageSeo
        title={content.title}
        description={content.description}
        keywords={content.keywords}
        canonical={absoluteUrl(EN_PATH)}
        hrefLangAlternates={[
          { hrefLang: "en", href: absoluteUrl(EN_PATH) },
          { hrefLang: "fr", href: absoluteUrl(FR_PATH) },
          { hrefLang: "x-default", href: absoluteUrl(EN_PATH) },
        ]}
        schema={pageSchema()}
      />
      <RootLayout header="header3" footer="footer3">
        <InsuranceComparatorLanding content={content} />
      </RootLayout>
    </div>
  );
}
