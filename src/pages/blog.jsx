import Head from "next/head";
import { useRouter } from "next/router";
import RootLayout from "@/components/common/layout/RootLayout";
import Blog1 from "@/components/blog/Blog1";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";

// Static seed posts — will be replaced by Prisma DB query once backend is set up
const STATIC_POSTS = [
  {
    id: "1",
    slug: "comment-optimiser-votre-seo-en-2026",
    titleFr: "Comment optimiser votre SEO en 2026",
    titleEn: "How to optimize your SEO in 2026",
    excerptFr: "Découvrez les meilleures pratiques SEO pour dominer les résultats de recherche en 2026.",
    excerptEn: "Discover the best SEO practices to dominate search results in 2026.",
    coverImage: "/assets/imgs/blog/1.jpg",
    category: "SEO",
    tags: ["SEO", "Marketing"],
    publishedAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "2",
    slug: "strategies-publicite-meta-ads",
    titleFr: "Les meilleures stratégies pour vos campagnes Meta Ads",
    titleEn: "The best strategies for your Meta Ads campaigns",
    excerptFr: "Comment créer des campagnes Meta Ads performantes qui convertissent réellement.",
    excerptEn: "How to create high-performing Meta Ads campaigns that actually convert.",
    coverImage: "/assets/imgs/blog/2.jpg",
    category: "Publicité",
    tags: ["Meta Ads", "Facebook"],
    publishedAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "3",
    slug: "importance-identite-visuelle-marque",
    titleFr: "L'importance d'une identité visuelle forte pour votre marque",
    titleEn: "The importance of a strong visual identity for your brand",
    excerptFr: "Une identité visuelle cohérente renforce la confiance et la reconnaissance de votre marque.",
    excerptEn: "A consistent visual identity builds trust and recognition for your brand.",
    coverImage: "/assets/imgs/blog/3.jpg",
    category: "Branding",
    tags: ["Branding", "Design"],
    publishedAt: "2026-02-20T00:00:00.000Z",
  },
  {
    id: "4",
    slug: "guide-google-ads-debutants",
    titleFr: "Guide Google Ads pour débutants : lancer sa première campagne",
    titleEn: "Google Ads guide for beginners: launching your first campaign",
    excerptFr: "Tout ce que vous devez savoir pour lancer votre première campagne Google Ads avec succès.",
    excerptEn: "Everything you need to know to successfully launch your first Google Ads campaign.",
    coverImage: "/assets/imgs/blog/4.jpg",
    category: "Publicité",
    tags: ["Google Ads", "PPC"],
    publishedAt: "2026-03-05T00:00:00.000Z",
  },
  {
    id: "5",
    slug: "audit-seo-complet-site-web",
    titleFr: "Comment réaliser un audit SEO complet de votre site web",
    titleEn: "How to conduct a complete SEO audit of your website",
    excerptFr: "Guide méthodique pour auditer votre site web et identifier toutes les opportunités SEO.",
    excerptEn: "Methodical guide to auditing your website and identifying all SEO opportunities.",
    coverImage: "/assets/imgs/blog/5.jpg",
    category: "SEO",
    tags: ["SEO", "Audit"],
    publishedAt: "2026-03-20T00:00:00.000Z",
  },
  {
    id: "6",
    slug: "creation-contenu-reseaux-sociaux",
    titleFr: "Créer du contenu qui engage sur les réseaux sociaux",
    titleEn: "Creating content that engages on social media",
    excerptFr: "Les secrets pour créer du contenu viral et engageant sur Instagram, LinkedIn et TikTok.",
    excerptEn: "The secrets to creating viral and engaging content on Instagram, LinkedIn and TikTok.",
    coverImage: "/assets/imgs/blog/6.jpg",
    category: "Social Media",
    tags: ["Social Media", "Content"],
    publishedAt: "2026-04-01T00:00:00.000Z",
  },
];

export default function Blog({ posts, lang }) {
  return (
    <>
      <Head>
        <title>Blog — Nova Impact</title>
        <meta
          name="description"
          content={
            lang === "fr"
              ? "Découvrez nos articles sur le marketing digital, le SEO et la création de contenu."
              : "Discover our articles on digital marketing, SEO and content creation."
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              name: "Nova Impact Blog",
              url: "https://novaimpact.fr/blog",
            }),
          }}
        />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <Blog1 posts={posts} lang={lang} />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </>
  );
}

export async function getStaticProps() {
  // TODO: replace STATIC_POSTS with Prisma query once DB is set up (Task 3 of the plan)
  // const posts = await prisma.post.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } })
  return {
    props: {
      posts: STATIC_POSTS,
      lang: "fr",
    },
    revalidate: 60,
  };
}
