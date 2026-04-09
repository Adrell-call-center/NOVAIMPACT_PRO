import RootLayout from '@/components/common/layout/RootLayout';
import BlogPost from '@/components/blog/BlogPost';
import { blogStore } from '@/lib/blog-store';

export default function BlogSlugPage({ post, related, lang }) {
  if (!post) return <div className="container py-5">Post not found</div>;
  return (
    <RootLayout header="header3" footer="footer3">
      <BlogPost post={post} related={related} forceLang={lang} />
    </RootLayout>
  );
}

export async function getServerSideProps({ params, query }) {
  const { slug } = params;
  const lang = query?.lang || 'fr';

  try {
    const post = await blogStore.getPost(slug, lang);
    if (!post) return { notFound: true };

    const related = await blogStore.getRelatedPosts(slug, post.category, lang);

    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
        related: JSON.parse(JSON.stringify(related)),
        lang,
      },
    };
  } catch (error) {
    console.error('ServerSide props error:', error);
    return { notFound: true };
  }
}
