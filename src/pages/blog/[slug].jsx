import RootLayout from '@/components/common/layout/RootLayout';
import BlogPost from '@/components/blog/BlogPost';
import { blogStore } from '@/lib/blog-store';

export default function BlogSlugPage({ post, related, recent, initialLang }) {
  if (!post) return <div className="container py-5"><h2>Post not found</h2></div>;
  return (
    <RootLayout header="header3" footer="footer3">
      <BlogPost post={post} related={related} recent={recent} initialLang={initialLang} />
    </RootLayout>
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;
  const lang = 'fr';

  try {
    const post = await blogStore.getPost(slug, lang);
    if (!post) return { notFound: true };

    const contentKey = lang === 'fr' ? 'contentFr' : 'contentEn';
    if (!post[contentKey]) return { notFound: true };

    const related = await blogStore.getRelatedPosts(slug, post.category, lang);

    const recentPosts = await blogStore.getAllPosts(lang, 4);
    const recent = recentPosts
      .filter(p => p.slug !== slug)
      .slice(0, 4)
      .map(p => JSON.parse(JSON.stringify(p)));

    const safePost = {
      ...post,
      contentFr: post.contentFr || '',
      contentEn: post.contentEn || '',
      titleFr: post.titleFr || '',
      titleEn: post.titleEn || '',
      excerptFr: post.excerptFr || '',
      excerptEn: post.excerptEn || '',
      coverImage: post.coverImage || '',
      ogImageUrl: post.ogImageUrl || '',
      category: post.category || '',
      tags: Array.isArray(post.tags) ? post.tags : [],
      metaTitleFr: post.metaTitleFr || '',
      metaTitleEn: post.metaTitleEn || '',
      metaDescFr: post.metaDescFr || '',
      metaDescEn: post.metaDescEn || '',
      focusKeywordFr: post.focusKeywordFr || '',
      focusKeywordEn: post.focusKeywordEn || '',
      noIndex: post.noIndex || false,
      canonicalUrl: post.canonicalUrl || '',
      publishedAt: post.publishedAt || new Date().toISOString(),
    };

    return {
      props: {
        post: JSON.parse(JSON.stringify(safePost)),
        related: JSON.parse(JSON.stringify(related)),
        recent,
        initialLang: lang,
      },
    };
  } catch (error) {
    console.error('ServerSide props error:', error);
    return { notFound: true };
  }
}
