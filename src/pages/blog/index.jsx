import Head from 'next/head';
import RootLayout from '@/components/common/layout/RootLayout';
import BlogIndex from '@/components/blog/BlogIndex';
import { blogStore } from '@/lib/blog-store';

const SITE_URL = "https://novaimpact.io";

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${SITE_URL}/blog#webpage`,
  "url": `${SITE_URL}/blog`,
  "name": "Blog — Nova Impact",
  "description": "Latest insights on digital marketing, SEO, branding, and web development from Nova Impact.",
  "publisher": { "@id": `${SITE_URL}/#organization` },
  "inLanguage": ["en", "fr"],
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog` }
    ]
  }
};

export default function Blog({ posts, categories, pagination }) {
  const title = "Blog — Nova Impact | Digital Marketing Insights";
  const description = "Latest insights on digital marketing, SEO, Meta Ads, Google Ads, branding, and web development from the Nova Impact team.";
  const ogImage = `${SITE_URL}/assets/imgs/logo/footer-logo-white.png`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="Nova Impact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      </Head>
      <RootLayout header="header3" footer="footer3">
        <BlogIndex initialPosts={posts} initialCategories={categories} pagination={pagination} />
      </RootLayout>
    </>
  );
}

export async function getServerSideProps(context) {
  const { page = 1, category } = context.query;
  const pageNum = parseInt(page) || 1;
  const limit = 9;
  const offset = (pageNum - 1) * limit;

  try {
    const { posts, total } = await blogStore.getPosts({ category, limit, offset });
    const categories = await blogStore.getCategories();

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
        categories,
        pagination: { page: pageNum, limit, total, pages: Math.ceil(total / limit) },
      },
    };
  } catch (error) {
    console.error('Blog index error:', error);
    return {
      props: {
        posts: [],
        categories: [],
        pagination: { page: 1, limit, total: 0, pages: 0 },
      },
    };
  }
}
