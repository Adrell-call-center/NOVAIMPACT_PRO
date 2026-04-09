import Head from 'next/head';
import { buildSchema } from '@/lib/schema-builder';

export default function BlogSeo({ post, lang = 'fr' }) {
  const isFr = lang === 'fr';
  const title = post.metaTitleFr || post.titleFr;
  const titleEn = post.metaTitleEn || post.titleEn;
  const desc = post.metaDescFr || post.excerptFr;
  const descEn = post.metaDescEn || post.excerptEn;
  const baseUrl = `https://novaimpact.io`;
  const urlFr = `${baseUrl}/blog/${post.slug}?lang=fr`;
  const urlEn = `${baseUrl}/blog/${post.slug}?lang=en`;
  const canonicalUrl = isFr ? urlFr : urlEn;
  const ogImage = post.ogImageUrl || post.coverImage || '/assets/imgs/thumb/og-default.jpg';
  const schema = buildSchema(post, lang);

  return (
    <Head>
      <title>{isFr ? title : titleEn} — Nova Impact</title>
      <meta name="description" content={isFr ? desc : descEn} />
      {post.noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!post.noIndex && <meta name="robots" content="index, follow" />}
      {post.canonicalUrl ? <link rel="canonical" href={post.canonicalUrl} /> : <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:title" content={isFr ? title : titleEn} />
      <meta property="og:description" content={isFr ? desc : descEn} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={isFr ? title : titleEn} />
      <meta name="twitter:description" content={isFr ? desc : descEn} />
      <meta name="twitter:image" content={ogImage} />
      <html lang={isFr ? 'fr' : 'en'} />
      <link rel="alternate" hrefLang="fr" href={urlFr} />
      <link rel="alternate" hrefLang="en" href={urlEn} />
      <link rel="alternate" hrefLang="x-default" href={urlFr} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {post.focusKeywordFr && <meta name="keywords" content={isFr ? post.focusKeywordFr : post.focusKeywordEn} />}
    </Head>
  );
}
