import { breadcrumbSchema, webPageSchema } from "./schema-helpers";
import { SITE_NAME, absoluteUrl } from "./site";

export function buildSchema(post, lang = "fr") {
  if (!post || !post.slug) return {};

  const isFr = lang === "fr";
  const headline = isFr
    ? post.metaTitleFr || post.titleFr || ""
    : post.metaTitleEn || post.titleEn || "";
  const description = isFr
    ? post.metaDescFr || post.excerptFr || ""
    : post.metaDescEn || post.excerptEn || "";
  const pageUrl = absoluteUrl(`/blog/${post.slug}`);
  const image = absoluteUrl(
    post.ogImageUrl || post.coverImage || "/assets/imgs/logo/footer-logo-white.png"
  );

  const base = {
    "@context": "https://schema.org",
    "@graph": [
      webPageSchema({
        url: pageUrl,
        name: `${headline} — ${SITE_NAME}`,
        description,
        type: "WebPage",
      }),
      breadcrumbSchema([
        { name: "Home", url: absoluteUrl("/") },
        { name: "Blog", url: absoluteUrl("/blog") },
        { name: headline, url: pageUrl },
      ]),
      {
        "@type": post.schemaType || "BlogPosting",
        "@id": `${pageUrl}#article`,
        headline,
        description,
        image,
        datePublished: post.publishedAt || new Date().toISOString(),
        dateModified: post.updatedAt || post.publishedAt || new Date().toISOString(),
        author: { "@type": "Organization", name: SITE_NAME },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/assets/imgs/logo/footer-logo-white.png"),
          },
        },
        inLanguage: isFr ? "fr-FR" : "en-US",
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
        url: pageUrl,
      },
    ],
  };

  if (post.schemaOverrides && typeof post.schemaOverrides === "object") {
    return deepMerge(base, post.schemaOverrides);
  }
  return base;
}

function deepMerge(target, source) {
  const output = { ...target };
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      if (!output[key]) output[key] = {};
      output[key] = deepMerge(output[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}
