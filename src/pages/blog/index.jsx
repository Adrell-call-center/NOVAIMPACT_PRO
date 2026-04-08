import Head from 'next/head';
import RootLayout from '@/components/common/layout/RootLayout';
import BlogIndex from '@/components/blog/BlogIndex';

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

export async function getStaticProps() {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const where = { status: 'PUBLISHED' };
    const [posts, total, categories] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        take: 9,
        select: {
          id: true, slug: true, titleFr: true, titleEn: true,
          excerptFr: true, excerptEn: true, coverImage: true,
          category: true, tags: true, publishedAt: true,
        },
      }),
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        select: { category: true },
        distinct: ['category'],
      }),
    ]);

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
        categories: categories.map(c => c.category).filter(Boolean),
        pagination: { page: 1, limit: 9, total, pages: Math.ceil(total / 9) },
      },
      revalidate: 60,
    };
  } finally {
    await prisma.$disconnect();
  }
}
