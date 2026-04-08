import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import BlogSeo from '@/components/blog/BlogSeo';

export default function BlogPost({ post, related, forceLang }) {
  const router = useRouter();
  const lang = forceLang || router.query.lang || 'fr';
  const isFr = lang === 'fr';
  const [activeLang, setActiveLang] = useState(lang);

  useEffect(() => { setActiveLang(lang); }, [lang]);

  const switchLang = (newLang) => {
    router.push(`/blog/${newLang}/${post.slug}`);
  };

  if (!post) return <div className="container py-5"><h2>Post not found</h2></div>;

  const title   = activeLang === 'fr' ? post.titleFr   : post.titleEn;
  const content = activeLang === 'fr' ? post.contentFr : post.contentEn;

  return (
    <>
      <BlogSeo post={post} lang={activeLang} />
      <section className="blog-details pt-130 pb-130">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">

              {/* Nav */}
              <div className="mb-3 d-flex align-items-center gap-3">
                <Link href="/blog" className="text-muted">← Back to Blog</Link>
                <span className="text-muted">|</span>
                <button
                  className={`btn btn-sm ${activeLang === 'fr' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => switchLang('fr')}
                >FR</button>
                <button
                  className={`btn btn-sm ${activeLang === 'en' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => switchLang('en')}
                >EN</button>
              </div>

              {/* Cover image */}
              {post.coverImage && (
                <div className="mb-4">
                  <Image
                    priority
                    width={1200}
                    height={600}
                    style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                    src={post.coverImage}
                    alt={title}
                  />
                </div>
              )}

              {/* Category + title */}
              {post.category && (
                <span className="badge bg-primary mb-2">{post.category}</span>
              )}
              <h1 className="mb-3">{title}</h1>

              {/* Date + tags */}
              <div className="text-muted mb-4 d-flex flex-wrap align-items-center gap-2">
                {post.publishedAt && (
                  <span>{new Date(post.publishedAt).toLocaleDateString(activeLang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                )}
                {post.tags?.map(t => (
                  <span key={t} className="badge bg-light text-dark">{t}</span>
                ))}
              </div>

              {/* HTML content from dashboard */}
              <div
                className="blog-content"
                style={{ lineHeight: 1.8, fontSize: 18 }}
                dangerouslySetInnerHTML={{ __html: content || '' }}
              />

              {/* Related posts */}
              {related?.length > 0 && (
                <div className="mt-5 pt-5 border-top">
                  <h4 className="mb-4">Related Articles</h4>
                  <div className="row g-4">
                    {related.map(r => (
                      <div className="col-md-4" key={r.slug}>
                        <Link href={`/blog/${activeLang}/${r.slug}`} className="text-decoration-none">
                          {r.coverImage && (
                            <Image
                              width={400}
                              height={200}
                              style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                              src={r.coverImage}
                              alt={activeLang === 'fr' ? r.titleFr : r.titleEn}
                            />
                          )}
                          <h6 className="mt-2 text-dark">
                            {activeLang === 'fr' ? r.titleFr : r.titleEn}
                          </h6>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
