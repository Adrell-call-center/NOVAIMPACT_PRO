import PageSeo from "@/components/seo/PageSeo";
import { buildSchema } from "@/lib/schema-builder";
import { absoluteUrl } from "@/lib/site";

export default function BlogSeo({ post, lang = "fr" }) {
  if (!post || !post.slug) {
    return (
      <PageSeo
        title="Nova Impact Blog"
        description="Nova Impact - Digital Agency"
        canonical={absoluteUrl("/blog")}
      />
    );
  }

  const isFr = lang === "fr";
  const title = isFr
    ? post.metaTitleFr || post.titleFr || "Nova Impact"
    : post.metaTitleEn || post.titleEn || "Nova Impact";
  const desc = isFr
    ? post.metaDescFr || post.excerptFr || "Nova Impact Blog"
    : post.metaDescEn || post.excerptEn || "Nova Impact Blog";
  const fullTitle = `${title} — Nova Impact`;
  const ogImage = absoluteUrl(
    post.ogImageUrl ||
      post.coverImage ||
      "/assets/imgs/logo/footer-logo-white.png"
  );
  const slug = post.slug;
  const canonical = post.canonicalUrl || absoluteUrl(`/blog/${slug}`);

  return (
    <PageSeo
      title={fullTitle}
      description={desc}
      canonical={canonical}
      ogImage={ogImage}
      ogType="article"
      robots={post.noIndex === true ? "noindex, nofollow" : "index, follow"}
      schema={buildSchema(post, lang)}
      hrefLangAlternates={[
        { hrefLang: "fr", href: absoluteUrl(`/blog/${slug}?lang=fr`) },
        { hrefLang: "en", href: absoluteUrl(`/blog/${slug}?lang=en`) },
      ]}
    />
  );
}
