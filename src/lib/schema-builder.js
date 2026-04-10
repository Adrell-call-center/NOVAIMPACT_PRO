export function buildSchema(post, lang = 'fr') {
  if (!post || !post.slug) return {};
  
  const isFr = lang === 'fr';
  const base = {
    '@context': 'https://schema.org',
    '@type': post.schemaType || 'Article',
    headline: isFr ? (post.titleFr || '') : (post.titleEn || ''),
    description: isFr ? (post.excerptFr || '') : (post.excerptEn || ''),
    image: post.ogImageUrl || post.coverImage || '/assets/imgs/thumb/og-default.jpg',
    datePublished: post.publishedAt || new Date().toISOString(),
    dateModified: post.updatedAt || new Date().toISOString(),
    author: { '@type': 'Organization', name: 'Nova Impact' },
    publisher: {
      '@type': 'Organization',
      name: 'Nova Impact',
      logo: { '@type': 'ImageObject', url: 'https://novaimpact.io/assets/imgs/logo/site-logo-white-2.png' },
    },
    inLanguage: isFr ? 'fr-FR' : 'en-US',
    url: `https://novaimpact.io/blog/${post.slug}`,
  };

  if (post.schemaOverrides && typeof post.schemaOverrides === 'object') {
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
