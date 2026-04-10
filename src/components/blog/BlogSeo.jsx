import Head from 'next/head';

export default function BlogSeo({ post, lang = 'fr' }) {
  if (!post || !post.slug) {
    return (
      <Head>
        <title>Nova Impact Blog</title>
        <meta name="description" content="Nova Impact - Digital Agency" />
        <meta property="og:title" content="Nova Impact Blog" />
        <meta property="og:description" content="Nova Impact - Digital Agency" />
        <meta property="og:image" content="https://novaimpact.io/assets/imgs/thumb/og-default.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <html lang={lang || 'fr'} />
      </Head>
    );
  }

  const isFr = lang === 'fr';
  const title = isFr ? (post.titleFr || 'Nova Impact') : (post.titleEn || 'Nova Impact');
  const desc = isFr ? (post.excerptFr || 'Nova Impact Blog') : (post.excerptEn || 'Nova Impact Blog');
  const fullTitle = title + ' — Nova Impact';
  const ogImage = post.ogImageUrl || post.coverImage || 'https://novaimpact.io/assets/imgs/thumb/og-default.jpg';
  const slug = post.slug;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={'https://novaimpact.io/blog/' + slug} />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="robots" content={post.noIndex === true ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={'https://novaimpact.io/blog/' + slug} />
      <link rel="alternate" hrefLang="fr" href={'https://novaimpact.io/blog/' + slug + '?lang=fr'} />
      <link rel="alternate" hrefLang="en" href={'https://novaimpact.io/blog/' + slug + '?lang=en'} />
      <html lang={isFr ? 'fr' : 'en'} />
    </Head>
  );
}
