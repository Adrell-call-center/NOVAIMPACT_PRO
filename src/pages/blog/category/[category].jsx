import Head from 'next/head';
import RootLayout from '@/components/common/layout/RootLayout';
import BlogIndex from '@/components/blog/BlogIndex';

export default function BlogCategory({ posts, categories, category, pagination }) {
  return (
    <>
      <Head>
        <title>{category} — Blog — Nova Impact</title>
        <meta name="description" content={`Articles about ${category} from Nova Impact.`} />
      </Head>
      <RootLayout header="header3" footer="footer3">
        <BlogIndex initialPosts={posts} initialCategories={categories} pagination={pagination} />
      </RootLayout>
    </>
  );
}

export async function getStaticPaths() {
  // Return empty paths - all category pages will be generated on-demand at runtime
  // This avoids database queries during Docker build
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const where = { status: 'PUBLISHED', category: params.category };
    const [posts, total, allCategories] = await Promise.all([
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
        where: { status: 'PUBLISHED' },
        select: { category: true },
        distinct: ['category'],
      }),
    ]);

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
        categories: allCategories.map(c => c.category).filter(Boolean),
        category: params.category,
        pagination: { page: 1, limit: 9, total, pages: Math.ceil(total / 9) },
      },
      revalidate: 60,
    };
  } finally {
    await prisma.$disconnect();
  }
}
