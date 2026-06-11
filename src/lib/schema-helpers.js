import { ORGANIZATION_ID, SITE_NAME, SITE_URL, WEBSITE_ID, absoluteUrl } from "./site";

export function breadcrumbSchema(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function webPageSchema({ url, name, description, type = "WebPage" }) {
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function caseStudySchema(project) {
  const pageUrl = absoluteUrl(`/portfolio/${project.slug}`);
  const title =
    project.seoTitle || `${project.title} — Case Study — ${SITE_NAME}`;
  const description = project.metaDescription || project.description || "";
  const image = absoluteUrl(project.thumbnail || project.heroImage);

  return {
    "@context": "https://schema.org",
    "@graph": [
      webPageSchema({
        url: pageUrl,
        name: title,
        description,
        type: "WebPage",
      }),
      breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "Portfolio", url: absoluteUrl("/portfolio") },
        { name: project.title, url: pageUrl },
      ]),
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: project.displayTitle || project.title,
        description,
        image,
        author: { "@type": "Organization", name: SITE_NAME },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/assets/imgs/logo/footer-logo-white.png"),
          },
        },
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
        about: {
          "@type": "CreativeWork",
          name: project.title,
          description: project.subtitle || description,
        },
      },
    ],
  };
}

export function legalPageSchema({ path, title, description }) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      webPageSchema({ url, name: title, description }),
      breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: title, url },
      ]),
    ],
  };
}

export function blogCategorySchema(category) {
  const url = absoluteUrl(`/blog/category/${encodeURIComponent(category)}`);
  const title = `${category} — Blog — ${SITE_NAME}`;
  const description = `Articles about ${category} from ${SITE_NAME}.`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      webPageSchema({
        url,
        name: title,
        description,
        type: "CollectionPage",
      }),
      breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "Blog", url: absoluteUrl("/blog") },
        { name: category, url },
      ]),
    ],
  };
}
