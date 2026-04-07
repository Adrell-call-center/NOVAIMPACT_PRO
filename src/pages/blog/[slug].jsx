import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import RootLayout from "@/components/common/layout/RootLayout";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";
import { STATIC_POSTS } from "@/data/blogPosts";
import animationWordCome from "@/lib/utils/animationWordCome";

function BlogPostDetail({ post, lang }) {
  const wordAnim = useRef();
  const wordAnim2 = useRef();

  useEffect(() => {
    animationWordCome(wordAnim.current);
    animationWordCome(wordAnim2.current);
  }, []);

  const title = lang === "fr" ? post.titleFr : post.titleEn;
  const content = lang === "fr" ? post.contentFr : post.contentEn;
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(
        lang === "fr" ? "fr-FR" : "en-US",
        { day: "2-digit", month: "long", year: "numeric" }
      )
    : "";

  return (
    <section className="blog__detail">
      <div className="container g-0 line pt-140">
        <span className="line-3"></span>
        <div className="row">
          <div className="col-xxl-8 col-xl-10 offset-xxl-2 offset-xl-1">
            <div className="blog__detail-top">
              <h2
                className="blog__detail-date animation__word_come"
                ref={wordAnim}
              >
                {post.category} <span>{date}</span>
              </h2>
              <h3
                className="blog__detail-title animation__word_come"
                ref={wordAnim2}
              >
                {title}
              </h3>
              <div className="blog__detail-metalist">
                <div className="blog__detail-meta">
                  <p>
                    {lang === "fr" ? "Publié par " : "Published by "}
                    <span>Nova Impact</span>
                  </p>
                </div>
                <div className="blog__detail-meta">
                  <p>
                    <Link
                      href={`/blog?lang=${lang}`}
                      style={{ color: "inherit" }}
                    >
                      ← {lang === "fr" ? "Retour au blog" : "Back to blog"}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {post.coverImage && (
            <div className="col-xxl-12">
              <div className="blog__detail-thumb">
                <Image
                  priority
                  width={1200}
                  height={600}
                  style={{ width: "100%", height: "auto" }}
                  src={post.coverImage}
                  alt={title}
                  data-speed="0.5"
                />
              </div>
            </div>
          )}

          <div className="col-xxl-8 col-xl-10 offset-xxl-2 offset-xl-1">
            <div
              className="blog__detail-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {post.tags?.length > 0 && (
              <div className="blog__detail-tags">
                <p className="sub-title-anim">
                  tags:{" "}
                  {post.tags.map((tag, i) => (
                    <span key={tag}>
                      <Link href={`/blog?lang=${lang}`}>{tag}</Link>
                      {i < post.tags.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              </div>
            )}

            {/* Language switcher */}
            <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
              <Link
                href={`/blog/${post.slug}?lang=en`}
                style={{
                  padding: "6px 16px",
                  border: "1px solid currentColor",
                  borderRadius: "4px",
                  fontWeight: lang === "en" ? "700" : "400",
                  opacity: lang === "en" ? 1 : 0.5,
                }}
              >
                EN
              </Link>
              <Link
                href={`/blog/${post.slug}?lang=fr`}
                style={{
                  padding: "6px 16px",
                  border: "1px solid currentColor",
                  borderRadius: "4px",
                  fontWeight: lang === "fr" ? "700" : "400",
                  opacity: lang === "fr" ? 1 : 0.5,
                }}
              >
                FR
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function BlogPost({ post }) {
  const router = useRouter();
  const lang = router.query.lang === "fr" ? "fr" : "en";

  if (router.isFallback) return <div>Loading...</div>;

  const metaTitle =
    lang === "fr"
      ? post.metaTitleFr || post.titleFr
      : post.metaTitleEn || post.titleEn;
  const metaDesc =
    lang === "fr"
      ? post.metaDescFr || post.excerptFr
      : post.metaDescEn || post.excerptEn;
  const siteUrl = "https://novaimpact.fr";
  const ogImage = post.coverImage
    ? `${siteUrl}${post.coverImage}`
    : `${siteUrl}/assets/imgs/logo/og-default.jpg`;

  const schema = {
    "@context": "https://schema.org",
    "@type": post.schemaType || "Article",
    headline: metaTitle,
    description: metaDesc,
    image: ogImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: "Nova Impact" },
    publisher: {
      "@type": "Organization",
      name: "Nova Impact",
      logo: { "@type": "ImageObject", url: `${siteUrl}/assets/imgs/logo/site-logo-white-2.png` },
    },
    inLanguage: lang === "fr" ? "fr-FR" : "en-US",
    url: `${siteUrl}/blog/${post.slug}?lang=${lang}`,
  };

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${siteUrl}/blog/${post.slug}?lang=${lang}`} />
        <link rel="alternate" hrefLang="fr" href={`${siteUrl}/blog/${post.slug}?lang=fr`} />
        <link rel="alternate" hrefLang="en" href={`${siteUrl}/blog/${post.slug}?lang=en`} />
        <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/blog/${post.slug}?lang=en`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`${siteUrl}/blog/${post.slug}?lang=${lang}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={ogImage} />
        {post.publishedAt && (
          <meta property="article:published_time" content={post.publishedAt} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <BlogPostDetail post={post} lang={lang} />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const paths = STATIC_POSTS.map((post) => ({
    params: { slug: post.slug },
  }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const post = STATIC_POSTS.find((p) => p.slug === params.slug);
  if (!post) return { notFound: true };
  return {
    props: { post },
    revalidate: 60,
  };
}
