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
    router.push(`/blog/${post.slug}?lang=${newLang}`);
  };

  if (!post) return <div className="container py-5"><h2>Post not found</h2></div>;

  const title   = activeLang === 'fr' ? post.titleFr   : post.titleEn;
  const content = activeLang === 'fr' ? post.contentFr : post.contentEn;

  return (
    <>
      <BlogSeo post={post} lang={activeLang} />
      <section className="blog__detail pt-130 pb-130">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">

              {/* Cover image */}
              {post.coverImage && (
                <div className="mb-4 blog-cover-wrapper">
                  <Image
                    priority
                    quality={100}
                    width={1200}
                    height={675}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                    placeholder="empty"
                    loading="eager"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 12,
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    src={post.coverImage}
                    alt={title}
                  />
                </div>
              )}

              {/* Category + title */}
              {post.category && (
                <span className="badge bg-primary mb-2">{post.category}</span>
              )}
              <h1 className="mb-3 blog__detail-title">{title}</h1>

              {/* Date + tags */}
              <div className="blog__detail-date mb-4 d-flex flex-wrap align-items-center gap-2">
                {post.publishedAt && (
                  <span>{new Date(post.publishedAt).toLocaleDateString(activeLang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                )}
                {post.tags?.map(t => (
                  <span key={t} className="badge blog__detail-tag">{t}</span>
                ))}
              </div>

              {/* HTML content from dashboard */}
              <div
                className="blog__content"
                dangerouslySetInnerHTML={{ __html: content || '' }}
              />

              {/* Related posts */}
              {related?.length > 0 && (
                <div className="mt-5 pt-5 border-top">
                  <h4 className="mb-4 blog__detail-title">Related Articles</h4>
                  <div className="row g-4">
                    {related.map(r => (
                      <div className="col-md-4" key={r.slug}>
                        <Link href={`/blog/${r.slug}?lang=${activeLang}`} className="text-decoration-none">
                          {r.coverImage && (
                            <Image
                              width={400}
                              height={225}
                              quality={90}
                              style={{ 
                                width: '100%', 
                                height: 'auto', 
                                borderRadius: 8,
                                objectFit: 'cover'
                              }}
                              src={r.coverImage}
                              alt={activeLang === 'fr' ? r.titleFr : r.titleEn}
                            />
                          )}
                          <h6 className="mt-2 blog__detail-title">
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
