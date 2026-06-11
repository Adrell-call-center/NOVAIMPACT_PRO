import Head from "next/head";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/site";

export default function PageSeo({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  robots = "index, follow",
  schema,
  hrefLangAlternates,
}) {
  const schemas = schema
    ? Array.isArray(schema)
      ? schema
      : [schema]
    : [];

  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {robots && <meta name="robots" content={robots} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {hrefLangAlternates?.map((alt) => (
        <link
          key={alt.hrefLang}
          rel="alternate"
          hrefLang={alt.hrefLang}
          href={alt.href}
        />
      ))}
      <meta property="og:type" content={ogType} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
      {schemas.map((entry, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
    </Head>
  );
}
