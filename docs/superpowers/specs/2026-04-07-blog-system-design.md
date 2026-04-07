# Blog System Design — Nova Impact

**Date:** 2026-04-07  
**Stack:** Next.js 13 (pages router), Prisma, PostgreSQL, NextAuth.js, Bootstrap 5  
**Approach:** Full Next.js API Routes + Prisma with ISR for maximum SEO performance

---

## 1. Architecture Overview

```
PostgreSQL (Laragon)
    └── Prisma ORM
          ├── API Routes (/api/blog/*, /api/admin/*, /api/uploads/*)
          │     └── Protected by NextAuth session middleware
          ├── Admin Dashboard (/admin/*) — Bootstrap 5, SSR
          └── Public Blog Pages (/blog, /blog/[slug]) — ISR (revalidate: 60s)
                └── On-demand revalidation on publish/update
```

---

## 2. Database Schema (Prisma)

### `User`
```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String   // bcrypt hashed
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
}

enum Role {
  ADMIN
}
```

### `Post`
```prisma
model Post {
  id          String     @id @default(cuid())
  slug        String     @unique  // URL-safe, auto-generated from titleFr

  // Content — bilingual
  titleFr     String
  titleEn     String
  excerptFr   String
  excerptEn   String
  contentFr   String     @db.Text
  contentEn   String     @db.Text

  // Media
  coverImage  String?    // e.g. /uploads/my-image.jpg
  ogImageUrl  String?    // defaults to coverImage at render time

  // Taxonomy
  category    String
  tags        String[]   // PostgreSQL array

  // Status
  status      PostStatus @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  // SEO — per language
  metaTitleFr     String?
  metaTitleEn     String?
  metaDescFr      String?
  metaDescEn      String?
  focusKeywordFr  String?
  focusKeywordEn  String?
  canonicalUrl    String?
  noIndex         Boolean  @default(false)

  // Schema.org
  schemaType      SchemaType @default(Article)
  schemaOverrides Json?      // Raw JSON merged over auto-generated schema
}

enum PostStatus {
  DRAFT
  PUBLISHED
}

enum SchemaType {
  Article
  BlogPosting
  HowTo
  FAQPage
  NewsArticle
}
```

### `Upload`
```prisma
model Upload {
  id        String   @id @default(cuid())
  filename  String
  path      String   // /uploads/filename.jpg
  size      Int      // bytes
  mimeType  String
  createdAt DateTime @default(now())
}
```

---

## 3. SEO System

### Per-page `<Head>` tags (every `/blog/[slug]`)

| Tag | Source |
|-----|--------|
| `<title>` | `metaTitleFr/En` → fallback to `titleFr/En` |
| `<meta name="description">` | `metaDescFr/En` |
| `<meta name="robots">` | `index, follow` if published + !noIndex, else `noindex` |
| `<link rel="canonical">` | `canonicalUrl` → fallback to auto-generated URL |
| `og:title`, `og:description`, `og:image`, `og:url` | SEO fields or post fields |
| `twitter:card`, `twitter:title`, etc. | Same sources |
| `<html lang="">` | `fr` or `en` based on active language |
| `<link rel="alternate" hreflang="fr">` + `hreflang="en"` | Both language URLs |

### Schema.org JSON-LD

Two-layer system:

**Layer 1 — Auto-generated base** (built from post fields):
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "post.titleFr",
  "description": "post.excerptFr",
  "image": "post.ogImageUrl || post.coverImage",
  "datePublished": "post.publishedAt",
  "dateModified": "post.updatedAt",
  "author": { "@type": "Organization", "name": "Nova Impact" },
  "publisher": {
    "@type": "Organization",
    "name": "Nova Impact",
    "logo": { "@type": "ImageObject", "url": "/logo.png" }
  },
  "inLanguage": "fr-FR",
  "url": "https://novaimpact.fr/blog/[slug]"
}
```

**Layer 2 — Admin overrides** (`post.schemaOverrides` JSON, deep-merged on top).

The `schemaType` field replaces `@type` in the base.

### Admin Schema Editor (per post)
- Schema type selector: `Article | BlogPosting | HowTo | FAQPage | NewsArticle`
- Read-only auto-generated JSON preview
- Custom JSON overrides textarea
- Live merged preview (auto-generated + overrides)

### Sitemap
- `/api/sitemap.xml` — API route, queries all `PUBLISHED` posts
- Each post generates 2 entries: `?lang=fr` and `?lang=en`
- Includes `<lastmod>` (updatedAt) and `<changefreq>monthly`

### Robots.txt
- Static `public/robots.txt`
- Blocks `/admin/*` from all crawlers
- Points to sitemap URL

---

## 4. Admin Dashboard

### Authentication
- NextAuth.js with `CredentialsProvider` (email + bcrypt password)
- Session strategy: JWT
- All `/admin/*` pages check session in `getServerSideProps`
- All `/api/admin/*` routes validate session via `getServerSession`

### Pages

| Route | Purpose |
|-------|---------|
| `/admin` | Stats: total posts, drafts, published, uploads count |
| `/admin/posts` | Posts table: title, status, category, date, edit/delete/publish actions |
| `/admin/posts/new` | Create post — 3-tab editor |
| `/admin/posts/[id]` | Edit post — 3-tab editor |
| `/admin/uploads` | Image library grid, upload new, delete |
| `/admin/settings` | Site-wide SEO defaults (org name, logo URL, default OG image) |

### Post Editor Tabs

**General tab:**
- Title FR / Title EN
- Slug (auto-generated from titleFr on blur, editable)
- Excerpt FR / Excerpt EN (textarea, 160 char suggested)
- Content FR / Content EN (rich textarea — Markdown with preview)
- Category (text input), Tags (comma-separated)
- Cover Image (pick from upload library or upload inline)
- Status toggle (Draft / Published)
- Publish date picker

**SEO tab:**
- Meta title FR/EN + character counter (60 char max, color indicator)
- Meta description FR/EN + counter (160 char max)
- Focus keyword FR/EN
- Canonical URL override (optional)
- OG image (defaults to cover, can override)
- noIndex toggle

**Schema tab:**
- Schema type selector dropdown
- Auto-generated JSON preview (read-only, syntax highlighted)
- Custom overrides JSON textarea
- Live merged JSON preview

### API Routes

| Method | Route | Action |
|--------|-------|--------|
| GET | `/api/admin/posts` | List all posts (admin) |
| POST | `/api/admin/posts` | Create post |
| GET | `/api/admin/posts/[id]` | Get single post |
| PUT | `/api/admin/posts/[id]` | Update post + trigger ISR revalidation |
| DELETE | `/api/admin/posts/[id]` | Delete post |
| POST | `/api/admin/uploads` | Upload image (multipart/form-data) |
| GET | `/api/admin/uploads` | List uploads |
| DELETE | `/api/admin/uploads/[id]` | Delete upload |

### Security
- bcrypt password hashing (salt rounds: 12)
- NextAuth JWT session on all admin routes
- File upload validation: allowed types (`image/jpeg`, `image/png`, `image/webp`), max size 5MB
- Prisma prevents SQL injection by design
- CSRF: NextAuth handles this via its built-in CSRF token

---

## 5. Public Frontend

### Pages

| Route | Component | Data |
|-------|-----------|------|
| `/blog` | Updated `Blog1.jsx` | `getStaticProps` + `revalidate: 60` |
| `/blog/[slug]` | `BlogDetails1.jsx` (updated) | `getStaticProps` + `getStaticPaths` + `revalidate: 60` |
| `/blog/category/[category]` | New component | `getStaticProps` + `revalidate: 60` |

### Language Switching
- Query param: `?lang=fr` (default) / `?lang=en`
- Falls back to browser `Accept-Language` header on first visit
- `<link rel="alternate" hreflang>` tags for both variants
- Language toggle button in blog header area

### `Blog1.jsx` Update
- Receives `posts` prop (array of post objects)
- Keeps all existing GSAP animation code and CSS classes unchanged
- Card data becomes dynamic: title, excerpt, category, date, coverImage, slug
- Links point to `/blog/[slug]?lang=fr` (or `en`)

### Image Serving
- Uploaded images stored in `public/uploads/`
- Served by Next.js static file serving (no API route needed for reads)
- Next.js `<Image>` component used with `width`/`height` for automatic WebP optimization

### On-Demand ISR Revalidation
When admin publishes or updates a post, the PUT/POST API calls:
```js
await res.revalidate('/blog')
await res.revalidate(`/blog/${slug}`)
await res.revalidate(`/blog/category/${category}`)
```
Pages rebuild instantly without waiting for the 60s timer.

---

## 6. Seeding

A Prisma seed script (`prisma/seed.js`) creates:
- 1 admin user (email + hashed password from `.env`)
- 5–6 sample blog posts in both French and English with full SEO fields and schema
- Sample uploads records pointing to existing `/public/assets/imgs/blog/` images

Run with: `npx prisma db seed`

---

## 7. New Dependencies

| Package | Purpose |
|---------|---------|
| `@prisma/client` | DB ORM |
| `prisma` (dev) | Schema + migrations |
| `next-auth` | Authentication |
| `bcryptjs` | Password hashing |
| `multer` | File upload handling in API routes |
| `slugify` | Auto-generate URL slugs from titles |

---

## 8. File Structure (new files)

```
prisma/
  schema.prisma
  seed.js

public/
  robots.txt
  uploads/           ← uploaded images land here

src/
  pages/
    blog/
      index.jsx      ← replaces /blog (dynamic)
      [slug].jsx     ← dynamic article page
      category/
        [category].jsx
    admin/
      index.jsx
      posts/
        index.jsx
        new.jsx
        [id].jsx
      uploads/
        index.jsx
      settings/
        index.jsx
    api/
      auth/
        [...nextauth].js
      admin/
        posts/
          index.js
          [id].js
        uploads/
          index.js
          [id].js
        settings.js
      sitemap.xml.js
      revalidate.js

  components/
    blog/
      Blog1.jsx      ← updated (dynamic props)
      BlogDetails1.jsx ← updated (dynamic props + SEO)
      BlogCard.jsx   ← extracted reusable card
      BlogSeo.jsx    ← SEO Head component for articles
    admin/
      AdminLayout.jsx
      PostEditor/
        GeneralTab.jsx
        SeoTab.jsx
        SchemaTab.jsx
        SchemaPreview.jsx
      UploadLibrary.jsx
      ImagePicker.jsx

  lib/
    prisma.js        ← Prisma client singleton
    auth.js          ← NextAuth options
    schema-builder.js ← builds JSON-LD from post data
    slugify.js       ← slug generation helper
    upload.js        ← multer config
```
