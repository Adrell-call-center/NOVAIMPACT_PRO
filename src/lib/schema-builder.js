export function buildSchema(post, lang = 'fr') {
  const isFr = lang === 'fr';
  const base = {
    '@context': 'https://schema.org',
    '@type': post.schemaType || 'Article',
    headline: isFr ? post.titleFr : post.titleEn,
    description: isFr ? post.excerptFr : post.excerptEn,
    image: post.ogImageUrl || post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Organization', name: 'Nova Impact' },
    publisher: {
      '@type': 'Organization',
      name: 'Nova Impact',
      logo: { '@type': 'ImageObject', url: '/assets/imgs/logo/site-logo-white-2.png' },
    },
    inLanguage: isFr ? 'fr-FR' : 'en-US',
    url: `https://novaimpact.io/blog/${post.slug}?lang=${lang}`,
  };

  if (post.schemaOverrides) {
    return deepMerge(base, post.schemaOverrides);
  }
  return base;
}

function deepMerge(target, source) {
  const output = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!output[key]) output[key] = {};
      output[key] = deepMerge(output[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}
