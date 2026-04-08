import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const session = await requireAdmin(req, res);
  if (!session) return;

  const { id } = req.query;

  if (req.method === 'GET') {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    return res.status(200).json({ post });
  }

  if (req.method === 'PUT') {
    const { titleFr, titleEn, excerptFr, excerptEn, contentFr, contentEn, category, tags, status, publishedAt, metaTitleFr, metaTitleEn, metaDescFr, metaDescEn, focusKeywordFr, focusKeywordEn, canonicalUrl, noIndex, coverImage, ogImageUrl, schemaType, schemaOverrides, slug } = req.body;

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) return res.status(404).json({ error: 'Post not found' });

    const oldStatus = existingPost.status;
    const oldSlug = existingPost.slug;

    const post = await prisma.post.update({
      where: { id },
      data: {
        titleFr, titleEn, excerptFr, excerptEn, contentFr, contentEn,
        category, tags, status,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        metaTitleFr, metaTitleEn, metaDescFr, metaDescEn,
        focusKeywordFr, focusKeywordEn, canonicalUrl,
        noIndex, coverImage, ogImageUrl,
        schemaType, schemaOverrides, slug,
      },
    });

    if (status === 'PUBLISHED' || oldStatus === 'PUBLISHED') {
      try {
        await res.revalidate('/blog');
        await res.revalidate(`/blog/${post.slug}`);
        if (oldSlug !== post.slug) await res.revalidate(`/blog/${oldSlug}`);
        if (existingPost.category !== category) {
          await res.revalidate(`/blog/category/${existingPost.category}`);
          await res.revalidate(`/blog/category/${category}`);
        }
      } catch (e) { console.log('Revalidation error:', e); }
    }

    return res.status(200).json({ post });
  }

  if (req.method === 'DELETE') {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    await prisma.post.delete({ where: { id } });

    try {
      await res.revalidate('/blog');
      await res.revalidate(`/blog/${post.slug}`);
    } catch (e) { console.log('Revalidation error:', e); }

    return res.status(200).json({ message: 'Post deleted' });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
