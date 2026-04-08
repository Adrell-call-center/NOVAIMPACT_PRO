import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const categories = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return res.status(200).json({ categories: categories.map(c => c.category) });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
