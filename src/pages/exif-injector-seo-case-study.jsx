import RootLayout from "@/components/common/layout/RootLayout";
import ExifInjectorSeoCaseStudy from "@/components/case-studies/ExifInjectorSeoCaseStudy";
import PageSeo from "@/components/seo/PageSeo";
import { EXIF_SEO_PATH, faqs } from "@/data/exif-injector-seo-case-study";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema-helpers";

const PAGE_TITLE =
  "EXIF Injector SEO Case Study: 0 → 12,000+ Organic Clicks, No Paid Ads | Nova Impact";
const PAGE_DESCRIPTION =
  "How Nova Impact grew EXIF Injector from 0 to 12,000+ organic clicks, 415K+ impressions and 3,095 users in ~7 months — a month-by-month SaaS SEO case study with zero paid advertising.";
const PAGE_KEYWORDS =
  "SaaS SEO case study, organic growth case study, EXIF Injector, SEO without paid ads, SaaS organic growth, programmatic SEO case study, how to grow a SaaS with SEO, metadata tool SEO, Nova Impact SEO";
const OG_IMAGE = absoluteUrl("/images/projects/exifinjector/hero.png");

function pageSchema() {
  const url = absoluteUrl(EXIF_SEO_PATH);
  return {
    "@context": "https://schema.org",
    "@graph": [
      webPageSchema({
        url,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        type: "WebPage",
      }),
      breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "Portfolio", url: absoluteUrl("/portfolio") },
        { name: "EXIF Injector SEO Case Study", url },
      ]),
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline:
          "EXIF Injector SEO Case Study: 0 to 12,000+ Organic Clicks With No Paid Ads",
        description: PAGE_DESCRIPTION,
        image: OG_IMAGE,
        author: { "@type": "Organization", name: SITE_NAME },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/assets/imgs/logo/footer-logo-white.png"),
          },
        },
        mainEntityOfPage: { "@id": `${url}#webpage` },
        about: {
          "@type": "SoftwareApplication",
          name: "EXIF Injector",
          applicationCategory: "MultimediaApplication",
          description:
            "AI-powered SaaS platform for viewing, editing, injecting and removing image metadata (EXIF, IPTC, XMP).",
          url: "https://exifinjector.com/",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqs.map((faq) => ({
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

export default function ExifInjectorSeoCaseStudyPage() {
  return (
    <div>
      <PageSeo
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        keywords={PAGE_KEYWORDS}
        canonical={absoluteUrl(EXIF_SEO_PATH)}
        ogImage={OG_IMAGE}
        ogType="article"
        schema={pageSchema()}
      />
      <main>
        <RootLayout header="header3" footer="footer3">
          <ExifInjectorSeoCaseStudy />
        </RootLayout>
      </main>
    </div>
  );
}
