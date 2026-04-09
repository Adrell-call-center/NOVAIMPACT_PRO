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
      <article className="single-post-page">
        {/* Hero Section */}
        <div className="post-hero">
          <div className="container">
            <div className="post-hero-content">
              {/* Breadcrumb */}
              <nav className="post-breadcrumb">
                <Link href="/" className="breadcrumb-link">Home</Link>
                <span className="breadcrumb-sep">/</span>
                <Link href="/blog" className="breadcrumb-link">Blog</Link>
                {post.category && (
                  <>
                    <span className="breadcrumb-sep">/</span>
                    <span className="breadcrumb-current">{post.category}</span>
                  </>
                )}
              </nav>

              {/* Language Switcher */}
              <div className="post-lang-switcher">
                <button
                  className={`lang-btn ${activeLang === 'fr' ? 'active' : ''}`}
                  onClick={() => switchLang('fr')}
                >FR</button>
                <button
                  className={`lang-btn ${activeLang === 'en' ? 'active' : ''}`}
                  onClick={() => switchLang('en')}
                >EN</button>
              </div>

              {/* Category Badge */}
              {post.category && (
                <span className="post-category">{post.category}</span>
              )}

              {/* Title */}
              <h1 className="post-title">{title}</h1>

              {/* Meta Info */}
              <div className="post-meta">
                {post.publishedAt && (
                  <span className="post-date">
                    <i className="fa-regular fa-calendar"></i>
                    {new Date(post.publishedAt).toLocaleDateString(activeLang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                )}
                {post.tags?.map(t => (
                  <span key={t} className="post-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="post-cover-wrapper">
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
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              src={post.coverImage}
              alt={title}
            />
          </div>
        )}

        {/* Content Section */}
        <div className="post-content-wrapper">
          <div className="container">
            <div className="post-layout">
              {/* Main Content */}
              <div className="post-main">
                <div
                  className="blog__content"
                  dangerouslySetInnerHTML={{ __html: content || '' }}
                />
              </div>

              {/* Sidebar */}
              <aside className="post-sidebar">
                {/* Author Card */}
                <div className="sidebar-card author-card">
                  <div className="author-avatar">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <h4 className="author-name">Nova Impact</h4>
                  <p className="author-bio">Digital excellence agency transforming brands through strategy, technology, and creative performance.</p>
                </div>

                {/* Share Card */}
                <div className="sidebar-card share-card">
                  <h4 className="share-title">Share this article</h4>
                  <div className="share-buttons">
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noopener noreferrer" className="share-btn linkedin">
                      <i className="fa-brands fa-linkedin"></i>
                    </a>
                    <a href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? window.location.href : ''}&text=${title}`} target="_blank" rel="noopener noreferrer" className="share-btn twitter">
                      <i className="fa-brands fa-x-twitter"></i>
                    </a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noopener noreferrer" className="share-btn facebook">
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* Related Posts Section */}
        {related?.length > 0 && (
          <div className="related-posts-section">
            <div className="container">
              <h2 className="related-posts-heading">Related Articles</h2>
              <div className="related-posts-grid">
                {related.map(r => (
                  <Link href={`/blog/${activeLang}/${r.slug}`} key={r.slug} className="related-post-card">
                    {r.coverImage && (
                      <div className="related-post-thumb">
                        <Image
                          width={400}
                          height={225}
                          quality={90}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          src={r.coverImage}
                          alt={activeLang === 'fr' ? r.titleFr : r.titleEn}
                        />
                      </div>
                    )}
                    <div className="related-post-content">
                      {r.category && <span className="related-post-cat">{r.category}</span>}
                      <h3 className="related-post-title">
                        {activeLang === 'fr' ? r.titleFr : r.titleEn}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="post-cta">
          <div className="container">
            <div className="post-cta-content">
              <h2 className="post-cta-title">Have a project in mind?</h2>
              <p className="post-cta-desc">Let's discuss how we can help transform your digital presence and achieve your goals.</p>
              <Link href="/contact" className="post-cta-btn">Contact Us <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
