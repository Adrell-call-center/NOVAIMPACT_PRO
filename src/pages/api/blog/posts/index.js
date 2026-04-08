import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page = 1, limit = 9, category, tag } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = { status: 'PUBLISHED', noIndex: false };
    if (category) where.category = category;
    if (tag) where.tags = { has: tag };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limitNum,
        select: {
          id: true, slug: true, titleFr: true, titleEn: true,
          excerptFr: true, excerptEn: true, coverImage: true,
          category: true, tags: true, publishedAt: true,
        },
      }),
      prisma.post.count({ where }),
    ]);

    return res.status(200).json({
      posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
