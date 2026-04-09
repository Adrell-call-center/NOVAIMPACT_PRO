import prisma from './prisma';

export const blogStore = {
  /**
   * Get all published posts, optionally filtered by category and language.
   */
  async getPosts({ category, lang = 'fr', limit, offset = 0 } = {}) {
    const where = {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() },
      ...(category ? { category } : {}),
    };

    const posts = await prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: offset,
      take: limit,
      select: {
        id: true,
        slug: true,
        category: true,
        tags: true,
        publishedAt: true,
        coverImage: true,
        ...(lang === 'fr'
          ? { titleFr: true, excerptFr: true }
          : { titleEn: true, excerptEn: true }),
      },
    });

    const total = await prisma.post.count({ where });

    return {
      posts: posts.map((p) => ({
        ...p,
        title: lang === 'fr' ? p.titleFr : p.titleEn,
        excerpt: lang === 'fr' ? p.excerptFr : p.excerptEn,
      })),
      total,
    };
  },

  /**
   * Get a single post by slug and language.
   */
  async getPost(slug, lang = 'fr') {
    const post = await prisma.post.findFirst({
      where: { slug, status: 'PUBLISHED', publishedAt: { lte: new Date() } },
      select: {
        id: true,
        slug: true,
        category: true,
        tags: true,
        publishedAt: true,
        coverImage: true,
        noIndex: true,
        canonicalUrl: true,
        metaTitleFr: true,
        metaTitleEn: true,
        metaDescFr: true,
        metaDescEn: true,
        focusKeywordFr: true,
        focusKeywordEn: true,
        ...(lang === 'fr'
          ? { titleFr: true, excerptFr: true, contentFr: true }
          : { titleEn: true, excerptEn: true, contentEn: true }),
      },
    });

    if (!post) return null;

    return {
      ...post,
      title: lang === 'fr' ? post.titleFr : post.titleEn,
      excerpt: lang === 'fr' ? post.excerptFr : post.excerptEn,
      content: lang === 'fr' ? post.contentFr : post.contentEn,
      metaTitle: lang === 'fr' ? post.metaTitleFr : post.metaTitleEn,
      metaDesc: lang === 'fr' ? post.metaDescFr : post.metaDescEn,
      focusKeyword: lang === 'fr' ? post.focusKeywordFr : post.focusKeywordEn,
    };
  },

  /**
   * Get all unique categories from published posts.
   */
  async getCategories() {
    const categories = await prisma.post.findMany({
      where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } },
      select: { category: true },
      distinct: ['category'],
    });
    return categories.map((c) => c.category).filter(Boolean);
  },

  /**
   * Get related posts for a given post (same category, excluding current).
   */
  async getRelatedPosts(slug, category, lang = 'fr', limit = 3) {
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
        slug: { not: slug },
        ...(category ? { category } : {}),
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: {
        slug: true,
        coverImage: true,
        publishedAt: true,
        ...(lang === 'fr' ? { titleFr: true } : { titleEn: true }),
      },
    });

    return posts.map((p) => ({
      ...p,
      title: lang === 'fr' ? p.titleFr : p.titleEn,
    }));
  },

  /**
   * Get all published posts (recent), limited and ordered by date.
   */
  async getAllPosts(lang = 'fr', limit = 4) {
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        slug: true,
        coverImage: true,
        publishedAt: true,
        category: true,
        ...(lang === 'fr' ? { titleFr: true } : { titleEn: true }),
      },
    });

    return posts.map((p) => ({
      ...p,
      title: lang === 'fr' ? p.titleFr : p.titleEn,
    }));
  },
};
