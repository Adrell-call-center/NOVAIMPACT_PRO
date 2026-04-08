import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { slug } = req.query;
    const post = await prisma.post.findUnique({
      where: { slug, status: 'PUBLISHED' },
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Fetch related posts
    const related = await prisma.post.findMany({
      where: { status: 'PUBLISHED', slug: { not: slug }, category: post.category },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, titleFr: true, titleEn: true, coverImage: true },
    });

    return res.status(200).json({ post, related });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
