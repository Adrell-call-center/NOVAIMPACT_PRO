import RootLayout from '@/components/common/layout/RootLayout';
import BlogPost from '@/components/blog/BlogPost';

export default function BlogSlugLang({ post, related, lang }) {
  return (
    <RootLayout header="header3" footer="footer3">
      <BlogPost post={post} related={related} forceLang={lang} />
    </RootLayout>
  );
}

export async function getStaticPaths() {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    });
    const paths = posts.flatMap(p => [
      { params: { lang: 'fr', slug: p.slug } },
      { params: { lang: 'en', slug: p.slug } },
    ]);
    return { paths, fallback: 'blocking' };
  } finally {
    await prisma.$disconnect();
  }
}

export async function getStaticProps({ params }) {
  const { lang, slug } = params;
  if (!['fr', 'en'].includes(lang)) return { notFound: true };

  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) return { notFound: true };

    const related = await prisma.post.findMany({
      where: { status: 'PUBLISHED', slug: { not: slug }, category: post.category },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, titleFr: true, titleEn: true, coverImage: true },
    });

    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
        related: JSON.parse(JSON.stringify(related)),
        lang,
      },
      revalidate: 60,
    };
  } finally {
    await prisma.$disconnect();
  }
}
