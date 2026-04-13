import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import BlogSeo from '@/components/blog/BlogSeo';
import { gsap } from 'gsap';
import { ScrollSmoother } from '@/plugins';

gsap.registerPlugin(ScrollSmoother);

function readingTime(html) {
  if (!html || typeof html !== 'string') return 1;
  const text = html.replace(/<[^>]+>/g, '');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function getContent(post, lang) {
  if (!post) return { title: '', content: '' };
  if (lang === 'fr') {
    return {
      title: post.titleFr || post.title || 'Untitled',
      content: post.contentFr || post.content || '',
    };
  }
  return {
    title: post.titleEn || post.title || 'Untitled',
    content: post.contentEn || post.content || '',
  };
}

function getScrollY() {
  const smoother = ScrollSmoother.get();
  if (!smoother) return window.scrollY;
  if (typeof smoother.scrollTop === 'function') return smoother.scrollTop();
  if (typeof smoother.scrollTop === 'number') return smoother.scrollTop;
  if (typeof smoother.scroll === 'function') return smoother.scroll();
  return window.scrollY;
}

export default function BlogPost({ post, related, recent, initialLang }) {
  const router = useRouter();
  const [activeLang, setActiveLang] = useState(initialLang || 'fr');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState('');

  const articleRef = useRef(null);
  const wrapperRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => { setPageUrl(window.location.href); }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('nova-lang')) {
      setActiveLang(localStorage.getItem('nova-lang'));
    }
  }, []);

  const isFr = activeLang === 'fr';
  const { title, content } = getContent(post, activeLang);
  const minRead = readingTime(content);

  useEffect(() => {
    const tick = () => {
      const article = articleRef.current;
      if (!article) return;
      const scrollY  = getScrollY();
      const rect     = article.getBoundingClientRect();
      const absTop   = scrollY + rect.top;
      const height   = article.offsetHeight;
      const winH     = window.innerHeight;
      const progress = Math.min(100, Math.max(0, ((scrollY - absTop) / (height - winH)) * 100));
      setScrollProgress(progress);
      setShowBackTop(scrollY > 500);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const wrapper = wrapperRef.current;
    if (!sidebar || !wrapper) return;

    const TOP_OFFSET = 110;

    const tick = () => {
      if (window.innerWidth <= 1024) {
        sidebar.style.transform = '';
        return;
      }
      const scrollY    = getScrollY();
      const wrapRect   = wrapper.getBoundingClientRect();
      const wrapAbsTop = scrollY + wrapRect.top;
      const wrapHeight = wrapper.offsetHeight;
      const sidebarH   = sidebar.offsetHeight;

      const maxT      = Math.max(0, wrapHeight - sidebarH - TOP_OFFSET);
      const translate  = Math.min(maxT, Math.max(0, scrollY - wrapAbsTop + TOP_OFFSET));

      sidebar.style.transform = `translateY(${translate}px)`;
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  if (!post) {
    return <div className="container py-5" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h2>Post not found</h2></div>;
  }

  return (
    <>
      <BlogSeo post={post} lang={activeLang} />

      <div className="post-progress-bar" style={{ width: `${scrollProgress}%` }} />

      <div className="post-hero">
        <div className="container">
          <div className="post-hero-content">
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

            {post.category && (
              <span className="post-category">{post.category}</span>
            )}

            <h1 className="post-title">{title}</h1>

            <div className="post-meta">
              {post.publishedAt && (
                <span className="post-date">
                  <i className="fa-regular fa-calendar"></i>
                  {new Date(post.publishedAt).toLocaleDateString(
                    isFr ? 'fr-FR' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </span>
              )}
              <span className="post-read-time">
                <i className="fa-regular fa-clock"></i>
                {minRead} min read
              </span>
              {post.tags && post.tags.slice(0, 3).map(t => (
                <span key={t} className="post-tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="post-content-wrapper" ref={wrapperRef}>
        <div className="container">
          <div className="post-layout">

            <article className="post-main" ref={articleRef}>
              {post.coverImage && (
                <div className="post-cover-inline">
                  <Image
                    priority
                    quality={100}
                    width={1200}
                    height={630}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 65vw, 800px"
                    placeholder="empty"
                    loading="eager"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    src={post.coverImage}
                    alt={title || ''}
                  />
                </div>
              )}

              <div
                className="blog__content drop-cap"
                dangerouslySetInnerHTML={{ __html: content || '' }}
              />

              <div className="post-article-footer">
                {post.tags && post.tags.length > 0 && (
                  <div className="post-footer-tags">
                    <span className="post-footer-tags-label">
                      <i className="fa-solid fa-tags"></i> Tags
                    </span>
                    {post.tags.map(t => (
                      <span key={t} className="post-footer-tag">{t}</span>
                    ))}
                  </div>
                )}
                <div className="post-footer-share">
                  <span className="post-footer-share-label">Share</span>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                    target="_blank" rel="noopener noreferrer"
                    className="post-footer-share-btn linkedin"
                  >
                    <span className="social-glyph" aria-hidden="true">in</span>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}&text=${encodeURIComponent(title || '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="post-footer-share-btn twitter"
                  >
                    <span className="social-glyph" aria-hidden="true">X</span>
                  </a>
                  <button className="post-footer-share-btn copy" onClick={copyLink} title="Copy link">
                    <i className={`fa-solid ${copied ? 'fa-check' : 'fa-link'}`}></i>
                  </button>
                </div>
              </div>
            </article>

            <div className="post-sidebar-col">
              <div className="post-sidebar" ref={sidebarRef}>

                <div className="sidebar-card sidebar-cta-card">
                  <h4 className="sidebar-cta-title">Need help growing your brand?</h4>
                  <p className="sidebar-cta-text">
                    Get a free strategy call with our team and discover the fastest way to scale your digital presence.
                  </p>
                  <Link href="/contact" className="sidebar-cta-btn">
                    Book a Free Call <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                  </Link>
                </div>

                <div className="sidebar-card share-card">
                  <h4 className="share-title">Share this article</h4>
                  <div className="share-buttons">
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" className="share-btn linkedin">
                      <span className="social-glyph" aria-hidden="true">in</span>
                    </a>
                    <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title || '')}`} target="_blank" rel="noopener noreferrer" className="share-btn twitter">
                      <span className="social-glyph" aria-hidden="true">X</span>
                    </a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" className="share-btn facebook">
                      <span className="social-glyph" aria-hidden="true">f</span>
                    </a>
                  </div>
                </div>

                {recent && recent.length > 0 && (
                  <div className="sidebar-card recent-posts-card">
                    <h4 className="recent-posts-title">Latest Articles</h4>
                    <div className="recent-posts-list">
                      {recent.map(r => (
                        <Link href={`/blog/${r.slug}`} key={r.slug} className="recent-post-item">
                          {r.coverImage && (
                            <div className="recent-post-thumb">
                              <Image
                                src={r.coverImage}
                                alt={isFr ? (r.titleFr || '') : (r.titleEn || '')}
                                width={80}
                                height={60}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }}
                              />
                            </div>
                          )}
                          <div className="recent-post-info">
                            {r.publishedAt && (
                              <span className="recent-post-date">
                                {new Date(r.publishedAt).toLocaleDateString(
                                  isFr ? 'fr-FR' : 'en-US',
                                  { year: 'numeric', month: 'short', day: 'numeric' }
                                )}
                              </span>
                            )}
                            <p className="recent-post-title-text">
                              {isFr ? (r.titleFr || '') : (r.titleEn || '')}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>

      {related && related.length > 0 && (
        <div className="related-posts-section">
          <div className="container">
            <h2 className="related-posts-heading">Related Articles</h2>
            <div className="related-posts-grid">
              {related.map(r => (
                <Link href={`/blog/${r.slug}`} key={r.slug} className="related-post-card">
                  {r.coverImage && (
                    <div className="related-post-thumb">
                      <Image
                        width={400}
                        height={225}
                        quality={90}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        src={r.coverImage}
                        alt={isFr ? (r.titleFr || '') : (r.titleEn || '')}
                      />
                    </div>
                  )}
                  <div className="related-post-content">
                    {r.category && <span className="related-post-cat">{r.category}</span>}
                    <h3 className="related-post-title">
                      {isFr ? (r.titleFr || '') : (r.titleEn || '')}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="post-cta">
        <div className="container">
          <div className="post-cta-content">
            <h2 className="post-cta-title">Have a project in mind?</h2>
            <p className="post-cta-desc">Let&apos;s discuss how we can help transform your digital presence and achieve your goals.</p>
            <Link href="/contact" className="post-cta-btn">
              Contact Us <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>

      {showBackTop && (
        <button
          className="back-to-top"
          onClick={() => {
            const smoother = ScrollSmoother.get();
            if (smoother) smoother.scrollTo(0, true);
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="Back to top"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      )}
    </>
  );
}
