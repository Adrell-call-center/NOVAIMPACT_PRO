import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';
import { generateSlug } from '@/lib/slugify';

export default async function handler(req, res) {
  const session = await requireAdmin(req, res);
  if (!session) return;

  if (req.method === 'GET') {
    const { search } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { titleFr: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
      ];
    }
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, slug: true, titleFr: true, titleEn: true, status: true,
        category: true, publishedAt: true, createdAt: true, updatedAt: true,
        coverImage: true, noIndex: true,
      },
    });
    return res.status(200).json({ posts });
  }

  if (req.method === 'POST') {
    const { titleFr, titleEn, excerptFr, excerptEn, contentFr, contentEn, category, tags, status, publishedAt, metaTitleFr, metaTitleEn, metaDescFr, metaDescEn, focusKeywordFr, focusKeywordEn, canonicalUrl, noIndex, coverImage, ogImageUrl, schemaType, schemaOverrides, slug: slugFromBody } = req.body;

    if (!titleFr) return res.status(400).json({ error: 'titleFr is required' });

    const existingSlugs = await prisma.post.findMany({ select: { slug: true } });
    const slug = slugFromBody ? slugFromBody : generateSlug(titleFr, existingSlugs.map(p => p.slug));

    const post = await prisma.post.create({
      data: {
        slug, titleFr: titleFr || '', titleEn: titleEn || '',
        excerptFr: excerptFr || '', excerptEn: excerptEn || '',
        contentFr: contentFr || '', contentEn: contentEn || '',
        category: category || '', tags: tags || [],
        status: status || 'DRAFT',
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        metaTitleFr, metaTitleEn, metaDescFr, metaDescEn,
        focusKeywordFr, focusKeywordEn, canonicalUrl,
        noIndex: noIndex || false, coverImage, ogImageUrl,
        schemaType: schemaType || 'Article',
        schemaOverrides: schemaOverrides || null,
      },
    });

    if (post.status === 'PUBLISHED') {
      try {
        await res.revalidate('/blog');
        await res.revalidate(`/blog/${post.slug}`);
      } catch (e) { console.log('Revalidation error:', e); }
    }

    return res.status(201).json({ post });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
