import { Component } from 'react';
import RootLayout from '@/components/common/layout/RootLayout';
import BlogPost from '@/components/blog/BlogPost';
import { blogStore } from '@/lib/blog-store';

// Error Boundary to prevent infinite error loops
class BlogErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Blog post error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <RootLayout header="header3" footer="footer3">
          <div className="container py-5" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <h1>Something went wrong</h1>
            <p>Please try refreshing the page</p>
            <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '16px' }}>
              Refresh Page
            </button>
          </div>
        </RootLayout>
      );
    }
    return this.props.children;
  }
}

export default function BlogSlugPage({ post, related, recent, initialLang }) {
  if (!post) return <div className="container py-5"><h2>Post not found</h2></div>;
  return (
    <BlogErrorBoundary>
      <RootLayout header="header3" footer="footer3">
        <BlogPost post={post} related={related} recent={recent} initialLang={initialLang} />
      </RootLayout>
    </BlogErrorBoundary>
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;
  // Default to French for server-side rendering
  const lang = 'fr';

  try {
    const post = await blogStore.getPost(slug, lang);
    // Return 404 if post doesn't exist or has no content
    const contentKey = lang === 'fr' ? 'contentFr' : 'contentEn';
    if (!post || !post[contentKey]) return { notFound: true };

    const related = await blogStore.getRelatedPosts(slug, post.category, lang);

    // Fetch recent posts (excluding current post)
    const recentPosts = await blogStore.getAllPosts(lang, 4);
    const recent = recentPosts
      .filter(p => p.slug !== slug)
      .slice(0, 4)
      .map(p => JSON.parse(JSON.stringify(p)));

    // Ensure content fields are never null
    const safePost = {
      ...post,
      contentFr: post.contentFr || '',
      contentEn: post.contentEn || '',
      titleFr: post.titleFr || '',
      titleEn: post.titleEn || '',
      excerptFr: post.excerptFr || '',
      excerptEn: post.excerptEn || '',
      metaTitleFr: post.metaTitleFr || '',
      metaTitleEn: post.metaTitleEn || '',
      metaDescFr: post.metaDescFr || '',
      metaDescEn: post.metaDescEn || '',
      focusKeywordFr: post.focusKeywordFr || '',
      focusKeywordEn: post.focusKeywordEn || '',
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
