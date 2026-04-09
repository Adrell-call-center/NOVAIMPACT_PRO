import RootLayout from '@/components/common/layout/RootLayout';
import BlogPost from '@/components/blog/BlogPost';
import { blogStore } from '@/lib/blog-store';

export default function BlogSlugPage({ post, related, recent }) {
  if (!post) return <div className="container py-5">Post not found</div>;
  return (
    <RootLayout header="header3" footer="footer3">
      <BlogPost post={post} related={related} recent={recent} />
    </RootLayout>
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;
  // Default to French for server-side rendering
  const lang = 'fr';

  try {
    const post = await blogStore.getPost(slug, lang);
    if (!post) return { notFound: true };

    const related = await blogStore.getRelatedPosts(slug, post.category, lang);
    
    // Fetch recent posts (excluding current post)
    const recentPosts = await blogStore.getAllPosts(lang, 4);
    const recent = recentPosts
      .filter(p => p.slug !== slug)
      .slice(0, 4)
      .map(p => JSON.parse(JSON.stringify(p)));

    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
        related: JSON.parse(JSON.stringify(related)),
        recent,
      },
    };
  } catch (error) {
    console.error('ServerSide props error:', error);
    return { notFound: true };
  }
}
