import Head from "next/head";
import { useRouter } from "next/router";
import RootLayout from "@/components/common/layout/RootLayout";
import Blog1 from "@/components/blog/Blog1";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";
import { STATIC_POSTS } from "@/data/blogPosts";

export default function Blog({ posts }) {
  const router = useRouter();
  const lang = router.query.lang === "fr" ? "fr" : "en";

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
        <link rel="alternate" hrefLang="fr" href="/blog?lang=fr" />
        <link rel="alternate" hrefLang="en" href="/blog?lang=en" />
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
  // TODO: replace with Prisma query once DB is set up (Task 3 of the plan)
  return {
    props: { posts: STATIC_POSTS },
    revalidate: 60,
  };
}
