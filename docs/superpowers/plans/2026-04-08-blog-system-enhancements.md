# Blog System Enhancements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fill the five missing layers of the blog system: data layer, HTML renderer, prose CSS, full single-post view with sidebar, and rich JSON-LD @graph schema.

**Architecture:** All database access moves to `src/lib/blog-store.js`. Quill HTML is processed by `QuillContent.jsx` before rendering (inline styles, responsive embeds, PDF cards). The single-post page gains a two-column layout with sticky sidebar. Schema.org output becomes a full `@graph` array (Organization + WebSite + WebPage + BreadcrumbList + BlogPosting + supplemental).

**Tech Stack:** Next.js 13 (Pages Router), React 18, Prisma 6 + PostgreSQL, React-Quill (existing), Bootstrap 5, JavaScript (no TypeScript).

---

## File Map

| Status | File | Responsibility |
|--------|------|----------------|
| **Create** | `src/lib/blog-store.js` | All blog DB queries — single place to call Prisma |
| **Create** | `src/components/blog/QuillContent.jsx` | Process Quill HTML → safe, styled HTML |
| **Create** | `src/styles/blog.css` | Prose styles for rendered Quill output |
| **Modify** | `src/components/blog/BlogPost.jsx` | Add two-column layout, sidebar widgets, use QuillContent |
| **Modify** | `src/lib/schema-builder.js` | Full `@graph` JSON-LD array with all nodes |
| **Modify** | `src/pages/blog/[lang]/[slug].jsx` | Use blog-store, pass reading time + recent posts |
| **Modify** | `src/pages/blog/index.jsx` | Use blog-store for SSR data |

---

## Task 1: blog-store.js — Data Layer

**Files:**
- Create: `src/lib/blog-store.js`

This module wraps every Prisma query the blog needs. Pages import from here instead of calling Prisma directly.

- [ ] **Step 1: Create the file**

```js
// src/lib/blog-store.js
import prisma from '@/lib/prisma';

// ── Public queries ────────────────────────────────────────────────

export async function getPublishedPostBySlug(slug) {
  return prisma.post.findFirst({
    where: { slug, status: 'PUBLISHED' },
  });
}

export async function listPublishedPosts({ page = 1, limit = 9, category = '' } = {}) {
  const skip = (page - 1) * limit;
  const where = { status: 'PUBLISHED', noIndex: false };
  if (category) where.category = category;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true, slug: true, titleFr: true, titleEn: true,
        excerptFr: true, excerptEn: true, coverImage: true,
        category: true, tags: true, publishedAt: true,
      },
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, pages: Math.ceil(total / limit), page, limit };
}

export async function listRecentPublishedPosts(count = 4, excludeId = null) {
  const where = { status: 'PUBLISHED', noIndex: false };
  if (excludeId) where.id = { not: excludeId };

  return prisma.post.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    take: count,
    select: {
      id: true, slug: true, titleFr: true, titleEn: true,
      coverImage: true, publishedAt: true, category: true,
    },
  });
}

export async function listRelatedPosts(postId, category, count = 3) {
  const where = {
    status: 'PUBLISHED',
    id: { not: postId },
  };
  if (category) where.category = category;

  return prisma.post.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    take: count,
    select: {
      id: true, slug: true, titleFr: true, titleEn: true,
      coverImage: true, publishedAt: true,
    },
  });
}

export async function listPublishedCategories() {
  const result = await prisma.post.findMany({
    where: { status: 'PUBLISHED', category: { not: '' } },
    select: { category: true },
    distinct: ['category'],
  });
  return result.map((r) => r.category).filter(Boolean);
}

// ── Admin queries ─────────────────────────────────────────────────

export async function getPostById(id) {
  return prisma.post.findUnique({ where: { id } });
}

export async function listAllPosts({ page = 1, limit = 20, search = '' } = {}) {
  const skip = (page - 1) * limit;
  const where = {};
  if (search) {
    where.OR = [
      { titleFr: { contains: search, mode: 'insensitive' } },
      { titleEn: { contains: search, mode: 'insensitive' } },
    ];
  }
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true, slug: true, titleFr: true, titleEn: true,
        status: true, category: true, publishedAt: true,
        createdAt: true, updatedAt: true, coverImage: true, noIndex: true,
      },
    }),
    prisma.post.count({ where }),
  ]);
  return { posts, total, pages: Math.ceil(total / limit) };
}
```

- [ ] **Step 2: Verify the module loads**

Run: `node -e "const s = require('./src/lib/blog-store.js'); console.log(Object.keys(s))"`

Expected output (from project root, without DB): module resolves without syntax errors. If `Cannot find module '@/lib/prisma'` is the error, it means jsconfig alias isn't resolved in Node — that's fine, the file will work in Next.js context. Just confirm no syntax error.

- [ ] **Step 3: Commit**

```bash
git add src/lib/blog-store.js
git commit -m "feat: add blog-store.js data layer for all blog queries"
```

---

## Task 2: QuillContent.jsx — HTML Processor

**Files:**
- Create: `src/components/blog/QuillContent.jsx`

Processes Quill-saved HTML before rendering: extracts PDF/video embeds, strips Quill class noise, applies inline styles so the output looks correct in any context (RSS, email, etc.) without external CSS dependency.

- [ ] **Step 1: Create the file**

```jsx
// src/components/blog/QuillContent.jsx
import { useMemo } from 'react';

// ── Utilities ─────────────────────────────────────────────────────

/** Convert camelCase style object to inline style string */
function cssToStyle(obj) {
  return Object.entries(obj)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`)
    .join(';');
}

/** Convert a stored URL (may have domain prefix) to a root-relative path */
function toRelativeUrl(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (u.hostname === window.location.hostname) return u.pathname + u.search;
  } catch (_) { /* not a full URL */ }
  return url;
}

// ── Style definitions ─────────────────────────────────────────────

const STYLES = {
  h1: cssToStyle({ fontSize: '2rem', fontWeight: '700', lineHeight: '1.25', margin: '2rem 0 1rem', color: '#111' }),
  h2: cssToStyle({ fontSize: '1.6rem', fontWeight: '700', lineHeight: '1.3', margin: '1.75rem 0 0.875rem', color: '#111' }),
  h3: cssToStyle({ fontSize: '1.3rem', fontWeight: '600', lineHeight: '1.4', margin: '1.5rem 0 0.75rem', color: '#111' }),
  blockquote: cssToStyle({ borderLeft: '4px solid #FFC81A', paddingLeft: '1rem', margin: '1.5rem 0', color: '#555', fontStyle: 'italic' }),
  pre: cssToStyle({ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem 1.25rem', borderRadius: '6px', overflowX: 'auto', margin: '1.5rem 0', fontSize: '0.875rem', lineHeight: '1.6' }),
  code: cssToStyle({ background: '#f3f4f6', color: '#c0392b', padding: '0.15em 0.4em', borderRadius: '3px', fontSize: '0.875em', fontFamily: 'monospace' }),
  a: cssToStyle({ color: '#FFC81A', textDecoration: 'underline' }),
  img: cssToStyle({ maxWidth: '100%', height: 'auto', borderRadius: '6px', margin: '1rem 0', display: 'block' }),
};

const TABLE_STYLE = `
<style>
.bltw { overflow-x: auto; margin: 1.5rem 0; }
.bltw table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
.bltw table tr:first-child td,
.bltw table th { background: #FFC81A !important; color: #000 !important; font-weight: 700; padding: 10px 14px; border: 1px solid #ccc; text-align: left; }
.bltw table td { padding: 9px 14px; border: 1px solid #ddd; }
.bltw table tr:nth-child(even) td { background: #fafafa; }
</style>
`;

// ── Extractor helpers ─────────────────────────────────────────────

/** Extract all <div> blocks that start with openTagPattern, replace with tokens */
function extractDivBlocks(html, openTagPattern) {
  const blocks = [];
  let result = html;
  let match;
  const re = new RegExp(openTagPattern, 'gi');
  while ((match = re.exec(result)) !== null) {
    const start = match.index;
    let depth = 1;
    let pos = start + match[0].length;
    while (pos < result.length && depth > 0) {
      if (result[pos] === '<') {
        if (result.slice(pos, pos + 4).toLowerCase() === '<div') depth++;
        else if (result.slice(pos, pos + 5).toLowerCase() === '</div') depth--;
      }
      pos++;
    }
    const fullBlock = result.slice(start, pos);
    const token = `\x00DIV${blocks.length}\x00`;
    blocks.push(fullBlock);
    result = result.slice(0, start) + token + result.slice(pos);
    re.lastIndex = start + token.length;
  }
  return { result, blocks };
}

/** Render a PDF card from a div block's HTML string */
function renderPdfCard(block) {
  const urlMatch = block.match(/data-pdf-url="([^"]+)"/);
  const nameMatch = block.match(/data-pdf-name="([^"]+)"/);
  const embedMatch = block.match(/data-pdf-embed="([^"]+)"/);
  if (!urlMatch) return block;

  let url = urlMatch[1];
  try { url = toRelativeUrl(url); } catch (_) {}
  const name = nameMatch ? nameMatch[1] : 'Document';
  const isEmbed = embedMatch ? embedMatch[1] === 'true' : true;
  const viewSrc = url.startsWith('/')
    ? url
    : `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  return `<div class="ql-pdf-card" style="margin:20px 0;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">` +
    `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 16px;background:#f5f5f5;border-bottom:1px solid #e0e0e0;">` +
    `<strong style="font-size:14px;">📄 ${name}</strong>` +
    `<a href="${url}" target="_blank" rel="noopener noreferrer" style="font-size:13px;color:#FFC81A;">⬇ Download</a>` +
    `</div>` +
    (isEmbed ? `<iframe src="${viewSrc}" style="width:100%;min-height:600px;display:block;border:none;" loading="lazy"></iframe>` : '') +
    `</div>`;
}

// ── Main processor ────────────────────────────────────────────────

function processHtml(html) {
  if (!html) return '';
  let out = html;

  // 1. Extract PDF div blocks (data-pdf-url attribute)
  const { result: r1, blocks: pdfBlocks } = extractDivBlocks(out, '<div[^>]+data-pdf-url=');
  out = r1;

  // 2. Extract video iframes → responsive wrapper
  const videos = [];
  out = out.replace(/<(?:span[^>]*class="[^"]*ql-(?:embed|video)-wrapper[^"]*"[^>]*>[\s\S]*?)?iframe[^>]+src="([^"]+)"[^>]*>[\s\S]*?<\/iframe>(?:[\s\S]*?<\/span>)?/gi, (m, src) => {
    const token = `\x00VID${videos.length}\x00`;
    videos.push(
      `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin:1.5rem 0;">` +
      `<iframe src="${src || (m.match(/src="([^"]+)"/) || [])[1]}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allowfullscreen loading="lazy"></iframe>` +
      `</div>`
    );
    return token;
  });

  // 3. Strip all Quill class/style attributes
  out = out.replace(/ style="[^"]*"/g, '');
  out = out.replace(/ class="[^"]*ql-[^"]*"/g, '');
  out = out.replace(/<p><br\s*\/?><\/p>/gi, '');

  // 4. Wrap tables
  if (out.includes('<table')) {
    out = TABLE_STYLE + out.replace(/<table/gi, '<div class="bltw"><table').replace(/<\/table>/gi, '</table></div>');
  }

  // 5. Apply inline styles
  out = out.replace(/<pre([^>]*)>/gi, `<pre$1 style="${STYLES.pre}">`);
  // code inside pre should NOT get inline-code styles — handled after
  out = out.replace(/<code([^>]*)>/gi, `<code$1 style="${STYLES.code}">`);
  // strip code styles when code is inside a pre
  out = out.replace(/(<pre[^>]*>)([\s\S]*?)(<\/pre>)/gi, (_, open, inner, close) =>
    open + inner.replace(/ style="[^"]*"/g, '') + close
  );
  out = out.replace(/<blockquote([^>]*)>/gi, `<blockquote$1 style="${STYLES.blockquote}">`);
  out = out.replace(/<h1([^>]*)>/gi, `<h1$1 style="${STYLES.h1}">`);
  out = out.replace(/<h2([^>]*)>/gi, `<h2$1 style="${STYLES.h2}">`);
  out = out.replace(/<h3([^>]*)>/gi, `<h3$1 style="${STYLES.h3}">`);
  out = out.replace(/<a([^>]*)>/gi, (m, attrs) => {
    const hasRel = /rel=/i.test(attrs);
    const rel = hasRel ? '' : ' rel="noopener noreferrer"';
    const hasTarget = /target=/i.test(attrs);
    const target = hasTarget ? '' : ' target="_blank"';
    return `<a${attrs}${rel}${target} style="${STYLES.a}">`;
  });
  out = out.replace(/<img([^>]*)>/gi, `<img$1 style="${STYLES.img}">`);

  // 6. Restore tokens
  out = out.replace(/\x00VID(\d+)\x00/g, (_, i) => videos[parseInt(i, 10)] || '');
  out = out.replace(/\x00DIV(\d+)\x00/g, (_, i) => renderPdfCard(pdfBlocks[parseInt(i, 10)] || ''));

  return out;
}

// ── Component ────────────────────────────────────────────────────

const BASE_STYLE = {
  fontSize: '1.0625rem',
  lineHeight: '1.8',
  color: '#333',
  wordBreak: 'break-word',
};

export default function QuillContent({ html }) {
  const processed = useMemo(() => processHtml(html), [html]);
  return (
    <div
      className="blog-content"
      style={BASE_STYLE}
      dangerouslySetInnerHTML={{ __html: processed }}
      suppressHydrationWarning
    />
  );
}
```

- [ ] **Step 2: Test the component renders without crashing**

Add a quick test import in `src/pages/api/hello.js` (revert after):
```js
// temporary — just verify no import error
// import QuillContent from '@/components/blog/QuillContent';
```
Or simply start the dev server `npm run dev` and navigate to any blog post — the import will fail loudly if there's a syntax error.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/QuillContent.jsx
git commit -m "feat: add QuillContent HTML processor with inline styles and responsive embeds"
```

---

## Task 3: blog.css — Prose Styles

**Files:**
- Create: `src/styles/blog.css`
- Modify: `src/pages/_app.js` (add import)

CSS fallback for elements that processHtml doesn't inline-style (lists, paragraphs, hr, table wrapper, PDF card, video).

- [ ] **Step 1: Create blog.css**

```css
/* src/styles/blog.css
   Prose styles for rendered Quill content (.blog-content)
   These complement the inline styles applied by QuillContent.jsx
*/

/* ── Base typography ── */
.blog-content { max-width: 100%; }
.blog-content p { margin: 0 0 1.2em; line-height: 1.8; }
.blog-content strong { font-weight: 700; }
.blog-content em { font-style: italic; }
.blog-content hr { border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0; }

/* ── Lists ── */
.blog-content ul,
.blog-content ol { margin: 0 0 1.2em 1.75em; padding: 0; }
.blog-content ul { list-style-type: disc; }
.blog-content ol { list-style-type: decimal; }
.blog-content li { margin-bottom: 0.35em; line-height: 1.7; }
.blog-content li > ul,
.blog-content li > ol { margin-top: 0.35em; margin-bottom: 0; }

/* ── Table wrapper ── */
.bltw { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 1.5rem 0; border-radius: 8px; }
.bltw table { width: 100%; border-collapse: collapse; font-size: 0.9375rem; min-width: 400px; }
.bltw table tr:first-child td,
.bltw table th {
  background: #FFC81A; color: #000; font-weight: 700;
  padding: 10px 14px; border: 1px solid #ccc; text-align: left;
}
.bltw table td { padding: 9px 14px; border: 1px solid #ddd; }
.bltw table tr:nth-child(even) td { background: #fafafa; }

/* ── PDF card ── */
.ql-pdf-card { margin: 1.5rem 0; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
.ql-pdf-card iframe { display: block; width: 100%; min-height: 600px; border: none; }

/* ── Video wrapper (responsive 16:9) ── */
.blog-content div[style*="padding-bottom:56.25%"] { border-radius: 8px; overflow: hidden; margin: 1.5rem 0; }

/* ── Images ── */
.blog-content figure { margin: 1.5rem 0; }
.blog-content figure figcaption { font-size: 0.85rem; color: #888; text-align: center; margin-top: 0.4rem; }
```

- [ ] **Step 2: Import in _app.js**

Read `src/pages/_app.js` first, then add the import after the existing style imports:

```js
import '@/styles/blog.css';
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/blog.css src/pages/_app.js
git commit -m "feat: add blog.css prose styles for rendered Quill content"
```

---

## Task 4: BlogPost.jsx — Two-Column Layout with Sidebar

**Files:**
- Modify: `src/components/blog/BlogPost.jsx`

Replace the current single-column layout with a two-column layout (main content + sticky sidebar). The sidebar shows: recent posts, related posts, categories list, a CTA card.

- [ ] **Step 1: Read the current file**

Read `src/components/blog/BlogPost.jsx` to confirm current structure before editing.

- [ ] **Step 2: Replace BlogPost.jsx with enhanced version**

```jsx
// src/components/blog/BlogPost.jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import BlogSeo from '@/components/blog/BlogSeo';
import QuillContent from '@/components/blog/QuillContent';

// ── Date formatter ────────────────────────────────────────────────
function formatDate(dateStr, locale, long = false) {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat(locale, {
    month: long ? 'long' : 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateStr));
}

// ── Sidebar: Recent Posts ─────────────────────────────────────────
function RecentPosts({ recent, lang, locale }) {
  if (!recent?.length) return null;
  return (
    <div className="bp-widget">
      <h5 className="bp-widget__title">Recent Posts</h5>
      <ul className="bp-recent-list">
        {recent.map((p) => (
          <li key={p.slug} className="bp-recent-item">
            <Link href={`/blog/${lang}/${p.slug}`} className="bp-recent-link">
              {p.coverImage && (
                <Image src={p.coverImage} alt={lang === 'fr' ? p.titleFr : p.titleEn}
                  width={72} height={54} style={{ objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
              )}
              <div>
                <span className="bp-recent-ttl">{lang === 'fr' ? p.titleFr : p.titleEn}</span>
                <span className="bp-recent-date">{formatDate(p.publishedAt, locale)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Sidebar: Categories ───────────────────────────────────────────
function CategoriesWidget({ categories }) {
  if (!categories?.length) return null;
  return (
    <div className="bp-widget">
      <h5 className="bp-widget__title">Categories</h5>
      <div className="bp-cat-list">
        {categories.map((c) => (
          <Link key={c} href={`/blog?category=${encodeURIComponent(c)}`} className="bp-cat-pill">{c}</Link>
        ))}
      </div>
    </div>
  );
}

// ── Sidebar: Related ──────────────────────────────────────────────
function RelatedWidget({ related, lang }) {
  if (!related?.length) return null;
  return (
    <div className="bp-widget">
      <h5 className="bp-widget__title">Related Articles</h5>
      <div className="bp-related-list">
        {related.map((r) => (
          <Link key={r.slug} href={`/blog/${lang}/${r.slug}`} className="bp-related-card">
            {r.coverImage && (
              <Image src={r.coverImage} alt={lang === 'fr' ? r.titleFr : r.titleEn}
                width={320} height={180} style={{ width: '100%', height: 'auto', borderRadius: 8 }} />
            )}
            <p className="bp-related-card__title">{lang === 'fr' ? r.titleFr : r.titleEn}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function BlogPost({ post, related, recent, categories, forceLang }) {
  const router = useRouter();
  const lang = forceLang || router.query.lang || 'fr';
  const [activeLang, setActiveLang] = useState(lang);

  useEffect(() => { setActiveLang(lang); }, [lang]);

  if (!post) {
    return <div className="bp-not-found"><h2>Post not found</h2></div>;
  }

  const locale = activeLang === 'fr' ? 'fr-FR' : 'en-US';
  const title   = activeLang === 'fr' ? post.titleFr   : post.titleEn;
  const excerpt = activeLang === 'fr' ? post.excerptFr : post.excerptEn;
  const content = activeLang === 'fr' ? post.contentFr : post.contentEn;
  const words   = (content || '').replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(words / 220));

  return (
    <>
      <BlogSeo post={post} lang={activeLang} />

      {/* ── Hero ── */}
      <section className="bp-hero">
        <div className="container">
          {/* breadcrumb */}
          <nav className="bp-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/blog">Blog</Link>
            <span>/</span>
            <span>{title}</span>
          </nav>

          {/* category pills */}
          {post.category && (
            <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className="bp-category-pill">
              {post.category}
            </Link>
          )}

          <h1 className="bp-hero__title">{title}</h1>
          {excerpt && <p className="bp-hero__excerpt">{excerpt}</p>}

          {/* meta row */}
          <div className="bp-meta-row">
            <span className="bp-meta-date">{formatDate(post.publishedAt, locale, true)}</span>
            <span className="bp-meta-sep">·</span>
            <span className="bp-meta-time">{readingTime} min read</span>
            {/* language switcher */}
            <div className="bp-lang-switcher" style={{ marginLeft: 'auto' }}>
              {['fr', 'en'].map((l) => (
                <button key={l}
                  className={`bp-lang-btn${activeLang === l ? ' bp-lang-btn--active' : ''}`}
                  onClick={() => router.push(`/blog/${l}/${post.slug}`)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Two-column layout ── */}
      <section className="bp-body">
        <div className="container">
          <div className="row g-5">

            {/* Main content */}
            <div className="col-lg-8">
              {post.coverImage && (
                <div className="bp-cover">
                  <Image priority width={900} height={500}
                    style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                    src={post.coverImage} alt={title} />
                </div>
              )}

              <article className="bp-article">
                <QuillContent html={content} />
              </article>

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="bp-tags">
                  {post.tags.map((t) => (
                    <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="bp-tag">{t}</Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="bp-sidebar">
                <RecentPosts recent={recent} lang={activeLang} locale={locale} />
                <CategoriesWidget categories={categories} />
                <RelatedWidget related={related} lang={activeLang} />

                {/* CTA card */}
                <div className="bp-widget bp-cta-card">
                  <h5>Ready to grow?</h5>
                  <p>Let Nova Impact help you build a stronger digital presence.</p>
                  <Link href="/contact" className="btn btn-primary w-100">Get in Touch</Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <style jsx>{`
        .bp-hero {
          background: linear-gradient(135deg, #0B0F1A 0%, #121828 60%, #1B2B4B 100%);
          padding: 80px 0 60px;
          margin-bottom: 0;
        }
        .bp-breadcrumb { display: flex; gap: 8px; align-items: center; font-size: 13px; color: #888; margin-bottom: 16px; }
        .bp-breadcrumb a { color: #888; text-decoration: none; }
        .bp-breadcrumb a:hover { color: #FFC81A; }
        .bp-breadcrumb span { color: #555; }
        .bp-category-pill {
          display: inline-block; padding: 4px 14px;
          background: rgba(255,200,26,0.15); color: #FFC81A;
          border-radius: 20px; font-size: 13px; font-weight: 600;
          text-decoration: none; margin-bottom: 16px;
        }
        .bp-hero__title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; color: #fff; line-height: 1.2; margin: 0 0 16px; }
        .bp-hero__excerpt { font-size: 1.1rem; color: #aaa; margin: 0 0 20px; line-height: 1.6; }
        .bp-meta-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .bp-meta-date, .bp-meta-time { font-size: 14px; color: #888; }
        .bp-meta-sep { color: #555; }
        .bp-lang-switcher { display: flex; gap: 4px; }
        .bp-lang-btn { padding: 4px 12px; border: 1px solid #3a3f47; border-radius: 4px; background: transparent; color: #888; font-size: 12px; font-weight: 600; cursor: pointer; }
        .bp-lang-btn--active { border-color: #FFC81A; color: #FFC81A; }
        .bp-body { padding: 60px 0 100px; }
        .bp-cover { margin-bottom: 36px; }
        .bp-article { margin-bottom: 32px; }
        .bp-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee; }
        .bp-tag { padding: 4px 14px; background: #f3f4f6; color: #555; border-radius: 20px; font-size: 13px; text-decoration: none; }
        .bp-tag:hover { background: #FFC81A; color: #000; }
        /* sidebar */
        .bp-sidebar { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 28px; }
        .bp-widget { background: #f9fafb; border-radius: 12px; padding: 20px; }
        .bp-widget__title { font-size: 15px; font-weight: 700; color: #111; margin: 0 0 16px; padding-bottom: 10px; border-bottom: 2px solid #FFC81A; }
        /* recent list */
        .bp-recent-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .bp-recent-link { display: flex; gap: 10px; align-items: flex-start; text-decoration: none; color: inherit; }
        .bp-recent-link:hover .bp-recent-ttl { color: #FFC81A; }
        .bp-recent-ttl { display: block; font-size: 13px; font-weight: 600; color: #111; line-height: 1.4; }
        .bp-recent-date { font-size: 12px; color: #999; display: block; margin-top: 3px; }
        /* categories */
        .bp-cat-list { display: flex; flex-wrap: wrap; gap: 6px; }
        .bp-cat-pill { padding: 4px 12px; border: 1px solid #e5e7eb; border-radius: 20px; font-size: 12px; color: #555; text-decoration: none; }
        .bp-cat-pill:hover { border-color: #FFC81A; color: #FFC81A; }
        /* related */
        .bp-related-list { display: flex; flex-direction: column; gap: 12px; }
        .bp-related-card { display: block; text-decoration: none; color: inherit; border-radius: 8px; overflow: hidden; }
        .bp-related-card__title { font-size: 13px; font-weight: 600; color: #111; margin: 8px 0 0; line-height: 1.4; }
        .bp-related-card:hover .bp-related-card__title { color: #FFC81A; }
        /* CTA card */
        .bp-cta-card { background: linear-gradient(135deg, #0B0F1A, #1B2B4B); color: #fff; }
        .bp-cta-card h5 { color: #fff; font-size: 16px; font-weight: 700; border-color: #FFC81A; }
        .bp-cta-card p { font-size: 13px; color: #aaa; margin-bottom: 16px; }
        /* not found */
        .bp-not-found { padding: 120px 0; text-align: center; }
      `}</style>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/BlogPost.jsx
git commit -m "feat: enhance BlogPost with two-column layout, sidebar, QuillContent renderer"
```

---

## Task 5: schema-builder.js — Full @graph JSON-LD

**Files:**
- Modify: `src/lib/schema-builder.js`

Replace the current single-object schema with a proper `@graph` array: Organization + WebSite + WebPage + BreadcrumbList + BlogPosting. If `post.schemaOverrides` contains `@type` that's not `Article`/`BlogPosting`, it's appended as a supplemental node.

- [ ] **Step 1: Replace schema-builder.js**

```js
// src/lib/schema-builder.js
const BASE_URL = 'https://novaimpact.io';
const ORG_NAME = 'Nova Impact';
const ORG_LOGO = `${BASE_URL}/assets/imgs/logo/site-logo-white-2.png`;

export function buildSchema(post, lang = 'fr') {
  const isFr = lang === 'fr';
  const title    = isFr ? (post.metaTitleFr || post.titleFr)   : (post.metaTitleEn || post.titleEn);
  const desc     = isFr ? (post.metaDescFr  || post.excerptFr) : (post.metaDescEn  || post.excerptEn);
  const keywords = isFr ? post.focusKeywordFr : post.focusKeywordEn;
  const postUrl  = `${BASE_URL}/blog/${lang}/${post.slug}`;
  const image    = post.ogImageUrl || post.coverImage || `${BASE_URL}/assets/imgs/thumb/og-default.jpg`;

  const words      = (isFr ? post.contentFr : post.contentEn || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  const readingMin = Math.max(1, Math.ceil(words / 220));

  const graph = [
    // Organization
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: ORG_NAME,
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: ORG_LOGO },
    },
    // WebSite
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: ORG_NAME,
      publisher: { '@id': `${BASE_URL}/#organization` },
    },
    // WebPage
    {
      '@type': 'WebPage',
      '@id': `${postUrl}#webpage`,
      url: postUrl,
      name: title,
      description: desc,
      isPartOf: { '@id': `${BASE_URL}/#website` },
      inLanguage: isFr ? 'fr-FR' : 'en-US',
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
    },
    // BreadcrumbList
    {
      '@type': 'BreadcrumbList',
      '@id': `${postUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: title, item: postUrl },
      ],
    },
    // BlogPosting
    {
      '@type': post.schemaType === 'BlogPosting' ? 'BlogPosting' : 'BlogPosting',
      '@id': `${postUrl}#article`,
      headline: title,
      description: desc,
      image: { '@type': 'ImageObject', url: image },
      url: postUrl,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      wordCount: words,
      timeRequired: `PT${readingMin}M`,
      inLanguage: isFr ? 'fr-FR' : 'en-US',
      keywords: keywords || undefined,
      articleSection: post.category || undefined,
      author: { '@id': `${BASE_URL}/#organization` },
      publisher: { '@id': `${BASE_URL}/#organization` },
      isPartOf: { '@id': `${postUrl}#webpage` },
      mainEntityOfPage: { '@id': `${postUrl}#webpage` },
    },
  ];

  // Supplemental node from schemaOverrides (FAQPage, HowTo, etc.)
  if (post.schemaOverrides && post.schemaOverrides['@type']) {
    const supplementalType = post.schemaOverrides['@type'];
    const articleTypes = ['Article', 'BlogPosting', 'NewsArticle'];
    if (!articleTypes.includes(supplementalType)) {
      graph.push({
        ...post.schemaOverrides,
        '@id': post.schemaOverrides['@id'] || `${postUrl}#supplemental`,
      });
    } else {
      // Merge overrides into the BlogPosting node (last in graph)
      const blogPosting = graph[graph.length - 1];
      Object.assign(blogPosting, post.schemaOverrides);
    }
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
```

- [ ] **Step 2: Verify no breakage in BlogSeo**

`BlogSeo.jsx` calls `buildSchema(post, lang)` and passes it to `JSON.stringify`. The return type changed from an object to a `{ '@context', '@graph' }` object — that's still valid JSON-LD. No change needed in `BlogSeo.jsx`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/schema-builder.js
git commit -m "feat: upgrade schema-builder to full @graph JSON-LD (Organization + WebPage + BreadcrumbList + BlogPosting)"
```

---

## Task 6: blog/[lang]/[slug].jsx — Wire Up blog-store + Sidebar Data

**Files:**
- Modify: `src/pages/blog/[lang]/[slug].jsx`

Pass `recent` and `categories` props to `BlogPost` so the sidebar can render. Use `blog-store.js` functions instead of raw Prisma calls.

- [ ] **Step 1: Replace getStaticProps in blog/[lang]/[slug].jsx**

```jsx
// src/pages/blog/[lang]/[slug].jsx
import RootLayout from '@/components/common/layout/RootLayout';
import BlogPost from '@/components/blog/BlogPost';

export default function BlogSlugLang({ post, related, recent, categories, lang }) {
  return (
    <RootLayout header="header3" footer="footer3">
      <BlogPost
        post={post}
        related={related}
        recent={recent}
        categories={categories}
        forceLang={lang}
      />
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
    const paths = posts.flatMap((p) => [
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

  // Dynamic import blog-store to keep Node module resolution consistent in build context
  const {
    getPublishedPostBySlug,
    listRelatedPosts,
    listRecentPublishedPosts,
    listPublishedCategories,
  } = await import('@/lib/blog-store');

  const post = await getPublishedPostBySlug(slug);
  if (!post) return { notFound: true };

  const [related, recent, categories] = await Promise.all([
    listRelatedPosts(post.id, post.category, 3),
    listRecentPublishedPosts(4, post.id),
    listPublishedCategories(),
  ]);

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      related: JSON.parse(JSON.stringify(related)),
      recent: JSON.parse(JSON.stringify(recent)),
      categories,
      lang,
    },
    revalidate: 60,
  };
}
```

- [ ] **Step 2: Start dev server and test a blog post page**

```bash
npm run dev
```

Navigate to `http://localhost:3000/blog/fr/<any-published-slug>`.

Expected: Two-column layout renders, sidebar shows recent posts + categories + related posts. QuillContent renders the post body.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/[lang]/[slug].jsx
git commit -m "feat: wire blog-store into [slug] page, pass sidebar data to BlogPost"
```

---

## Task 7: blog/index.jsx — Use blog-store for SSR

**Files:**
- Modify: `src/pages/blog/index.jsx`

Move raw Prisma calls out of the page and into `blog-store.js`.

- [ ] **Step 1: Read the current file**

Read `src/pages/blog/index.jsx`.

- [ ] **Step 2: Update getServerSideProps (or getStaticProps) to use blog-store**

In `src/pages/blog/index.jsx`, replace the existing data-fetch with:

```js
export async function getServerSideProps({ query }) {
  const { listPublishedPosts, listPublishedCategories } = await import('@/lib/blog-store');
  const page     = parseInt(query.page || '1', 10);
  const category = query.category || '';

  const [{ posts, total, pages }, categories] = await Promise.all([
    listPublishedPosts({ page, limit: 9, category }),
    listPublishedCategories(),
  ]);

  return {
    props: {
      initialPosts: JSON.parse(JSON.stringify(posts)),
      initialCategories: categories,
      pagination: { page, pages, total },
    },
  };
}
```

- [ ] **Step 3: Confirm BlogIndex receives props correctly**

Check that `BlogIndex` component (in `src/components/blog/BlogIndex.jsx`) uses `initialPosts`, `initialCategories`, and `pagination` props — these are already the expected prop names from the existing component.

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/index.jsx
git commit -m "feat: use blog-store in blog index page for SSR data fetch"
```

---

## Self-Review Checklist

### Spec Coverage

| Blueprint Requirement | Task |
|---|---|
| `blog-store.js` with all query functions | Task 1 |
| `QuillContent` HTML processor (PDF extract, video responsive, inline styles) | Task 2 |
| `blog.css` prose styles | Task 3 |
| `BlogPostView` two-column layout with sidebar (recent, related, categories, CTA) | Task 4 |
| Full JSON-LD `@graph` (Org + WebSite + WebPage + Breadcrumb + BlogPosting + supplemental) | Task 5 |
| Public blog pages wired to blog-store | Tasks 6 + 7 |
| Reading time calculation | Task 4 (inline in BlogPost.jsx), Task 5 (in schema builder) |
| `suppressHydrationWarning` on QuillContent | Task 2 ✓ |
| `useRef` pattern for stale closure on `onChange` | N/A — existing RichTextEditor already handles this |
| Category/Tag relational models (Prisma join tables) | **Not included** — existing `category: String` + `tags: String[]` works. Add as follow-up if needed. |

### Placeholder Scan
None found. Every step has code or explicit commands.

### Type Consistency
- `blog-store.js` exports named functions; Tasks 6+7 use the same names via destructuring ✓
- `BlogPost.jsx` accepts `{ post, related, recent, categories, forceLang }` — Task 6 passes exactly these props ✓
- `buildSchema()` signature unchanged: `(post, lang)` — `BlogSeo.jsx` calls it unchanged ✓
