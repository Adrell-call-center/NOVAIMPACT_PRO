# Blog System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full blog system with bilingual content, Yoast-style SEO + Schema.org, an admin dashboard (posts, uploads, contacts, newsletter), ISR public pages, and Jest API tests — all backed by Prisma + PostgreSQL.

**Architecture:** Next.js 13 pages router with Prisma ORM on PostgreSQL. Public blog pages use `getStaticProps` + ISR (revalidate: 60s) for max SEO performance with on-demand revalidation on publish. Admin area at `/admin/*` is protected by NextAuth.js JWT sessions with bcrypt-hashed credentials seeded from `.env`.

**Tech Stack:** Next.js 13, Prisma, PostgreSQL (Laragon), NextAuth.js, bcryptjs, multer, slugify, nodemailer (existing), Jest, node-mocks-http, Bootstrap 5 (existing)

---

## Phase 1: Foundation

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime dependencies**

```bash
cd c:/laragon/www/NOVAIMPACT_PRO
npm install @prisma/client next-auth bcryptjs slugify multer
```

- [ ] **Step 2: Install dev dependencies**

```bash
npm install --save-dev prisma jest jest-environment-node node-mocks-http @types/bcryptjs
```

- [ ] **Step 3: Verify installations**

```bash
npx prisma --version
```
Expected output: `prisma: X.X.X` (any recent version)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install blog system dependencies"
```

---

### Task 2: Environment variables

**Files:**
- Modify: `.env` (create if missing)
- Create: `.env.example`
- Modify: `public/robots.txt` (create)

- [ ] **Step 1: Create/update `.env`**

Add these variables to `.env` (keep existing SMTP vars, update names to match):

```env
# Database
DATABASE_URL="postgresql://postgres:@localhost:5432/novaimpact_blog"

# NextAuth
NEXTAUTH_SECRET="change-this-to-a-random-32-char-string-in-prod"
NEXTAUTH_URL="http://localhost:3000"

# Admin seed credentials
ADMIN_EMAIL="admin@novaimpact.fr"
ADMIN_PASSWORD="NovaAdmin2026!"

# SMTP (update to match your Laragon SMTP config)
SMTP_HOST="localhost"
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USERNAME=""
SMTP_PASSWORD=""
SMTP_FROM_NAME="Nova Impact"
SMTP_FROM_EMAIL="noreply@novaimpact.fr"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

- [ ] **Step 2: Create `.env.example`**

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/novaimpact_blog"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@novaimpact.fr"
ADMIN_PASSWORD="your-admin-password"
SMTP_HOST="localhost"
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USERNAME=""
SMTP_PASSWORD=""
SMTP_FROM_NAME="Nova Impact"
SMTP_FROM_EMAIL="noreply@novaimpact.fr"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

- [ ] **Step 3: Ensure `.env` is in `.gitignore`**

Check `.gitignore` contains:
```
.env
.env.local
public/uploads/
```

If not, add those lines to `.gitignore`.

- [ ] **Step 4: Create `public/robots.txt`**

```
User-agent: *
Disallow: /admin/
Disallow: /api/admin/
Allow: /

Sitemap: http://localhost:3000/api/sitemap.xml
```

- [ ] **Step 5: Create uploads directory**

```bash
mkdir -p public/uploads
touch public/uploads/.gitkeep
```

- [ ] **Step 6: Commit**

```bash
git add .env.example public/robots.txt public/uploads/.gitkeep .gitignore
git commit -m "chore: add env config, robots.txt, and uploads directory"
```

---

### Task 3: Prisma schema

**Files:**
- Create: `prisma/schema.prisma`

- [ ] **Step 1: Initialize Prisma**

```bash
npx prisma init --datasource-provider postgresql
```

This creates `prisma/schema.prisma` and updates `.env` with a placeholder `DATABASE_URL` (our `.env` already has the correct one — no action needed).

- [ ] **Step 2: Replace `prisma/schema.prisma` with full schema**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
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

enum SubscriberStatus {
  ACTIVE
  UNSUBSCRIBED
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
}

model Post {
  id        String     @id @default(cuid())
  slug      String     @unique

  titleFr   String
  titleEn   String
  excerptFr String
  excerptEn String
  contentFr String     @db.Text
  contentEn String     @db.Text

  coverImage String?
  ogImageUrl String?

  category  String
  tags      String[]

  status      PostStatus @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  metaTitleFr    String?
  metaTitleEn    String?
  metaDescFr     String?
  metaDescEn     String?
  focusKeywordFr String?
  focusKeywordEn String?
  canonicalUrl   String?
  noIndex        Boolean    @default(false)

  schemaType      SchemaType @default(Article)
  schemaOverrides Json?
}

model Upload {
  id        String   @id @default(cuid())
  filename  String
  path      String
  size      Int
  mimeType  String
  createdAt DateTime @default(now())
}

model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String?
  message   String   @db.Text
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Subscriber {
  id             String           @id @default(cuid())
  email          String           @unique
  status         SubscriberStatus @default(ACTIVE)
  subscribedAt   DateTime         @default(now())
  unsubscribedAt DateTime?
}
```

- [ ] **Step 3: Create the PostgreSQL database in Laragon**

Open pgAdmin or use psql:
```bash
psql -U postgres -c "CREATE DATABASE novaimpact_blog;"
```

Or via Laragon's HeidiSQL: create a new database named `novaimpact_blog`.

- [ ] **Step 4: Run migration**

```bash
npx prisma migrate dev --name init
```

Expected: migration file created + applied, Prisma Client generated.

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add Prisma schema with Post, User, Upload, Contact, Subscriber models"
```

---

### Task 4: Prisma client singleton

**Files:**
- Create: `src/lib/prisma.js`

- [ ] **Step 1: Create `src/lib/prisma.js`**

```js
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/prisma.js
git commit -m "feat: add Prisma client singleton"
```

---

### Task 5: Utility libraries

**Files:**
- Create: `src/lib/mailer.js`
- Create: `src/lib/slugify-post.js`
- Create: `src/lib/upload.js`

- [ ] **Step 1: Create `src/lib/mailer.js`**

```js
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USERNAME
    ? { user: process.env.SMTP_USERNAME, pass: process.env.SMTP_PASSWORD }
    : undefined,
})

export default transporter
```

- [ ] **Step 2: Create `src/lib/slugify-post.js`**

```js
import slugifyLib from 'slugify'

export function slugify(text) {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    locale: 'fr',
  })
}
```

- [ ] **Step 3: Create `src/lib/upload.js`**

```js
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// multer requires uuid — install it:
// npm install uuid

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public/uploads'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${uuidv4()}${ext}`)
  },
})

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF allowed.'))
    }
  },
})
```

- [ ] **Step 4: Install uuid**

```bash
npm install uuid
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/mailer.js src/lib/slugify-post.js src/lib/upload.js package.json package-lock.json
git commit -m "feat: add mailer, slugify, and upload utility libs"
```

---

### Task 6: NextAuth setup

**Files:**
- Create: `src/pages/api/auth/[...nextauth].js`
- Create: `src/lib/auth.js`

- [ ] **Step 1: Create `src/lib/auth.js`**

```js
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        return { id: user.id, name: user.name, email: user.email, role: user.role }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    session({ session, token }) {
      if (session.user) session.user.role = token.role
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
```

- [ ] **Step 2: Create `src/pages/api/auth/[...nextauth].js`**

```js
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

export default NextAuth(authOptions)
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/auth.js src/pages/api/auth/
git commit -m "feat: add NextAuth with CredentialsProvider and JWT sessions"
```

---

### Task 7: Admin auth helper

**Files:**
- Create: `src/lib/admin-auth.js`

- [ ] **Step 1: Create `src/lib/admin-auth.js`**

This helper is used in every admin API route and page to check the session.

```js
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'

/**
 * Use in API routes: const session = await requireAdmin(req, res)
 * Returns null and sends 401 if not authenticated.
 */
export async function requireAdmin(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    res.status(401).json({ error: 'Unauthorized' })
    return null
  }
  return session
}

/**
 * Use in getServerSideProps: const redirect = adminRedirect(session)
 * Returns redirect object if not authenticated, null otherwise.
 */
export function adminRedirect(session) {
  if (!session || session.user?.role !== 'ADMIN') {
    return { redirect: { destination: '/admin/login', permanent: false } }
  }
  return null
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/admin-auth.js
git commit -m "feat: add admin auth helper for API routes and pages"
```

---

### Task 8: Schema builder

**Files:**
- Create: `src/lib/schema-builder.js`

- [ ] **Step 1: Create `src/lib/schema-builder.js`**

```js
/**
 * Builds a JSON-LD schema object from a post.
 * post.schemaOverrides (JSON) is deep-merged on top of the base.
 */
export function buildSchema(post, lang = 'fr') {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const title = lang === 'fr' ? post.titleFr : post.titleEn
  const excerpt = lang === 'fr' ? post.excerptFr : post.excerptEn
  const image = post.ogImageUrl || post.coverImage
  const inLanguage = lang === 'fr' ? 'fr-FR' : 'en-US'

  const base = {
    '@context': 'https://schema.org',
    '@type': post.schemaType || 'Article',
    headline: title,
    description: excerpt,
    image: image ? `${siteUrl}${image}` : undefined,
    datePublished: post.publishedAt?.toISOString?.() ?? post.publishedAt,
    dateModified: post.updatedAt?.toISOString?.() ?? post.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'Nova Impact',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nova Impact',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/assets/imgs/logo/logo.png`,
      },
    },
    inLanguage,
    url: `${siteUrl}/blog/${post.slug}?lang=${lang}`,
  }

  if (post.schemaOverrides && typeof post.schemaOverrides === 'object') {
    return deepMerge(base, post.schemaOverrides)
  }

  return base
}

function deepMerge(target, source) {
  const output = { ...target }
  for (const key of Object.keys(source)) {
    if (
      source[key] !== null &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object'
    ) {
      output[key] = deepMerge(target[key], source[key])
    } else {
      output[key] = source[key]
    }
  }
  return output
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/schema-builder.js
git commit -m "feat: add JSON-LD schema builder with deep-merge override support"
```

---

## Phase 2: Public Blog API & Pages

### Task 9: Public blog API routes

**Files:**
- Create: `src/pages/api/blog/posts.js`
- Create: `src/pages/api/blog/[slug].js`

- [ ] **Step 1: Create `src/pages/api/blog/posts.js`**

```js
import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { category, limit = 100, page = 1 } = req.query
  const take = Math.min(Number(limit), 100)
  const skip = (Number(page) - 1) * take

  const where = {
    status: 'PUBLISHED',
    ...(category ? { category } : {}),
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take,
      skip,
      select: {
        id: true,
        slug: true,
        titleFr: true,
        titleEn: true,
        excerptFr: true,
        excerptEn: true,
        coverImage: true,
        category: true,
        tags: true,
        publishedAt: true,
        updatedAt: true,
      },
    }),
    prisma.post.count({ where }),
  ])

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
  res.status(200).json({ posts, total, page: Number(page), limit: take })
}
```

- [ ] **Step 2: Create `src/pages/api/blog/[slug].js`**

```js
import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { slug } = req.query

  const post = await prisma.post.findUnique({
    where: { slug },
  })

  if (!post || post.status !== 'PUBLISHED') {
    return res.status(404).json({ error: 'Post not found' })
  }

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
  res.status(200).json({ post })
}
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/blog/
git commit -m "feat: add public blog API routes (list posts, get by slug)"
```

---

### Task 10: Sitemap API

**Files:**
- Create: `src/pages/api/sitemap.xml.js`

- [ ] **Step 1: Create `src/pages/api/sitemap.xml.js`**

```js
import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: 'desc' },
  })

  const staticPages = [
    { url: `${siteUrl}/`, changefreq: 'weekly', priority: '1.0' },
    { url: `${siteUrl}/blog`, changefreq: 'daily', priority: '0.9' },
    { url: `${siteUrl}/about`, changefreq: 'monthly', priority: '0.7' },
    { url: `${siteUrl}/contact`, changefreq: 'monthly', priority: '0.6' },
  ]

  const postUrls = posts.flatMap((p) => [
    {
      url: `${siteUrl}/blog/${p.slug}?lang=fr`,
      lastmod: p.updatedAt.toISOString(),
      changefreq: 'monthly',
      priority: '0.8',
    },
    {
      url: `${siteUrl}/blog/${p.slug}?lang=en`,
      lastmod: p.updatedAt.toISOString(),
      changefreq: 'monthly',
      priority: '0.8',
    },
  ])

  const allUrls = [...staticPages, ...postUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.url}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=3600')
  res.status(200).send(xml)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/api/sitemap.xml.js
git commit -m "feat: add sitemap.xml API with bilingual post URLs"
```

---

### Task 11: BlogSeo component

**Files:**
- Create: `src/components/blog/BlogSeo.jsx`

- [ ] **Step 1: Create `src/components/blog/BlogSeo.jsx`**

```jsx
import Head from 'next/head'
import { buildSchema } from '@/lib/schema-builder'

/**
 * Renders all SEO <Head> tags for a blog post page.
 * lang: 'fr' | 'en'
 */
export default function BlogSeo({ post, lang = 'fr' }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const title = lang === 'fr'
    ? (post.metaTitleFr || post.titleFr)
    : (post.metaTitleEn || post.titleEn)
  const description = lang === 'fr'
    ? (post.metaDescFr || post.excerptFr)
    : (post.metaDescEn || post.excerptEn)
  const ogImage = post.ogImageUrl || post.coverImage
    ? `${siteUrl}${post.ogImageUrl || post.coverImage}`
    : `${siteUrl}/assets/imgs/logo/og-default.jpg`
  const canonical = post.canonicalUrl || `${siteUrl}/blog/${post.slug}?lang=${lang}`
  const robots = post.noIndex ? 'noindex, nofollow' : 'index, follow'
  const schema = buildSchema(post, lang)

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      {/* hreflang alternates */}
      <link rel="alternate" hrefLang="fr" href={`${siteUrl}/blog/${post.slug}?lang=fr`} />
      <link rel="alternate" hrefLang="en" href={`${siteUrl}/blog/${post.slug}?lang=en`} />
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/blog/${post.slug}?lang=fr`} />

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={lang === 'fr' ? 'fr_FR' : 'en_US'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article meta */}
      {post.publishedAt && (
        <meta property="article:published_time" content={new Date(post.publishedAt).toISOString()} />
      )}
      <meta property="article:modified_time" content={new Date(post.updatedAt).toISOString()} />
      {post.focusKeywordFr && lang === 'fr' && (
        <meta name="keywords" content={post.focusKeywordFr} />
      )}
      {post.focusKeywordEn && lang === 'en' && (
        <meta name="keywords" content={post.focusKeywordEn} />
      )}

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/blog/BlogSeo.jsx
git commit -m "feat: add BlogSeo component with full meta tags, OG, hreflang, and JSON-LD"
```

---

### Task 12: BlogCard component

**Files:**
- Create: `src/components/blog/BlogCard.jsx`

- [ ] **Step 1: Create `src/components/blog/BlogCard.jsx`**

```jsx
import Link from 'next/link'
import Image from 'next/image'

/**
 * Reusable blog card. Keeps existing CSS classes from Blog1.jsx.
 * lang: 'fr' | 'en'
 */
export default function BlogCard({ post, lang = 'fr' }) {
  const title = lang === 'fr' ? post.titleFr : post.titleEn
  const excerpt = lang === 'fr' ? post.excerptFr : post.excerptEn
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : ''
  const href = `/blog/${post.slug}?lang=${lang}`
  const imgSrc = post.coverImage || '/assets/imgs/blog/1.jpg'

  return (
    <article className="blog__item">
      <div className="blog__img-wrapper">
        <Link href={href}>
          <div className="img-box">
            <Image
              style={{ width: 'auto', height: 'auto' }}
              className="image-box__item"
              src={imgSrc}
              alt={title}
              width={400}
              height={300}
            />
            <Image
              style={{ width: 'auto', height: 'auto' }}
              className="image-box__item"
              src={imgSrc}
              alt={title}
              width={400}
              height={300}
            />
          </div>
        </Link>
      </div>
      <h4 className="blog__meta">
        <Link href={`/blog/category/${post.category}?lang=${lang}`}>{post.category}</Link>
        {date && ` . ${date}`}
      </h4>
      <h5>
        <Link href={href} className="blog__title">
          {title}
        </Link>
      </h5>
      <Link href={href} className="blog__btn">
        {lang === 'fr' ? 'Lire la suite' : 'Read More'}{' '}
        <span>
          <i className="fa-solid fa-arrow-right"></i>
        </span>
      </Link>
    </article>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/blog/BlogCard.jsx
git commit -m "feat: add reusable BlogCard component with bilingual support"
```

---

### Task 13: Update Blog1.jsx to be dynamic

**Files:**
- Modify: `src/components/blog/Blog1.jsx`

- [ ] **Step 1: Replace `src/components/blog/Blog1.jsx`**

The component now receives `posts` and `lang` as props. The GSAP animation code is unchanged.

```jsx
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from '@/plugins'
import animationCharCome from '@/lib/utils/animationCharCome'
import BlogCard from './BlogCard'

gsap.registerPlugin(ScrollTrigger)

const Blog1 = ({ posts = [], lang = 'fr' }) => {
  const charAnim = useRef()

  useEffect(() => {
    animationCharCome(charAnim.current)
    if (typeof window !== 'undefined') {
      let device_width = window.innerWidth
      let tHero = gsap.context(() => {
        gsap.set('.blog__animation .blog__item', { x: 50, opacity: 0 })

        if (device_width < 1023) {
          const blogList = gsap.utils.toArray('.blog__animation .blog__item')
          blogList.forEach((item) => {
            let blogTl = gsap.timeline({
              scrollTrigger: { trigger: item, start: 'top center+=200' },
            })
            blogTl.to(item, { x: 0, opacity: 1, ease: 'power2.out', duration: 1.5 })
          })
        } else {
          gsap.to('.blog__animation .blog__item', {
            scrollTrigger: {
              trigger: '.blog__animation .blog__item',
              start: 'top center+=300',
            },
            x: 0,
            opacity: 1,
            ease: 'power2.out',
            duration: 2,
            stagger: { each: 0.3 },
          })
        }
      })
      return () => tHero.revert()
    }
  }, [])

  return (
    <section className="blog__area-6 blog__animation">
      <div className="container g-0 line pt-110 pb-110">
        <span className="line-3"></span>
        <div className="row pb-130">
          <div className="col-xxl-8 col-xl-7 col-lg-6 col-md-6">
            <div className="sec-title-wrapper">
              <h2 className="sec-title-2 animation__char_come" ref={charAnim}>
                {lang === 'fr' ? 'Nous pensons toujours' : 'We always think'}
              </h2>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-6">
            <div className="blog__text">
              <p>
                {lang === 'fr'
                  ? "Créer de nouvelles marques, des systèmes visuels uniques et des expériences digitales."
                  : 'Crafting new bright brands, unique visual systems and digital experiences.'}
              </p>
            </div>
          </div>
        </div>

        <div className="row reset-grid">
          {posts.map((post) => (
            <div key={post.id} className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
              <BlogCard post={post} lang={lang} />
            </div>
          ))}
          {posts.length === 0 && (
            <div className="col-12 text-center py-5">
              <p>{lang === 'fr' ? 'Aucun article publié.' : 'No articles published yet.'}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Blog1
```

- [ ] **Step 2: Commit**

```bash
git add src/components/blog/Blog1.jsx
git commit -m "feat: make Blog1 dynamic with posts prop and bilingual support"
```

---

### Task 14: Public blog listing page with ISR

**Files:**
- Create: `src/pages/blog/index.jsx`
- Note: The existing `src/pages/blog.jsx` must be deleted after this file is created (Next.js conflict).

- [ ] **Step 1: Create `src/pages/blog/index.jsx`**

```jsx
import Head from 'next/head'
import { useRouter } from 'next/router'
import RootLayout from '@/components/common/layout/RootLayout'
import Blog1 from '@/components/blog/Blog1'
import DigitalAgencyCTA from '@/components/cta/DigitalAgencyCTA'
import prisma from '@/lib/prisma'

export default function BlogPage({ posts, lang }) {
  return (
    <>
      <Head>
        <title>{lang === 'fr' ? 'Blog — Nova Impact' : 'Blog — Nova Impact'}</title>
        <meta
          name="description"
          content={
            lang === 'fr'
              ? 'Découvrez nos articles sur le marketing digital, le SEO, et la création de contenu.'
              : 'Discover our articles on digital marketing, SEO, and content creation.'
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Blog',
              name: 'Nova Impact Blog',
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
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
  )
}

export async function getStaticProps() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      titleFr: true,
      titleEn: true,
      excerptFr: true,
      excerptEn: true,
      coverImage: true,
      category: true,
      tags: true,
      publishedAt: true,
      updatedAt: true,
    },
  })

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      lang: 'fr',
    },
    revalidate: 60,
  }
}
```

- [ ] **Step 2: Delete old static blog page**

```bash
rm src/pages/blog.jsx
rm src/pages/blog-dark.jsx
```

(The dark variant is not used in the Nova Impact layout; keep only the new dynamic page.)

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/
git rm src/pages/blog.jsx src/pages/blog-dark.jsx
git commit -m "feat: replace static blog page with ISR dynamic version"
```

---

### Task 15: Public blog post detail page with ISR + SEO

**Files:**
- Create: `src/pages/blog/[slug].jsx`
- Modify: `src/components/blog/BlogDetails1.jsx`

- [ ] **Step 1: Update `src/components/blog/BlogDetails1.jsx`**

Replace the hardcoded component to accept a `post` and `lang` prop:

```jsx
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import animationWordCome from '@/lib/utils/animationWordCome'

export default function BlogDetails1({ post, lang = 'fr' }) {
  const wordAnim = useRef()
  const wordAnim2 = useRef()

  useEffect(() => {
    animationWordCome(wordAnim.current)
    animationWordCome(wordAnim2.current)
  }, [])

  const title = lang === 'fr' ? post.titleFr : post.titleEn
  const content = lang === 'fr' ? post.contentFr : post.contentEn
  const category = post.category
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : ''

  return (
    <section className="blog__detail">
      <div className="container g-0 line pt-140">
        <span className="line-3"></span>
        <div className="row">
          <div className="col-xxl-8 col-xl-10 offset-xxl-2 offset-xl-1">
            <div className="blog__detail-top">
              <h2 className="blog__detail-date animation__word_come" ref={wordAnim}>
                {category} <span>{date}</span>
              </h2>
              <h3 className="blog__detail-title animation__word_come" ref={wordAnim2}>
                {title}
              </h3>
              <div className="blog__detail-metalist">
                <div className="blog__detail-meta">
                  <p>
                    {lang === 'fr' ? 'Publié par ' : 'Published by '}
                    <span>Nova Impact</span>
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
                  style={{ width: '100%', height: 'auto' }}
                  src={post.coverImage}
                  alt={title}
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
                {post.tags.map((tag) => (
                  <span key={tag} className="badge bg-secondary me-1">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `src/pages/blog/[slug].jsx`**

```jsx
import { useRouter } from 'next/router'
import RootLayout from '@/components/common/layout/RootLayout'
import BlogDetails1 from '@/components/blog/BlogDetails1'
import BlogRelated from '@/components/blog/BlogRelated'
import DigitalAgencyCTA from '@/components/cta/DigitalAgencyCTA'
import BlogSeo from '@/components/blog/BlogSeo'
import prisma from '@/lib/prisma'

export default function BlogPostPage({ post, relatedPosts }) {
  const router = useRouter()
  const lang = router.query.lang === 'en' ? 'en' : 'fr'

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
      <BlogSeo post={post} lang={lang} />
      <main>
        <RootLayout header="header3" footer="footer3">
          <BlogDetails1 post={post} lang={lang} />
          <BlogRelated posts={relatedPosts} lang={lang} />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </>
  )
}

export async function getStaticPaths() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  })

  const paths = posts.flatMap((p) => [
    { params: { slug: p.slug } },
  ])

  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })

  if (!post || post.status !== 'PUBLISHED') {
    return { notFound: true }
  }

  const relatedPosts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      category: post.category,
      NOT: { slug: params.slug },
    },
    take: 3,
    select: {
      id: true, slug: true, titleFr: true, titleEn: true,
      excerptFr: true, excerptEn: true, coverImage: true,
      category: true, publishedAt: true, updatedAt: true,
    },
  })

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      relatedPosts: JSON.parse(JSON.stringify(relatedPosts)),
    },
    revalidate: 60,
  }
}
```

- [ ] **Step 3: Update `BlogRelated` to accept dynamic props**

Open `src/components/blog/BlogRelated.jsx` and check if it uses hardcoded data. If it does, update it to accept `posts` and `lang` props and render `BlogCard` components. If it is already flexible, skip this step.

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/[slug].jsx src/components/blog/BlogDetails1.jsx src/components/blog/BlogRelated.jsx
git commit -m "feat: add ISR blog post detail page with full SEO head and related posts"
```

---

### Task 16: Blog category page with ISR

**Files:**
- Create: `src/pages/blog/category/[category].jsx`
- Note: Delete existing `src/pages/category.jsx` and `src/pages/category-dark.jsx` if they exist and conflict.

- [ ] **Step 1: Create `src/pages/blog/category/[category].jsx`**

```jsx
import Head from 'next/head'
import { useRouter } from 'next/router'
import RootLayout from '@/components/common/layout/RootLayout'
import Blog1 from '@/components/blog/Blog1'
import DigitalAgencyCTA from '@/components/cta/DigitalAgencyCTA'
import prisma from '@/lib/prisma'

export default function CategoryPage({ posts, category }) {
  const router = useRouter()
  const lang = router.query.lang === 'en' ? 'en' : 'fr'

  return (
    <>
      <Head>
        <title>{`${category} — Nova Impact Blog`}</title>
        <meta name="description" content={`Articles sur ${category} — Nova Impact`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <Blog1 posts={posts} lang={lang} />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </>
  )
}

export async function getStaticPaths() {
  const categories = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { category: true },
    distinct: ['category'],
  })

  const paths = categories.map((c) => ({ params: { category: c.category } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED', category: params.category },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true, slug: true, titleFr: true, titleEn: true,
      excerptFr: true, excerptEn: true, coverImage: true,
      category: true, tags: true, publishedAt: true, updatedAt: true,
    },
  })

  if (posts.length === 0) return { notFound: true }

  return {
    props: { posts: JSON.parse(JSON.stringify(posts)), category: params.category },
    revalidate: 60,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/category/
git commit -m "feat: add ISR category listing page"
```

---

### Task 17: On-demand ISR revalidation API

**Files:**
- Create: `src/pages/api/revalidate.js`

- [ ] **Step 1: Create `src/pages/api/revalidate.js`**

This is called internally by admin API routes on publish/update — not exposed publicly.

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { paths } = req.body
  if (!Array.isArray(paths)) return res.status(400).json({ error: 'paths must be an array' })

  try {
    await Promise.all(paths.map((p) => res.revalidate(p)))
    res.status(200).json({ revalidated: paths })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/api/revalidate.js
git commit -m "feat: add on-demand ISR revalidation API"
```

---

## Phase 3: Admin Dashboard

### Task 18: Admin login page

**Files:**
- Create: `src/pages/admin/login.jsx`

- [ ] **Step 1: Create `src/pages/admin/login.jsx`**

```jsx
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Email ou mot de passe incorrect.')
    } else {
      router.push('/admin')
    }
  }

  return (
    <>
      <Head>
        <title>Admin — Nova Impact</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow-sm" style={{ width: '100%', maxWidth: 400 }}>
          <div className="card-body p-4">
            <h1 className="h4 mb-4 text-center">Nova Impact Admin</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/login.jsx
git commit -m "feat: add admin login page with NextAuth credentials"
```

---

### Task 19: AdminLayout component

**Files:**
- Create: `src/components/admin/AdminLayout.jsx`

- [ ] **Step 1: Create `src/components/admin/AdminLayout.jsx`**

```jsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import Head from 'next/head'

export default function AdminLayout({ children, title = 'Admin' }) {
  const router = useRouter()

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'fa-gauge' },
    { href: '/admin/posts', label: 'Articles', icon: 'fa-newspaper' },
    { href: '/admin/uploads', label: 'Médias', icon: 'fa-images' },
    { href: '/admin/contacts', label: 'Contacts', icon: 'fa-envelope' },
    { href: '/admin/newsletter', label: 'Newsletter', icon: 'fa-paper-plane' },
    { href: '/admin/settings', label: 'Paramètres', icon: 'fa-gear' },
  ]

  return (
    <>
      <Head>
        <title>{title} — Nova Impact Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="d-flex" style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <nav
          className="d-flex flex-column bg-dark text-white p-3"
          style={{ width: 220, minHeight: '100vh', flexShrink: 0 }}
        >
          <div className="mb-4">
            <span className="fw-bold fs-5">Nova Impact</span>
            <div className="text-muted small">Admin</div>
          </div>
          <ul className="nav flex-column gap-1 flex-grow-1">
            {navItems.map(({ href, label, icon }) => (
              <li key={href} className="nav-item">
                <Link
                  href={href}
                  className={`nav-link text-white d-flex align-items-center gap-2 rounded px-2 py-1 ${
                    router.pathname === href || router.pathname.startsWith(href + '/')
                      ? 'bg-secondary'
                      : ''
                  }`}
                >
                  <i className={`fa-solid ${icon}`} style={{ width: 18 }}></i>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            className="btn btn-outline-light btn-sm mt-4"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
          >
            <i className="fa-solid fa-right-from-bracket me-2"></i>
            Déconnexion
          </button>
        </nav>

        {/* Main content */}
        <main className="flex-grow-1 bg-light p-4">
          {children}
        </main>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/AdminLayout.jsx
git commit -m "feat: add admin sidebar layout with Bootstrap 5"
```

---

### Task 20: Admin dashboard home page

**Files:**
- Create: `src/pages/admin/index.jsx`

- [ ] **Step 1: Create `src/pages/admin/index.jsx`**

```jsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import AdminLayout from '@/components/admin/AdminLayout'
import prisma from '@/lib/prisma'

export default function AdminDashboard({ stats }) {
  const cards = [
    { label: 'Articles publiés', value: stats.published, icon: 'fa-newspaper', color: 'success' },
    { label: 'Brouillons', value: stats.drafts, icon: 'fa-pen', color: 'warning' },
    { label: 'Médias', value: stats.uploads, icon: 'fa-images', color: 'info' },
    { label: 'Contacts non lus', value: stats.unreadContacts, icon: 'fa-envelope', color: 'danger' },
    { label: 'Abonnés actifs', value: stats.activeSubscribers, icon: 'fa-paper-plane', color: 'primary' },
  ]

  return (
    <AdminLayout title="Dashboard">
      <h1 className="h3 mb-4">Dashboard</h1>
      <div className="row g-3">
        {cards.map(({ label, value, icon, color }) => (
          <div key={label} className="col-md-4 col-lg-3">
            <div className={`card border-${color}`}>
              <div className="card-body d-flex align-items-center gap-3">
                <i className={`fa-solid ${icon} text-${color} fs-3`}></i>
                <div>
                  <div className="fw-bold fs-4">{value}</div>
                  <div className="text-muted small">{label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return { redirect: { destination: '/admin/login', permanent: false } }
  }

  const [published, drafts, uploads, unreadContacts, activeSubscribers] = await Promise.all([
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
    prisma.upload.count(),
    prisma.contactSubmission.count({ where: { isRead: false } }),
    prisma.subscriber.count({ where: { status: 'ACTIVE' } }),
  ])

  return {
    props: { stats: { published, drafts, uploads, unreadContacts, activeSubscribers } },
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/index.jsx
git commit -m "feat: add admin dashboard home with live stats cards"
```

---

### Task 21: Admin posts API routes (CRUD)

**Files:**
- Create: `src/pages/api/admin/posts/index.js`
- Create: `src/pages/api/admin/posts/[id].js`

- [ ] **Step 1: Create `src/pages/api/admin/posts/index.js`**

```js
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { slugify } from '@/lib/slugify-post'

export default async function handler(req, res) {
  const session = await requireAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, slug: true, titleFr: true, titleEn: true,
        status: true, category: true, publishedAt: true, createdAt: true,
      },
    })
    return res.status(200).json({ posts })
  }

  if (req.method === 'POST') {
    const {
      titleFr, titleEn, excerptFr, excerptEn, contentFr, contentEn,
      coverImage, ogImageUrl, category, tags, status, publishedAt,
      metaTitleFr, metaTitleEn, metaDescFr, metaDescEn,
      focusKeywordFr, focusKeywordEn, canonicalUrl, noIndex,
      schemaType, schemaOverrides, slug: rawSlug,
    } = req.body

    if (!titleFr || !titleEn || !category) {
      return res.status(400).json({ error: 'titleFr, titleEn, and category are required' })
    }

    const slug = rawSlug || slugify(titleFr)

    // Check slug uniqueness
    const existing = await prisma.post.findUnique({ where: { slug } })
    if (existing) {
      return res.status(400).json({ error: `Slug "${slug}" already in use` })
    }

    const post = await prisma.post.create({
      data: {
        slug, titleFr, titleEn,
        excerptFr: excerptFr || '', excerptEn: excerptEn || '',
        contentFr: contentFr || '', contentEn: contentEn || '',
        coverImage: coverImage || null, ogImageUrl: ogImageUrl || null,
        category, tags: tags || [],
        status: status || 'DRAFT',
        publishedAt: status === 'PUBLISHED' ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
        metaTitleFr, metaTitleEn, metaDescFr, metaDescEn,
        focusKeywordFr, focusKeywordEn, canonicalUrl,
        noIndex: noIndex || false,
        schemaType: schemaType || 'Article',
        schemaOverrides: schemaOverrides || null,
      },
    })

    // Trigger ISR revalidation
    if (post.status === 'PUBLISHED') {
      try {
        await fetch(`${process.env.NEXTAUTH_URL}/api/revalidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths: ['/blog', `/blog/${post.slug}`] }),
        })
      } catch (_) {}
    }

    return res.status(201).json({ post })
  }

  res.status(405).end()
}
```

- [ ] **Step 2: Create `src/pages/api/admin/posts/[id].js`**

```js
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { slugify } from '@/lib/slugify-post'

export default async function handler(req, res) {
  const session = await requireAdmin(req, res)
  if (!session) return

  const { id } = req.query

  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) return res.status(404).json({ error: 'Post not found' })

  if (req.method === 'GET') {
    return res.status(200).json({ post })
  }

  if (req.method === 'PUT') {
    const body = req.body
    const wasPublished = post.status === 'PUBLISHED'
    const willPublish = body.status === 'PUBLISHED'

    const updated = await prisma.post.update({
      where: { id },
      data: {
        titleFr: body.titleFr,
        titleEn: body.titleEn,
        excerptFr: body.excerptFr,
        excerptEn: body.excerptEn,
        contentFr: body.contentFr,
        contentEn: body.contentEn,
        coverImage: body.coverImage || null,
        ogImageUrl: body.ogImageUrl || null,
        category: body.category,
        tags: body.tags || [],
        status: body.status,
        publishedAt:
          willPublish && !post.publishedAt
            ? new Date()
            : body.publishedAt
            ? new Date(body.publishedAt)
            : post.publishedAt,
        metaTitleFr: body.metaTitleFr,
        metaTitleEn: body.metaTitleEn,
        metaDescFr: body.metaDescFr,
        metaDescEn: body.metaDescEn,
        focusKeywordFr: body.focusKeywordFr,
        focusKeywordEn: body.focusKeywordEn,
        canonicalUrl: body.canonicalUrl,
        noIndex: body.noIndex || false,
        schemaType: body.schemaType || 'Article',
        schemaOverrides: body.schemaOverrides || null,
      },
    })

    // Trigger ISR for published posts
    if (willPublish || wasPublished) {
      try {
        await fetch(`${process.env.NEXTAUTH_URL}/api/revalidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths: ['/blog', `/blog/${updated.slug}`] }),
        })
      } catch (_) {}
    }

    return res.status(200).json({ post: updated })
  }

  if (req.method === 'DELETE') {
    await prisma.post.delete({ where: { id } })
    // Revalidate blog listing
    try {
      await fetch(`${process.env.NEXTAUTH_URL}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/blog'] }),
      })
    } catch (_) {}
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/admin/posts/
git commit -m "feat: add admin posts CRUD API with ISR revalidation on publish"
```

---

### Task 22: Admin upload API routes

**Files:**
- Create: `src/pages/api/admin/uploads/index.js`
- Create: `src/pages/api/admin/uploads/[id].js`

- [ ] **Step 1: Disable Next.js body parser for upload route**

Multer needs raw request body. Create `src/pages/api/admin/uploads/index.js`:

```js
import { upload } from '@/lib/upload'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import path from 'path'
import fs from 'fs'

export const config = { api: { bodyParser: false } }

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) reject(result)
      else resolve(result)
    })
  })
}

export default async function handler(req, res) {
  const session = await requireAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    const uploads = await prisma.upload.findMany({ orderBy: { createdAt: 'desc' } })
    return res.status(200).json({ uploads })
  }

  if (req.method === 'POST') {
    try {
      await runMiddleware(req, res, upload.single('file'))
    } catch (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large. Max 5MB.' })
      }
      return res.status(400).json({ error: err.message })
    }

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

    const record = await prisma.upload.create({
      data: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
    })

    return res.status(201).json({ upload: record })
  }

  res.status(405).end()
}
```

- [ ] **Step 2: Create `src/pages/api/admin/uploads/[id].js`**

```js
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  const session = await requireAdmin(req, res)
  if (!session) return

  const { id } = req.query

  if (req.method === 'DELETE') {
    const upload = await prisma.upload.findUnique({ where: { id } })
    if (!upload) return res.status(404).json({ error: 'Upload not found' })

    // Delete file from disk
    const filePath = path.join(process.cwd(), 'public', upload.path)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

    await prisma.upload.delete({ where: { id } })
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/admin/uploads/
git commit -m "feat: add admin upload API with multer file validation and DB tracking"
```

---

### Task 23: Post editor components

**Files:**
- Create: `src/components/admin/PostEditor/GeneralTab.jsx`
- Create: `src/components/admin/PostEditor/SeoTab.jsx`
- Create: `src/components/admin/PostEditor/SchemaTab.jsx`

- [ ] **Step 1: Create `src/components/admin/PostEditor/GeneralTab.jsx`**

```jsx
import { slugify } from '@/lib/slugify-post'

export default function GeneralTab({ form, setForm }) {
  function handleTitleFrBlur() {
    if (!form.slug) {
      setForm((f) => ({ ...f, slug: slugify(f.titleFr) }))
    }
  }

  return (
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label fw-semibold">Titre (FR) *</label>
        <input
          className="form-control"
          value={form.titleFr}
          onChange={(e) => setForm((f) => ({ ...f, titleFr: e.target.value }))}
          onBlur={handleTitleFrBlur}
          required
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Titre (EN) *</label>
        <input
          className="form-control"
          value={form.titleEn}
          onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))}
          required
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Slug</label>
        <input
          className="form-control font-monospace"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
        />
        <div className="form-text">Auto-généré depuis le titre FR</div>
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Catégorie *</label>
        <input
          className="form-control"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          required
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Extrait (FR)</label>
        <textarea
          className="form-control"
          rows={3}
          value={form.excerptFr}
          onChange={(e) => setForm((f) => ({ ...f, excerptFr: e.target.value }))}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Extrait (EN)</label>
        <textarea
          className="form-control"
          rows={3}
          value={form.excerptEn}
          onChange={(e) => setForm((f) => ({ ...f, excerptEn: e.target.value }))}
        />
      </div>
      <div className="col-12">
        <label className="form-label fw-semibold">Contenu (FR)</label>
        <textarea
          className="form-control font-monospace"
          rows={12}
          value={form.contentFr}
          onChange={(e) => setForm((f) => ({ ...f, contentFr: e.target.value }))}
          placeholder="HTML ou Markdown"
        />
      </div>
      <div className="col-12">
        <label className="form-label fw-semibold">Contenu (EN)</label>
        <textarea
          className="form-control font-monospace"
          rows={12}
          value={form.contentEn}
          onChange={(e) => setForm((f) => ({ ...f, contentEn: e.target.value }))}
          placeholder="HTML or Markdown"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Image de couverture (URL)</label>
        <input
          className="form-control"
          value={form.coverImage}
          onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
          placeholder="/uploads/my-image.jpg"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Tags (séparés par des virgules)</label>
        <input
          className="form-control"
          value={form.tags}
          onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
          placeholder="SEO, Marketing, Content"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Statut</label>
        <select
          className="form-select"
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="DRAFT">Brouillon</option>
          <option value="PUBLISHED">Publié</option>
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Date de publication</label>
        <input
          type="datetime-local"
          className="form-control"
          value={form.publishedAt}
          onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/admin/PostEditor/SeoTab.jsx`**

```jsx
function Counter({ value, max, label }) {
  const len = (value || '').length
  const color = len > max ? 'danger' : len > max * 0.85 ? 'warning' : 'success'
  return (
    <div className="form-text">
      {label}: <span className={`text-${color} fw-semibold`}>{len}/{max}</span>
    </div>
  )
}

export default function SeoTab({ form, setForm }) {
  return (
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label fw-semibold">Meta titre (FR)</label>
        <input
          className="form-control"
          value={form.metaTitleFr}
          onChange={(e) => setForm((f) => ({ ...f, metaTitleFr: e.target.value }))}
        />
        <Counter value={form.metaTitleFr} max={60} label="Caractères" />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Meta titre (EN)</label>
        <input
          className="form-control"
          value={form.metaTitleEn}
          onChange={(e) => setForm((f) => ({ ...f, metaTitleEn: e.target.value }))}
        />
        <Counter value={form.metaTitleEn} max={60} label="Characters" />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Meta description (FR)</label>
        <textarea
          className="form-control"
          rows={3}
          value={form.metaDescFr}
          onChange={(e) => setForm((f) => ({ ...f, metaDescFr: e.target.value }))}
        />
        <Counter value={form.metaDescFr} max={160} label="Caractères" />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Meta description (EN)</label>
        <textarea
          className="form-control"
          rows={3}
          value={form.metaDescEn}
          onChange={(e) => setForm((f) => ({ ...f, metaDescEn: e.target.value }))}
        />
        <Counter value={form.metaDescEn} max={160} label="Characters" />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Mot-clé cible (FR)</label>
        <input
          className="form-control"
          value={form.focusKeywordFr}
          onChange={(e) => setForm((f) => ({ ...f, focusKeywordFr: e.target.value }))}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Focus keyword (EN)</label>
        <input
          className="form-control"
          value={form.focusKeywordEn}
          onChange={(e) => setForm((f) => ({ ...f, focusKeywordEn: e.target.value }))}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">URL canonique (optionnel)</label>
        <input
          className="form-control"
          value={form.canonicalUrl}
          onChange={(e) => setForm((f) => ({ ...f, canonicalUrl: e.target.value }))}
          placeholder="https://novaimpact.fr/blog/..."
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Image OG (URL)</label>
        <input
          className="form-control"
          value={form.ogImageUrl}
          onChange={(e) => setForm((f) => ({ ...f, ogImageUrl: e.target.value }))}
          placeholder="Laissez vide pour utiliser l'image de couverture"
        />
      </div>
      <div className="col-12">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="noIndex"
            checked={form.noIndex}
            onChange={(e) => setForm((f) => ({ ...f, noIndex: e.target.checked }))}
          />
          <label className="form-check-label" htmlFor="noIndex">
            Exclure des moteurs de recherche (noindex)
          </label>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/admin/PostEditor/SchemaTab.jsx`**

```jsx
import { useState, useEffect } from 'react'
import { buildSchema } from '@/lib/schema-builder'

const SCHEMA_TYPES = ['Article', 'BlogPosting', 'HowTo', 'FAQPage', 'NewsArticle']

export default function SchemaTab({ form, setForm }) {
  const [overridesError, setOverridesError] = useState('')
  const [mergedPreview, setMergedPreview] = useState(null)

  // Build merged preview whenever form changes
  useEffect(() => {
    const fakePost = {
      ...form,
      publishedAt: form.publishedAt ? new Date(form.publishedAt) : new Date(),
      updatedAt: new Date(),
      schemaOverrides: (() => {
        try {
          return form.schemaOverridesRaw ? JSON.parse(form.schemaOverridesRaw) : null
        } catch {
          return null
        }
      })(),
    }
    setMergedPreview(buildSchema(fakePost, 'fr'))
  }, [form])

  function handleOverridesChange(val) {
    setForm((f) => ({ ...f, schemaOverridesRaw: val }))
    try {
      if (val) JSON.parse(val)
      setOverridesError('')
    } catch {
      setOverridesError('JSON invalide')
    }
  }

  const autoBase = (() => {
    const fakePost = {
      ...form,
      schemaOverrides: null,
      publishedAt: form.publishedAt ? new Date(form.publishedAt) : new Date(),
      updatedAt: new Date(),
    }
    return buildSchema(fakePost, 'fr')
  })()

  return (
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label fw-semibold">Type de schema</label>
        <select
          className="form-select"
          value={form.schemaType}
          onChange={(e) => setForm((f) => ({ ...f, schemaType: e.target.value }))}
        >
          {SCHEMA_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="col-12">
        <label className="form-label fw-semibold">Schema auto-généré (lecture seule)</label>
        <pre
          className="bg-light border rounded p-3 small"
          style={{ maxHeight: 250, overflow: 'auto' }}
        >
          {JSON.stringify(autoBase, null, 2)}
        </pre>
      </div>

      <div className="col-12">
        <label className="form-label fw-semibold">
          Overrides personnalisés (JSON — fusionné avec le schema auto)
        </label>
        <textarea
          className={`form-control font-monospace ${overridesError ? 'is-invalid' : ''}`}
          rows={8}
          value={form.schemaOverridesRaw || ''}
          onChange={(e) => handleOverridesChange(e.target.value)}
          placeholder={'{\n  "author": {\n    "@type": "Person",\n    "name": "John Doe"\n  }\n}'}
        />
        {overridesError && <div className="invalid-feedback">{overridesError}</div>}
      </div>

      {mergedPreview && (
        <div className="col-12">
          <label className="form-label fw-semibold text-success">
            Aperçu fusionné (ce qui sera injecté)
          </label>
          <pre
            className="bg-light border border-success rounded p-3 small"
            style={{ maxHeight: 300, overflow: 'auto' }}
          >
            {JSON.stringify(mergedPreview, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/PostEditor/
git commit -m "feat: add post editor tabs (General, SEO, Schema) with live preview"
```

---

### Task 24: Admin posts list + new/edit pages

**Files:**
- Create: `src/pages/admin/posts/index.jsx`
- Create: `src/pages/admin/posts/new.jsx`
- Create: `src/pages/admin/posts/[id].jsx`

- [ ] **Step 1: Create `src/pages/admin/posts/index.jsx`**

```jsx
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import AdminLayout from '@/components/admin/AdminLayout'
import prisma from '@/lib/prisma'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function AdminPosts({ posts: initialPosts }) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)

  async function handleDelete(id, slug) {
    if (!confirm(`Supprimer l'article "${slug}" ?`)) return
    const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
    if (res.ok) setPosts((p) => p.filter((post) => post.id !== id))
  }

  return (
    <AdminLayout title="Articles">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Articles</h1>
        <Link href="/admin/posts/new" className="btn btn-dark">
          <i className="fa-solid fa-plus me-2"></i>Nouvel article
        </Link>
      </div>
      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Titre (FR)</th>
                <th>Catégorie</th>
                <th>Statut</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/admin/posts/${post.id}`} className="text-decoration-none fw-semibold">
                      {post.titleFr}
                    </Link>
                  </td>
                  <td>{post.category}</td>
                  <td>
                    <span className={`badge ${post.status === 'PUBLISHED' ? 'bg-success' : 'bg-secondary'}`}>
                      {post.status === 'PUBLISHED' ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="text-muted small">
                    {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link href={`/admin/posts/${post.id}`} className="btn btn-sm btn-outline-dark">
                        Éditer
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(post.id, post.slug)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    Aucun article. <Link href="/admin/posts/new">Créer le premier</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return { redirect: { destination: '/admin/login', permanent: false } }
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, slug: true, titleFr: true, category: true, status: true, createdAt: true },
  })

  return { props: { posts: JSON.parse(JSON.stringify(posts)) } }
}
```

- [ ] **Step 2: Create `src/pages/admin/posts/new.jsx`**

```jsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import AdminLayout from '@/components/admin/AdminLayout'
import GeneralTab from '@/components/admin/PostEditor/GeneralTab'
import SeoTab from '@/components/admin/PostEditor/SeoTab'
import SchemaTab from '@/components/admin/PostEditor/SchemaTab'

const EMPTY_FORM = {
  titleFr: '', titleEn: '', slug: '', excerptFr: '', excerptEn: '',
  contentFr: '', contentEn: '', coverImage: '', ogImageUrl: '',
  category: '', tags: '', status: 'DRAFT', publishedAt: '',
  metaTitleFr: '', metaTitleEn: '', metaDescFr: '', metaDescEn: '',
  focusKeywordFr: '', focusKeywordEn: '', canonicalUrl: '', noIndex: false,
  schemaType: 'Article', schemaOverridesRaw: '',
}

export default function NewPost() {
  const router = useRouter()
  const [form, setForm] = useState(EMPTY_FORM)
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    let schemaOverrides = null
    if (form.schemaOverridesRaw) {
      try { schemaOverrides = JSON.parse(form.schemaOverridesRaw) }
      catch { setError('Schema overrides: JSON invalide'); setSaving(false); return }
    }

    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        schemaOverrides,
      }),
    })

    setSaving(false)
    if (res.ok) {
      router.push('/admin/posts')
    } else {
      const data = await res.json()
      setError(data.error || 'Une erreur est survenue')
    }
  }

  return (
    <AdminLayout title="Nouvel article">
      <div className="d-flex align-items-center gap-3 mb-4">
        <a href="/admin/posts" className="btn btn-outline-secondary btn-sm">← Retour</a>
        <h1 className="h3 mb-0">Nouvel article</h1>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <ul className="nav nav-tabs mb-4">
          {['general', 'seo', 'schema'].map((tab) => (
            <li key={tab} className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'general' ? 'Général' : tab === 'seo' ? 'SEO' : 'Schema'}
              </button>
            </li>
          ))}
        </ul>
        {activeTab === 'general' && <GeneralTab form={form} setForm={setForm} />}
        {activeTab === 'seo' && <SeoTab form={form} setForm={setForm} />}
        {activeTab === 'schema' && <SchemaTab form={form} setForm={setForm} />}
        <div className="mt-4 d-flex gap-2">
          <button type="submit" className="btn btn-dark" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button
            type="button"
            className="btn btn-success"
            disabled={saving}
            onClick={() => { setForm((f) => ({ ...f, status: 'PUBLISHED' })); setTimeout(() => document.querySelector('[type=submit]').click(), 50) }}
          >
            Publier
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return { redirect: { destination: '/admin/login', permanent: false } }
  }
  return { props: {} }
}
```

- [ ] **Step 3: Create `src/pages/admin/posts/[id].jsx`**

```jsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import AdminLayout from '@/components/admin/AdminLayout'
import GeneralTab from '@/components/admin/PostEditor/GeneralTab'
import SeoTab from '@/components/admin/PostEditor/SeoTab'
import SchemaTab from '@/components/admin/PostEditor/SchemaTab'
import prisma from '@/lib/prisma'

export default function EditPost({ post: initialPost }) {
  const router = useRouter()
  const [form, setForm] = useState({
    ...initialPost,
    tags: Array.isArray(initialPost.tags) ? initialPost.tags.join(', ') : '',
    publishedAt: initialPost.publishedAt
      ? new Date(initialPost.publishedAt).toISOString().slice(0, 16)
      : '',
    schemaOverridesRaw: initialPost.schemaOverrides
      ? JSON.stringify(initialPost.schemaOverrides, null, 2)
      : '',
  })
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    let schemaOverrides = null
    if (form.schemaOverridesRaw) {
      try { schemaOverrides = JSON.parse(form.schemaOverridesRaw) }
      catch { setError('Schema overrides: JSON invalide'); setSaving(false); return }
    }

    const res = await fetch(`/api/admin/posts/${initialPost.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        schemaOverrides,
      }),
    })

    setSaving(false)
    if (res.ok) {
      setSuccess('Article mis à jour.')
    } else {
      const data = await res.json()
      setError(data.error || 'Erreur lors de la mise à jour')
    }
  }

  return (
    <AdminLayout title="Éditer l'article">
      <div className="d-flex align-items-center gap-3 mb-4">
        <a href="/admin/posts" className="btn btn-outline-secondary btn-sm">← Retour</a>
        <h1 className="h3 mb-0">Éditer : {initialPost.titleFr}</h1>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <ul className="nav nav-tabs mb-4">
          {['general', 'seo', 'schema'].map((tab) => (
            <li key={tab} className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'general' ? 'Général' : tab === 'seo' ? 'SEO' : 'Schema'}
              </button>
            </li>
          ))}
        </ul>
        {activeTab === 'general' && <GeneralTab form={form} setForm={setForm} />}
        {activeTab === 'seo' && <SeoTab form={form} setForm={setForm} />}
        {activeTab === 'schema' && <SchemaTab form={form} setForm={setForm} />}
        <div className="mt-4">
          <button type="submit" className="btn btn-dark" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return { redirect: { destination: '/admin/login', permanent: false } }
  }

  const post = await prisma.post.findUnique({ where: { id: ctx.params.id } })
  if (!post) return { notFound: true }

  return { props: { post: JSON.parse(JSON.stringify(post)) } }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/posts/
git commit -m "feat: add admin posts list, new, and edit pages with 3-tab editor"
```

---

### Task 25: Admin uploads page

**Files:**
- Create: `src/pages/admin/uploads/index.jsx`

- [ ] **Step 1: Create `src/pages/admin/uploads/index.jsx`**

```jsx
import { useState, useRef } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import AdminLayout from '@/components/admin/AdminLayout'
import prisma from '@/lib/prisma'
import Image from 'next/image'

export default function AdminUploads({ uploads: initialUploads }) {
  const [uploads, setUploads] = useState(initialUploads)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/uploads', { method: 'POST', body: fd })
    setUploading(false)
    if (res.ok) {
      const { upload } = await res.json()
      setUploads((u) => [upload, ...u])
    } else {
      const data = await res.json()
      setError(data.error || 'Erreur upload')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette image ?')) return
    const res = await fetch(`/api/admin/uploads/${id}`, { method: 'DELETE' })
    if (res.ok) setUploads((u) => u.filter((up) => up.id !== id))
  }

  return (
    <AdminLayout title="Médias">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Médiathèque</h1>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="d-none"
            onChange={handleUpload}
          />
          <button
            className="btn btn-dark"
            onClick={() => fileRef.current.click()}
            disabled={uploading}
          >
            <i className="fa-solid fa-upload me-2"></i>
            {uploading ? 'Upload...' : 'Uploader une image'}
          </button>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3">
        {uploads.map((up) => (
          <div key={up.id} className="col-6 col-md-4 col-lg-3">
            <div className="card h-100">
              <div style={{ position: 'relative', height: 160, background: '#f0f0f0' }}>
                <Image
                  src={up.path}
                  alt={up.filename}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="card-body p-2">
                <div className="small text-muted text-truncate">{up.filename}</div>
                <div className="small text-muted">{(up.size / 1024).toFixed(0)} KB</div>
                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-sm btn-outline-secondary flex-grow-1"
                    onClick={() => navigator.clipboard.writeText(up.path)}
                    title="Copier le chemin"
                  >
                    <i className="fa-solid fa-copy"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(up.id)}
                    title="Supprimer"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {uploads.length === 0 && (
          <div className="col-12 text-center text-muted py-5">Aucun média uploadé.</div>
        )}
      </div>
    </AdminLayout>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return { redirect: { destination: '/admin/login', permanent: false } }
  }

  const uploads = await prisma.upload.findMany({ orderBy: { createdAt: 'desc' } })
  return { props: { uploads: JSON.parse(JSON.stringify(uploads)) } }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/uploads/
git commit -m "feat: add admin uploads page with image grid, upload, copy path, and delete"
```

---

## Phase 4: Contacts & Newsletter

### Task 26: Update contact API to save to DB

**Files:**
- Modify: `src/pages/api/contact.js`

- [ ] **Step 1: Update `src/pages/api/contact.js`**

The existing file sends email via nodemailer. Add DB save and keep email sending:

```js
import prisma from '@/lib/prisma'
import transporter from '@/lib/mailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, phone, subject, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required' })
  }

  // Save to database
  await prisma.contactSubmission.create({
    data: { name, email, phone: phone || null, subject: subject || null, message },
  })

  // Send email notification (non-blocking — don't fail submission if email fails)
  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SMTP_FROM_EMAIL,
      replyTo: email,
      subject: `[Contact] ${subject || name}`,
      html: `
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone || '—'}</p>
        <p><strong>Sujet:</strong> ${subject || '—'}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `,
    })
  } catch (err) {
    console.error('Failed to send contact email:', err.message)
  }

  res.status(200).json({ success: true })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/api/contact.js
git commit -m "feat: update contact API to save submissions to DB alongside SMTP"
```

---

### Task 27: Admin contacts API + page

**Files:**
- Create: `src/pages/api/admin/contacts/index.js`
- Create: `src/pages/api/admin/contacts/[id].js`
- Create: `src/pages/admin/contacts/index.jsx`

- [ ] **Step 1: Create `src/pages/api/admin/contacts/index.js`**

```js
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export default async function handler(req, res) {
  const session = await requireAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    const contacts = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return res.status(200).json({ contacts })
  }

  res.status(405).end()
}
```

- [ ] **Step 2: Create `src/pages/api/admin/contacts/[id].js`**

```js
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export default async function handler(req, res) {
  const session = await requireAdmin(req, res)
  if (!session) return

  const { id } = req.query
  const contact = await prisma.contactSubmission.findUnique({ where: { id } })
  if (!contact) return res.status(404).json({ error: 'Not found' })

  if (req.method === 'PUT') {
    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: { isRead: req.body.isRead ?? contact.isRead },
    })
    return res.status(200).json({ contact: updated })
  }

  if (req.method === 'DELETE') {
    await prisma.contactSubmission.delete({ where: { id } })
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
```

- [ ] **Step 3: Create `src/pages/admin/contacts/index.jsx`**

```jsx
import { useState } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import AdminLayout from '@/components/admin/AdminLayout'
import prisma from '@/lib/prisma'

export default function AdminContacts({ contacts: initial }) {
  const [contacts, setContacts] = useState(initial)
  const [expanded, setExpanded] = useState(null)

  async function markRead(id, isRead) {
    await fetch(`/api/admin/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead }),
    })
    setContacts((c) => c.map((ct) => ct.id === id ? { ...ct, isRead } : ct))
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce message ?')) return
    await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' })
    setContacts((c) => c.filter((ct) => ct.id !== id))
    if (expanded === id) setExpanded(null)
  }

  return (
    <AdminLayout title="Contacts">
      <h1 className="h3 mb-4">
        Contacts{' '}
        <span className="badge bg-danger ms-2">
          {contacts.filter((c) => !c.isRead).length} non lus
        </span>
      </h1>
      <div className="card">
        <div className="list-group list-group-flush">
          {contacts.map((ct) => (
            <div
              key={ct.id}
              className={`list-group-item ${!ct.isRead ? 'bg-light fw-semibold' : ''}`}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div
                  className="flex-grow-1"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setExpanded(expanded === ct.id ? null : ct.id)
                    if (!ct.isRead) markRead(ct.id, true)
                  }}
                >
                  <div>{ct.name} — <span className="text-muted">{ct.email}</span></div>
                  <div className="small text-muted">{ct.subject || 'Pas de sujet'} · {new Date(ct.createdAt).toLocaleDateString('fr-FR')}</div>
                </div>
                <div className="d-flex gap-2 ms-3">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => markRead(ct.id, !ct.isRead)}
                    title={ct.isRead ? 'Marquer non lu' : 'Marquer lu'}
                  >
                    <i className={`fa-solid ${ct.isRead ? 'fa-envelope' : 'fa-envelope-open'}`}></i>
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(ct.id)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
              {expanded === ct.id && (
                <div className="mt-2 p-3 bg-white border rounded small">
                  <strong>Message:</strong>
                  <p className="mb-0 mt-1" style={{ whiteSpace: 'pre-wrap' }}>{ct.message}</p>
                  {ct.phone && <p className="mt-1 mb-0 text-muted">Tél: {ct.phone}</p>}
                </div>
              )}
            </div>
          ))}
          {contacts.length === 0 && (
            <div className="list-group-item text-center text-muted py-4">Aucun message reçu.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return { redirect: { destination: '/admin/login', permanent: false } }
  }

  const contacts = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return { props: { contacts: JSON.parse(JSON.stringify(contacts)) } }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/api/admin/contacts/ src/pages/admin/contacts/
git commit -m "feat: add contacts admin API and page with read/unread and delete"
```

---

### Task 28: Newsletter subscribe API + widget

**Files:**
- Create: `src/pages/api/newsletter/subscribe.js`
- Create: `src/components/blog/NewsletterWidget.jsx`

- [ ] **Step 1: Create `src/pages/api/newsletter/subscribe.js`**

```js
import prisma from '@/lib/prisma'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email } = req.body
  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Email invalide' })
  }

  const existing = await prisma.subscriber.findUnique({ where: { email } })

  if (existing) {
    if (existing.status === 'ACTIVE') {
      return res.status(200).json({ success: true, message: 'Déjà inscrit' })
    }
    // Re-subscribe
    await prisma.subscriber.update({
      where: { email },
      data: { status: 'ACTIVE', unsubscribedAt: null },
    })
    return res.status(200).json({ success: true })
  }

  await prisma.subscriber.create({ data: { email } })
  res.status(201).json({ success: true })
}
```

- [ ] **Step 2: Create `src/components/blog/NewsletterWidget.jsx`**

```jsx
import { useState } from 'react'

export default function NewsletterWidget({ lang = 'fr' }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (res.ok) {
      setStatus('success')
      setEmail('')
      setMessage(lang === 'fr' ? 'Merci pour votre inscription !' : 'Thank you for subscribing!')
    } else {
      const data = await res.json()
      setStatus('error')
      setMessage(data.error || (lang === 'fr' ? 'Une erreur est survenue.' : 'An error occurred.'))
    }
  }

  return (
    <div className="newsletter-widget">
      <h5>{lang === 'fr' ? 'Restez informé' : 'Stay informed'}</h5>
      <p className="small text-muted">
        {lang === 'fr'
          ? 'Recevez nos derniers articles directement dans votre boîte mail.'
          : 'Get our latest articles directly in your inbox.'}
      </p>
      {status === 'success' ? (
        <div className="alert alert-success py-2">{message}</div>
      ) : (
        <form onSubmit={handleSubmit} className="d-flex gap-2">
          <input
            type="email"
            className="form-control"
            placeholder={lang === 'fr' ? 'Votre email' : 'Your email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-dark" disabled={status === 'loading'}>
            {status === 'loading' ? '...' : lang === 'fr' ? "S'inscrire" : 'Subscribe'}
          </button>
        </form>
      )}
      {status === 'error' && <div className="text-danger small mt-1">{message}</div>}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/newsletter/ src/components/blog/NewsletterWidget.jsx
git commit -m "feat: add newsletter subscribe API and widget component"
```

---

### Task 29: Admin newsletter API + page with broadcast

**Files:**
- Create: `src/pages/api/admin/newsletter/index.js`
- Create: `src/pages/api/admin/newsletter/[id].js`
- Create: `src/pages/api/admin/newsletter/broadcast.js`
- Create: `src/pages/admin/newsletter/index.jsx`

- [ ] **Step 1: Create `src/pages/api/admin/newsletter/index.js`**

```js
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export default async function handler(req, res) {
  const session = await requireAdmin(req, res)
  if (!session) return

  if (req.method === 'GET') {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    })
    return res.status(200).json({ subscribers })
  }

  res.status(405).end()
}
```

- [ ] **Step 2: Create `src/pages/api/admin/newsletter/[id].js`**

```js
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export default async function handler(req, res) {
  const session = await requireAdmin(req, res)
  if (!session) return

  const { id } = req.query

  if (req.method === 'DELETE') {
    const sub = await prisma.subscriber.findUnique({ where: { id } })
    if (!sub) return res.status(404).json({ error: 'Not found' })
    await prisma.subscriber.delete({ where: { id } })
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
```

- [ ] **Step 3: Create `src/pages/api/admin/newsletter/broadcast.js`**

```js
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import transporter from '@/lib/mailer'

export default async function handler(req, res) {
  const session = await requireAdmin(req, res)
  if (!session) return

  if (req.method !== 'POST') return res.status(405).end()

  const { subject, body } = req.body
  if (!subject || !body) {
    return res.status(400).json({ error: 'subject and body are required' })
  }

  const subscribers = await prisma.subscriber.findMany({
    where: { status: 'ACTIVE' },
    select: { email: true },
  })

  if (subscribers.length === 0) {
    return res.status(200).json({ sent: 0, message: 'No active subscribers' })
  }

  const emails = subscribers.map((s) => s.email)

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      bcc: emails, // BCC to protect subscriber privacy
      subject,
      html: body.replace(/\n/g, '<br/>'),
    })
  } catch (err) {
    return res.status(500).json({ error: `Email send failed: ${err.message}` })
  }

  res.status(200).json({ sent: emails.length })
}
```

- [ ] **Step 4: Create `src/pages/admin/newsletter/index.jsx`**

```jsx
import { useState } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import AdminLayout from '@/components/admin/AdminLayout'
import prisma from '@/lib/prisma'

export default function AdminNewsletter({ subscribers: initial }) {
  const [subscribers, setSubscribers] = useState(initial)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function handleDelete(id) {
    if (!confirm('Supprimer cet abonné ?')) return
    await fetch(`/api/admin/newsletter/${id}`, { method: 'DELETE' })
    setSubscribers((s) => s.filter((sub) => sub.id !== id))
  }

  async function handleBroadcast(e) {
    e.preventDefault()
    setSending(true)
    setError('')
    setResult(null)
    const res = await fetch('/api/admin/newsletter/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, body }),
    })
    setSending(false)
    if (res.ok) {
      const data = await res.json()
      setResult(`Email envoyé à ${data.sent} abonné(s).`)
      setSubject('')
      setBody('')
    } else {
      const data = await res.json()
      setError(data.error || 'Erreur envoi')
    }
  }

  const active = subscribers.filter((s) => s.status === 'ACTIVE')

  return (
    <AdminLayout title="Newsletter">
      <h1 className="h3 mb-4">Newsletter</h1>
      <div className="row g-4">
        {/* Subscribers list */}
        <div className="col-lg-7">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Abonnés ({active.length} actifs)</span>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Email</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.id}>
                      <td>{sub.email}</td>
                      <td>
                        <span className={`badge ${sub.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                          {sub.status === 'ACTIVE' ? 'Actif' : 'Désabonné'}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {new Date(sub.subscribedAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(sub.id)}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {subscribers.length === 0 && (
                    <tr><td colSpan={4} className="text-center text-muted py-3">Aucun abonné.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Broadcast composer */}
        <div className="col-lg-5">
          <div className="card">
            <div className="card-header fw-semibold">
              Envoyer un email ({active.length} destinataires)
            </div>
            <div className="card-body">
              {result && <div className="alert alert-success">{result}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleBroadcast}>
                <div className="mb-3">
                  <label className="form-label">Sujet</label>
                  <input
                    className="form-control"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Message (HTML accepté)</label>
                  <textarea
                    className="form-control"
                    rows={8}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-dark w-100" disabled={sending || active.length === 0}>
                  {sending ? 'Envoi en cours...' : `Envoyer à ${active.length} abonné(s)`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return { redirect: { destination: '/admin/login', permanent: false } }
  }

  const subscribers = await prisma.subscriber.findMany({ orderBy: { subscribedAt: 'desc' } })
  return { props: { subscribers: JSON.parse(JSON.stringify(subscribers)) } }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/api/admin/newsletter/ src/pages/admin/newsletter/
git commit -m "feat: add newsletter admin API (list, delete, broadcast) and admin page"
```

---

## Phase 5: Seeding

### Task 30: Prisma seed script

**Files:**
- Create: `prisma/seed.js`
- Modify: `package.json` (add prisma.seed config)

- [ ] **Step 1: Add seed config to `package.json`**

Add to `package.json` (at top level, not inside `scripts`):

```json
"prisma": {
  "seed": "node prisma/seed.js"
}
```

- [ ] **Step 2: Create `prisma/seed.js`**

```js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // 1. Admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'NovaAdmin2026!', 12)
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@novaimpact.fr' },
    update: {},
    create: {
      name: 'Admin Nova Impact',
      email: process.env.ADMIN_EMAIL || 'admin@novaimpact.fr',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user:', admin.email)

  // 2. Sample posts
  const posts = [
    {
      slug: 'comment-optimiser-votre-seo-en-2026',
      titleFr: 'Comment optimiser votre SEO en 2026',
      titleEn: 'How to optimize your SEO in 2026',
      excerptFr: 'Découvrez les meilleures pratiques SEO pour dominer les résultats de recherche en 2026.',
      excerptEn: 'Discover the best SEO practices to dominate search results in 2026.',
      contentFr: '<h2>Introduction</h2><p>Le SEO évolue constamment. En 2026, les signaux Core Web Vitals et le contenu E-E-A-T sont plus importants que jamais.</p><h2>Les piliers du SEO moderne</h2><p>Un bon SEO repose sur trois piliers : technique, contenu et autorité.</p>',
      contentEn: '<h2>Introduction</h2><p>SEO is constantly evolving. In 2026, Core Web Vitals signals and E-E-A-T content matter more than ever.</p><h2>The pillars of modern SEO</h2><p>Good SEO rests on three pillars: technical, content, and authority.</p>',
      category: 'SEO',
      tags: ['SEO', 'Marketing', 'Google'],
      status: 'PUBLISHED',
      publishedAt: new Date('2026-01-15'),
      coverImage: '/assets/imgs/blog/1.jpg',
      metaTitleFr: 'Optimiser son SEO en 2026 — Guide complet | Nova Impact',
      metaTitleEn: 'Optimize Your SEO in 2026 — Complete Guide | Nova Impact',
      metaDescFr: 'Guide complet pour optimiser votre référencement naturel en 2026. Techniques, outils et stratégies éprouvées par Nova Impact.',
      metaDescEn: 'Complete guide to optimizing your natural SEO in 2026. Techniques, tools and proven strategies by Nova Impact.',
      focusKeywordFr: 'optimiser SEO 2026',
      focusKeywordEn: 'optimize SEO 2026',
      schemaType: 'Article',
    },
    {
      slug: 'strategies-publicite-meta-ads',
      titleFr: 'Les meilleures stratégies pour vos campagnes Meta Ads',
      titleEn: 'The best strategies for your Meta Ads campaigns',
      excerptFr: 'Comment créer des campagnes Meta Ads performantes qui convertissent réellement.',
      excerptEn: 'How to create high-performing Meta Ads campaigns that actually convert.',
      contentFr: '<h2>Ciblage avancé</h2><p>Le ciblage Meta Ads permet d\'atteindre précisément votre audience idéale grâce aux intérêts, comportements et données démographiques.</p>',
      contentEn: '<h2>Advanced targeting</h2><p>Meta Ads targeting lets you reach your ideal audience precisely through interests, behaviors and demographics.</p>',
      category: 'Publicité',
      tags: ['Meta Ads', 'Facebook', 'Instagram', 'ROI'],
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-01'),
      coverImage: '/assets/imgs/blog/2.jpg',
      metaTitleFr: 'Stratégies Meta Ads 2026 | Nova Impact',
      metaTitleEn: 'Meta Ads Strategies 2026 | Nova Impact',
      metaDescFr: 'Maximisez votre ROI avec nos stratégies Meta Ads éprouvées. Ciblage, créatifs et optimisation.',
      metaDescEn: 'Maximize your ROI with our proven Meta Ads strategies. Targeting, creatives and optimization.',
      focusKeywordFr: 'stratégie Meta Ads',
      focusKeywordEn: 'Meta Ads strategy',
      schemaType: 'Article',
    },
    {
      slug: 'importance-identite-visuelle-marque',
      titleFr: "L'importance d'une identité visuelle forte pour votre marque",
      titleEn: 'The importance of a strong visual identity for your brand',
      excerptFr: "Une identité visuelle cohérente renforce la confiance et la reconnaissance de votre marque.",
      excerptEn: 'A consistent visual identity builds trust and recognition for your brand.',
      contentFr: '<h2>Qu\'est-ce que l\'identité visuelle ?</h2><p>L\'identité visuelle comprend le logo, les couleurs, la typographie et tous les éléments graphiques qui représentent votre marque.</p>',
      contentEn: '<h2>What is visual identity?</h2><p>Visual identity includes the logo, colors, typography and all graphic elements that represent your brand.</p>',
      category: 'Branding',
      tags: ['Branding', 'Design', 'Identité visuelle'],
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-20'),
      coverImage: '/assets/imgs/blog/3.jpg',
      metaTitleFr: 'Identité visuelle forte — Pourquoi c\'est crucial | Nova Impact',
      metaTitleEn: 'Strong Visual Identity — Why It Matters | Nova Impact',
      metaDescFr: 'Découvrez pourquoi une identité visuelle cohérente est essentielle pour votre succès commercial.',
      metaDescEn: 'Discover why a consistent visual identity is essential for your business success.',
      focusKeywordFr: 'identité visuelle marque',
      focusKeywordEn: 'brand visual identity',
      schemaType: 'Article',
    },
    {
      slug: 'guide-google-ads-debutants',
      titleFr: 'Guide Google Ads pour débutants : lancer sa première campagne',
      titleEn: 'Google Ads guide for beginners: launching your first campaign',
      excerptFr: 'Tout ce que vous devez savoir pour lancer votre première campagne Google Ads avec succès.',
      excerptEn: 'Everything you need to know to successfully launch your first Google Ads campaign.',
      contentFr: '<h2>Créer votre compte Google Ads</h2><p>La première étape est de créer votre compte sur ads.google.com et de configurer votre facturation.</p>',
      contentEn: '<h2>Creating your Google Ads account</h2><p>The first step is to create your account at ads.google.com and set up your billing.</p>',
      category: 'Publicité',
      tags: ['Google Ads', 'PPC', 'SEM'],
      status: 'PUBLISHED',
      publishedAt: new Date('2026-03-05'),
      coverImage: '/assets/imgs/blog/4.jpg',
      metaTitleFr: 'Guide Google Ads débutants 2026 | Nova Impact',
      metaTitleEn: 'Google Ads Beginners Guide 2026 | Nova Impact',
      metaDescFr: 'Lancez votre première campagne Google Ads avec ce guide pas-à-pas. Conseils d\'experts Nova Impact.',
      metaDescEn: 'Launch your first Google Ads campaign with this step-by-step guide. Expert advice from Nova Impact.',
      focusKeywordFr: 'guide Google Ads débutants',
      focusKeywordEn: 'Google Ads beginners guide',
      schemaType: 'HowTo',
    },
    {
      slug: 'creation-contenu-reseaux-sociaux',
      titleFr: 'Créer du contenu qui engage sur les réseaux sociaux',
      titleEn: 'Creating content that engages on social media',
      excerptFr: 'Les secrets pour créer du contenu viral et engageant sur Instagram, LinkedIn et TikTok.',
      excerptEn: 'The secrets to creating viral and engaging content on Instagram, LinkedIn and TikTok.',
      contentFr: '<h2>Comprendre votre audience</h2><p>Avant de créer du contenu, vous devez comprendre profondément qui est votre audience et ce qui l\'intéresse.</p>',
      contentEn: '<h2>Understanding your audience</h2><p>Before creating content, you need to deeply understand who your audience is and what interests them.</p>',
      category: 'Social Media',
      tags: ['Social Media', 'Content', 'Instagram', 'LinkedIn'],
      status: 'DRAFT',
      publishedAt: null,
      coverImage: '/assets/imgs/blog/5.jpg',
      metaTitleFr: 'Créer du contenu engageant réseaux sociaux | Nova Impact',
      metaTitleEn: 'Create Engaging Social Media Content | Nova Impact',
      metaDescFr: 'Stratégies et astuces pour créer du contenu qui engage votre audience sur les réseaux sociaux.',
      metaDescEn: 'Strategies and tips to create content that engages your audience on social media.',
      focusKeywordFr: 'contenu réseaux sociaux',
      focusKeywordEn: 'social media content',
      schemaType: 'Article',
    },
    {
      slug: 'audit-seo-complet-site-web',
      titleFr: 'Comment réaliser un audit SEO complet de votre site web',
      titleEn: 'How to conduct a complete SEO audit of your website',
      excerptFr: 'Guide méthodique pour auditer votre site web et identifier toutes les opportunités SEO.',
      excerptEn: 'Methodical guide to auditing your website and identifying all SEO opportunities.',
      contentFr: '<h2>Étape 1 : Audit technique</h2><p>L\'audit technique vérifie la structure, la vitesse, l\'indexabilité et les erreurs de votre site.</p>',
      contentEn: '<h2>Step 1: Technical audit</h2><p>The technical audit checks your site\'s structure, speed, indexability and errors.</p>',
      category: 'SEO',
      tags: ['SEO', 'Audit', 'Technique'],
      status: 'PUBLISHED',
      publishedAt: new Date('2026-03-20'),
      coverImage: '/assets/imgs/blog/6.jpg',
      metaTitleFr: 'Audit SEO complet : Guide étape par étape | Nova Impact',
      metaTitleEn: 'Complete SEO Audit: Step-by-Step Guide | Nova Impact',
      metaDescFr: 'Apprenez à réaliser un audit SEO complet de votre site web avec notre guide méthodique.',
      metaDescEn: 'Learn how to conduct a complete SEO audit of your website with our methodical guide.',
      focusKeywordFr: 'audit SEO complet',
      focusKeywordEn: 'complete SEO audit',
      schemaType: 'HowTo',
    },
  ]

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
  }
  console.log(`✅ ${posts.length} posts seeded`)

  // 3. Upload records (point to existing blog images)
  const uploadRecords = [
    { filename: '1.jpg', path: '/assets/imgs/blog/1.jpg', size: 120000, mimeType: 'image/jpeg' },
    { filename: '2.jpg', path: '/assets/imgs/blog/2.jpg', size: 135000, mimeType: 'image/jpeg' },
    { filename: '3.jpg', path: '/assets/imgs/blog/3.jpg', size: 98000, mimeType: 'image/jpeg' },
    { filename: '4.jpg', path: '/assets/imgs/blog/4.jpg', size: 110000, mimeType: 'image/jpeg' },
    { filename: '5.jpg', path: '/assets/imgs/blog/5.jpg', size: 125000, mimeType: 'image/jpeg' },
    { filename: '6.jpg', path: '/assets/imgs/blog/6.jpg', size: 118000, mimeType: 'image/jpeg' },
  ]
  for (const upload of uploadRecords) {
    await prisma.upload.upsert({
      where: { id: upload.filename },
      update: {},
      create: { id: upload.filename, ...upload },
    })
  }
  console.log(`✅ ${uploadRecords.length} upload records seeded`)

  // 4. Contact submissions
  const contacts = [
    { name: 'Marie Dupont', email: 'marie@example.com', phone: '06 12 34 56 78', subject: 'Demande de devis SEO', message: 'Bonjour, je souhaite obtenir un devis pour une prestation SEO pour mon site e-commerce. Pouvez-vous me contacter ?', isRead: false },
    { name: 'Thomas Martin', email: 'thomas@example.fr', phone: null, subject: 'Question sur vos services Meta Ads', message: "Bonjour, j'aimerais en savoir plus sur vos services de gestion de campagnes Meta Ads. Quel est votre budget minimum ?", isRead: true },
    { name: 'Sophie Bernard', email: 'sophie@startup.io', phone: '07 98 76 54 32', subject: 'Partenariat potentiel', message: 'Bonjour, je représente une startup dans le domaine de la fintech et nous cherchons une agence marketing pour nous accompagner dans notre croissance. Seriez-vous intéressés ?', isRead: false },
  ]
  for (const contact of contacts) {
    await prisma.contactSubmission.create({ data: contact })
  }
  console.log(`✅ ${contacts.length} contact submissions seeded`)

  // 5. Newsletter subscribers
  const subscribers = [
    { email: 'marie@example.com', status: 'ACTIVE' },
    { email: 'thomas@example.fr', status: 'ACTIVE' },
    { email: 'jean.pierre@gmail.com', status: 'ACTIVE' },
    { email: 'ancien@gmail.com', status: 'UNSUBSCRIBED', unsubscribedAt: new Date('2026-02-01') },
    { email: 'sophie@startup.io', status: 'ACTIVE' },
  ]
  for (const sub of subscribers) {
    await prisma.subscriber.upsert({
      where: { email: sub.email },
      update: {},
      create: sub,
    })
  }
  console.log(`✅ ${subscribers.length} subscribers seeded`)

  console.log('\n🎉 Seed complete!')
  console.log(`\n🔐 Admin access:\n   Email: ${process.env.ADMIN_EMAIL || 'admin@novaimpact.fr'}\n   Password: (from .env ADMIN_PASSWORD)`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
```

- [ ] **Step 3: Run the seed**

```bash
npx prisma db seed
```

Expected output:
```
✅ Admin user: admin@novaimpact.fr
✅ 6 posts seeded
✅ 6 upload records seeded
✅ 3 contact submissions seeded
✅ 5 subscribers seeded

🎉 Seed complete!

🔐 Admin access:
   Email: admin@novaimpact.fr
   Password: (from .env ADMIN_PASSWORD)
```

- [ ] **Step 4: Commit**

```bash
git add prisma/seed.js package.json
git commit -m "feat: add Prisma seed script with posts, contacts, subscribers, and admin user"
```

---

## Phase 6: Tests

### Task 31: Jest configuration + Prisma mock

**Files:**
- Create: `jest.config.js`
- Create: `src/__tests__/helpers/mockSession.js`
- Create: `prisma/__mocks__/index.js`

- [ ] **Step 1: Create `jest.config.js`**

```js
/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@prisma/client$': '<rootDir>/prisma/__mocks__/prismaClient.js',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
}

module.exports = config
```

- [ ] **Step 2: Create `jest.setup.js`**

```js
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
process.env.ADMIN_EMAIL = 'admin@test.com'
process.env.SMTP_FROM_EMAIL = 'noreply@test.com'
process.env.SMTP_FROM_NAME = 'Test'
```

- [ ] **Step 3: Create `prisma/__mocks__/prismaClient.js`**

This is the Prisma mock — returns jest mock functions for all models used in tests.

```js
const mockPost = {
  findMany: jest.fn(),
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
}

const mockContactSubmission = {
  findMany: jest.fn(),
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
}

const mockSubscriber = {
  findMany: jest.fn(),
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  upsert: jest.fn(),
  count: jest.fn(),
}

const mockUser = {
  findUnique: jest.fn(),
}

const mockUpload = {
  findMany: jest.fn(),
  findUnique: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
}

const prismaMock = {
  post: mockPost,
  contactSubmission: mockContactSubmission,
  subscriber: mockSubscriber,
  user: mockUser,
  upload: mockUpload,
}

module.exports = prismaMock
```

- [ ] **Step 4: Create `src/__tests__/helpers/mockSession.js`**

```js
/**
 * Mocks getServerSession to return a fake admin session.
 * Call at the top of test files that test admin API routes.
 *
 * Usage:
 *   jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }))
 *   import { mockAdminSession } from '../helpers/mockSession'
 *   beforeEach(() => mockAdminSession())
 */
import { getServerSession } from 'next-auth/next'

export function mockAdminSession() {
  getServerSession.mockResolvedValue({
    user: { id: 'admin-id', email: 'admin@test.com', role: 'ADMIN' },
  })
}

export function mockNoSession() {
  getServerSession.mockResolvedValue(null)
}
```

- [ ] **Step 5: Add test script to `package.json`**

Add to `scripts`:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 6: Commit**

```bash
git add jest.config.js jest.setup.js prisma/__mocks__/ src/__tests__/helpers/
git commit -m "test: add Jest config, Prisma mock, and session helper"
```

---

### Task 32: Blog API tests

**Files:**
- Create: `src/__tests__/api/blog/posts.test.js`
- Create: `src/__tests__/api/blog/post.test.js`

- [ ] **Step 1: Create `src/__tests__/api/blog/posts.test.js`**

```js
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/blog/posts'
import prisma from '@/lib/prisma'

jest.mock('@/lib/prisma')

const MOCK_POSTS = [
  {
    id: 'post-1', slug: 'test-article', titleFr: 'Article Test', titleEn: 'Test Article',
    excerptFr: 'Extrait FR', excerptEn: 'Excerpt EN',
    coverImage: '/uploads/test.jpg', category: 'SEO', tags: ['SEO'],
    publishedAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'),
  },
]

describe('GET /api/blog/posts', () => {
  beforeEach(() => {
    prisma.post.findMany.mockResolvedValue(MOCK_POSTS)
    prisma.post.count.mockResolvedValue(1)
  })

  afterEach(() => jest.clearAllMocks())

  it('returns published posts with 200', async () => {
    const { req, res } = createMocks({ method: 'GET' })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.posts).toHaveLength(1)
    expect(data.posts[0].slug).toBe('test-article')
    expect(data.total).toBe(1)
  })

  it('passes category filter to Prisma', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { category: 'SEO' } })
    await handler(req, res)
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: 'PUBLISHED', category: 'SEO' } })
    )
  })

  it('returns 405 for non-GET methods', async () => {
    const { req, res } = createMocks({ method: 'POST' })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(405)
  })
})
```

- [ ] **Step 2: Create `src/__tests__/api/blog/post.test.js`**

```js
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/blog/[slug]'
import prisma from '@/lib/prisma'

jest.mock('@/lib/prisma')

const MOCK_POST = {
  id: 'post-1', slug: 'test-article', titleFr: 'Article Test', titleEn: 'Test Article',
  status: 'PUBLISHED', excerptFr: 'FR', excerptEn: 'EN',
  contentFr: '<p>FR</p>', contentEn: '<p>EN</p>',
  coverImage: null, category: 'SEO', tags: [],
  publishedAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'),
}

describe('GET /api/blog/[slug]', () => {
  afterEach(() => jest.clearAllMocks())

  it('returns a published post by slug', async () => {
    prisma.post.findUnique.mockResolvedValue(MOCK_POST)
    const { req, res } = createMocks({ method: 'GET', query: { slug: 'test-article' } })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.post.slug).toBe('test-article')
  })

  it('returns 404 when post not found', async () => {
    prisma.post.findUnique.mockResolvedValue(null)
    const { req, res } = createMocks({ method: 'GET', query: { slug: 'nonexistent' } })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(404)
  })

  it('returns 404 for draft post', async () => {
    prisma.post.findUnique.mockResolvedValue({ ...MOCK_POST, status: 'DRAFT' })
    const { req, res } = createMocks({ method: 'GET', query: { slug: 'test-article' } })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(404)
  })

  it('returns 405 for non-GET', async () => {
    const { req, res } = createMocks({ method: 'DELETE', query: { slug: 'test-article' } })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(405)
  })
})
```

- [ ] **Step 3: Run tests**

```bash
npm test src/__tests__/api/blog/
```

Expected: All tests pass (PASS).

- [ ] **Step 4: Commit**

```bash
git add src/__tests__/api/blog/
git commit -m "test: add public blog API tests (list and single post)"
```

---

### Task 33: Admin posts API tests

**Files:**
- Create: `src/__tests__/api/admin/posts.test.js`

- [ ] **Step 1: Create `src/__tests__/api/admin/posts.test.js`**

```js
import { createMocks } from 'node-mocks-http'
import indexHandler from '@/pages/api/admin/posts/index'
import idHandler from '@/pages/api/admin/posts/[id]'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'

jest.mock('@/lib/prisma')
jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }))
// Prevent actual fetch calls for ISR revalidation
global.fetch = jest.fn().mockResolvedValue({ ok: true })

const ADMIN_SESSION = { user: { email: 'admin@test.com', role: 'ADMIN' } }
const MOCK_POST = {
  id: 'post-1', slug: 'test-post', titleFr: 'Test FR', titleEn: 'Test EN',
  excerptFr: 'FR', excerptEn: 'EN', contentFr: '', contentEn: '',
  category: 'SEO', tags: [], status: 'DRAFT',
  publishedAt: null, createdAt: new Date(), updatedAt: new Date(),
}

describe('/api/admin/posts (index)', () => {
  afterEach(() => jest.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    getServerSession.mockResolvedValue(null)
    const { req, res } = createMocks({ method: 'GET' })
    await indexHandler(req, res)
    expect(res._getStatusCode()).toBe(401)
  })

  it('lists all posts for admin', async () => {
    getServerSession.mockResolvedValue(ADMIN_SESSION)
    prisma.post.findMany.mockResolvedValue([MOCK_POST])
    const { req, res } = createMocks({ method: 'GET' })
    await indexHandler(req, res)
    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.posts).toHaveLength(1)
  })

  it('creates a post with valid data', async () => {
    getServerSession.mockResolvedValue(ADMIN_SESSION)
    prisma.post.findUnique.mockResolvedValue(null) // slug not taken
    prisma.post.create.mockResolvedValue({ ...MOCK_POST, id: 'new-post' })
    const { req, res } = createMocks({
      method: 'POST',
      body: { titleFr: 'Test FR', titleEn: 'Test EN', category: 'SEO' },
    })
    await indexHandler(req, res)
    expect(res._getStatusCode()).toBe(201)
  })

  it('returns 400 when required fields missing', async () => {
    getServerSession.mockResolvedValue(ADMIN_SESSION)
    const { req, res } = createMocks({ method: 'POST', body: { titleFr: 'Only title' } })
    await indexHandler(req, res)
    expect(res._getStatusCode()).toBe(400)
  })

  it('returns 400 when slug already exists', async () => {
    getServerSession.mockResolvedValue(ADMIN_SESSION)
    prisma.post.findUnique.mockResolvedValue(MOCK_POST) // slug taken
    const { req, res } = createMocks({
      method: 'POST',
      body: { titleFr: 'Test', titleEn: 'Test', category: 'SEO', slug: 'test-post' },
    })
    await indexHandler(req, res)
    expect(res._getStatusCode()).toBe(400)
  })
})

describe('/api/admin/posts/[id]', () => {
  afterEach(() => jest.clearAllMocks())

  it('returns 401 for unauthenticated GET', async () => {
    getServerSession.mockResolvedValue(null)
    const { req, res } = createMocks({ method: 'GET', query: { id: 'post-1' } })
    await idHandler(req, res)
    expect(res._getStatusCode()).toBe(401)
  })

  it('returns a single post by id', async () => {
    getServerSession.mockResolvedValue(ADMIN_SESSION)
    prisma.post.findUnique.mockResolvedValue(MOCK_POST)
    const { req, res } = createMocks({ method: 'GET', query: { id: 'post-1' } })
    await idHandler(req, res)
    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.post.id).toBe('post-1')
  })

  it('returns 404 for unknown id', async () => {
    getServerSession.mockResolvedValue(ADMIN_SESSION)
    prisma.post.findUnique.mockResolvedValue(null)
    const { req, res } = createMocks({ method: 'GET', query: { id: 'nonexistent' } })
    await idHandler(req, res)
    expect(res._getStatusCode()).toBe(404)
  })

  it('deletes a post', async () => {
    getServerSession.mockResolvedValue(ADMIN_SESSION)
    prisma.post.findUnique.mockResolvedValue(MOCK_POST)
    prisma.post.delete.mockResolvedValue(MOCK_POST)
    const { req, res } = createMocks({ method: 'DELETE', query: { id: 'post-1' } })
    await idHandler(req, res)
    expect(res._getStatusCode()).toBe(200)
    expect(prisma.post.delete).toHaveBeenCalledWith({ where: { id: 'post-1' } })
  })
})
```

- [ ] **Step 2: Run tests**

```bash
npm test src/__tests__/api/admin/posts.test.js
```

Expected: All tests pass (PASS).

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/api/admin/posts.test.js
git commit -m "test: add admin posts API tests (CRUD, auth guards, validation)"
```

---

### Task 34: Contacts & newsletter API tests

**Files:**
- Create: `src/__tests__/api/contact.test.js`
- Create: `src/__tests__/api/newsletter/subscribe.test.js`
- Create: `src/__tests__/api/admin/contacts.test.js`
- Create: `src/__tests__/api/admin/newsletter.test.js`

- [ ] **Step 1: Create `src/__tests__/api/contact.test.js`**

```js
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/contact'
import prisma from '@/lib/prisma'
import transporter from '@/lib/mailer'

jest.mock('@/lib/prisma')
jest.mock('@/lib/mailer', () => ({ sendMail: jest.fn().mockResolvedValue({}) }))

describe('POST /api/contact', () => {
  afterEach(() => jest.clearAllMocks())

  it('saves submission and returns 200', async () => {
    prisma.contactSubmission.create.mockResolvedValue({ id: 'c-1' })
    const { req, res } = createMocks({
      method: 'POST',
      body: { name: 'Test', email: 'test@test.com', message: 'Hello' },
    })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(200)
    expect(prisma.contactSubmission.create).toHaveBeenCalledTimes(1)
  })

  it('returns 400 when name is missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { email: 'test@test.com', message: 'Hello' },
    })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(400)
    expect(prisma.contactSubmission.create).not.toHaveBeenCalled()
  })

  it('returns 405 for non-POST', async () => {
    const { req, res } = createMocks({ method: 'GET' })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(405)
  })
})
```

- [ ] **Step 2: Create `src/__tests__/api/newsletter/subscribe.test.js`**

```js
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/newsletter/subscribe'
import prisma from '@/lib/prisma'

jest.mock('@/lib/prisma')

describe('POST /api/newsletter/subscribe', () => {
  afterEach(() => jest.clearAllMocks())

  it('creates a new subscriber', async () => {
    prisma.subscriber.findUnique.mockResolvedValue(null)
    prisma.subscriber.create.mockResolvedValue({ id: 's-1', email: 'test@test.com' })
    const { req, res } = createMocks({ method: 'POST', body: { email: 'test@test.com' } })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(201)
    expect(prisma.subscriber.create).toHaveBeenCalled()
  })

  it('returns 200 if already ACTIVE', async () => {
    prisma.subscriber.findUnique.mockResolvedValue({ id: 's-1', status: 'ACTIVE' })
    const { req, res } = createMocks({ method: 'POST', body: { email: 'test@test.com' } })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(200)
    expect(prisma.subscriber.create).not.toHaveBeenCalled()
  })

  it('resubscribes an UNSUBSCRIBED user', async () => {
    prisma.subscriber.findUnique.mockResolvedValue({ id: 's-1', email: 'test@test.com', status: 'UNSUBSCRIBED' })
    prisma.subscriber.update.mockResolvedValue({ id: 's-1', status: 'ACTIVE' })
    const { req, res } = createMocks({ method: 'POST', body: { email: 'test@test.com' } })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(200)
    expect(prisma.subscriber.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'ACTIVE' }) })
    )
  })

  it('returns 400 for invalid email', async () => {
    const { req, res } = createMocks({ method: 'POST', body: { email: 'not-an-email' } })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(400)
  })
})
```

- [ ] **Step 3: Create `src/__tests__/api/admin/contacts.test.js`**

```js
import { createMocks } from 'node-mocks-http'
import indexHandler from '@/pages/api/admin/contacts/index'
import idHandler from '@/pages/api/admin/contacts/[id]'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'

jest.mock('@/lib/prisma')
jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }))

const ADMIN_SESSION = { user: { role: 'ADMIN' } }
const MOCK_CONTACT = { id: 'c-1', name: 'Test', email: 'test@test.com', message: 'Hello', isRead: false }

describe('/api/admin/contacts', () => {
  afterEach(() => jest.clearAllMocks())

  it('returns 401 if not admin', async () => {
    getServerSession.mockResolvedValue(null)
    const { req, res } = createMocks({ method: 'GET' })
    await indexHandler(req, res)
    expect(res._getStatusCode()).toBe(401)
  })

  it('lists contacts', async () => {
    getServerSession.mockResolvedValue(ADMIN_SESSION)
    prisma.contactSubmission.findMany.mockResolvedValue([MOCK_CONTACT])
    const { req, res } = createMocks({ method: 'GET' })
    await indexHandler(req, res)
    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.contacts).toHaveLength(1)
  })

  it('marks contact as read', async () => {
    getServerSession.mockResolvedValue(ADMIN_SESSION)
    prisma.contactSubmission.findUnique.mockResolvedValue(MOCK_CONTACT)
    prisma.contactSubmission.update.mockResolvedValue({ ...MOCK_CONTACT, isRead: true })
    const { req, res } = createMocks({ method: 'PUT', query: { id: 'c-1' }, body: { isRead: true } })
    await idHandler(req, res)
    expect(res._getStatusCode()).toBe(200)
    expect(prisma.contactSubmission.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { isRead: true } })
    )
  })

  it('deletes a contact', async () => {
    getServerSession.mockResolvedValue(ADMIN_SESSION)
    prisma.contactSubmission.findUnique.mockResolvedValue(MOCK_CONTACT)
    prisma.contactSubmission.delete.mockResolvedValue(MOCK_CONTACT)
    const { req, res } = createMocks({ method: 'DELETE', query: { id: 'c-1' } })
    await idHandler(req, res)
    expect(res._getStatusCode()).toBe(200)
  })

  it('returns 404 for unknown contact id', async () => {
    getServerSession.mockResolvedValue(ADMIN_SESSION)
    prisma.contactSubmission.findUnique.mockResolvedValue(null)
    const { req, res } = createMocks({ method: 'DELETE', query: { id: 'ghost' } })
    await idHandler(req, res)
    expect(res._getStatusCode()).toBe(404)
  })
})
```

- [ ] **Step 4: Create `src/__tests__/api/admin/newsletter.test.js`**

```js
import { createMocks } from 'node-mocks-http'
import broadcastHandler from '@/pages/api/admin/newsletter/broadcast'
import indexHandler from '@/pages/api/admin/newsletter/index'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import transporter from '@/lib/mailer'

jest.mock('@/lib/prisma')
jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }))
jest.mock('@/lib/mailer', () => ({ sendMail: jest.fn().mockResolvedValue({}) }))

const ADMIN_SESSION = { user: { role: 'ADMIN' } }

describe('/api/admin/newsletter/broadcast', () => {
  afterEach(() => jest.clearAllMocks())

  it('returns 401 if not admin', async () => {
    getServerSession.mockResolvedValue(null)
    const { req, res } = createMocks({ method: 'POST' })
    await broadcastHandler(req, res)
    expect(res._getStatusCode()).toBe(401)
  })

  it('sends email to all active subscribers', async () => {
    getServerSession.mockResolvedValue(ADMIN_SESSION)
    prisma.subscriber.findMany.mockResolvedValue([
      { email: 'a@test.com' },
      { email: 'b@test.com' },
    ])
    const { req, res } = createMocks({
      method: 'POST',
      body: { subject: 'Test Newsletter', body: 'Hello everyone!' },
    })
    await broadcastHandler(req, res)
    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.sent).toBe(2)
    expect(transporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({ bcc: ['a@test.com', 'b@test.com'], subject: 'Test Newsletter' })
    )
  })

  it('returns 400 if subject or body missing', async () => {
    getServerSession.mockResolvedValue(ADMIN_SESSION)
    const { req, res } = createMocks({ method: 'POST', body: { subject: 'Only subject' } })
    await broadcastHandler(req, res)
    expect(res._getStatusCode()).toBe(400)
  })

  it('returns 0 sent when no active subscribers', async () => {
    getServerSession.mockResolvedValue(ADMIN_SESSION)
    prisma.subscriber.findMany.mockResolvedValue([])
    const { req, res } = createMocks({
      method: 'POST',
      body: { subject: 'Hello', body: 'World' },
    })
    await broadcastHandler(req, res)
    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData()).sent).toBe(0)
  })
})
```

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: All test suites pass.

- [ ] **Step 6: Commit**

```bash
git add src/__tests__/api/contact.test.js src/__tests__/api/newsletter/ src/__tests__/api/admin/contacts.test.js src/__tests__/api/admin/newsletter.test.js
git commit -m "test: add contact, newsletter subscribe, and admin contact/newsletter API tests"
```

---

### Task 35: Sitemap test

**Files:**
- Create: `src/__tests__/api/sitemap.test.js`

- [ ] **Step 1: Create `src/__tests__/api/sitemap.test.js`**

```js
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/sitemap.xml'
import prisma from '@/lib/prisma'

jest.mock('@/lib/prisma')

describe('GET /api/sitemap.xml', () => {
  afterEach(() => jest.clearAllMocks())

  it('returns valid XML with post entries', async () => {
    prisma.post.findMany.mockResolvedValue([
      { slug: 'my-article', updatedAt: new Date('2026-01-01') },
    ])
    const { req, res } = createMocks({ method: 'GET' })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(200)
    const xml = res._getData()
    expect(xml).toContain('<urlset')
    expect(xml).toContain('my-article?lang=fr')
    expect(xml).toContain('my-article?lang=en')
    expect(xml).toContain('/blog')
  })

  it('returns empty urlset when no posts', async () => {
    prisma.post.findMany.mockResolvedValue([])
    const { req, res } = createMocks({ method: 'GET' })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toContain('<urlset')
  })
})
```

- [ ] **Step 2: Run test**

```bash
npm test src/__tests__/api/sitemap.test.js
```

Expected: PASS.

- [ ] **Step 3: Run full test suite**

```bash
npm test
```

Expected: All suites pass with 0 failures.

- [ ] **Step 4: Commit**

```bash
git add src/__tests__/api/sitemap.test.js
git commit -m "test: add sitemap XML API test"
```

---

## Phase 7: Final wiring

### Task 36: next.config.js update for images

**Files:**
- Modify: `next.config.js`

- [ ] **Step 1: Update `next.config.js`**

Read the current `next.config.js` first, then add the `images` domain config so that Next.js `<Image>` can serve from `localhost`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    // Allow local /uploads/ path images (unoptimized for local files)
    unoptimized: process.env.NODE_ENV === 'development',
  },
}

module.exports = nextConfig
```

- [ ] **Step 2: Commit**

```bash
git add next.config.js
git commit -m "chore: configure next.config.js for local image domains"
```

---

### Task 37: Verify full system end-to-end

- [ ] **Step 1: Start the development server**

```bash
npm run dev
```

Expected: Server starts on http://localhost:3000

- [ ] **Step 2: Verify admin login**

Navigate to http://localhost:3000/admin/login

Enter credentials from `.env`:
- Email: `admin@novaimpact.fr`
- Password: (your ADMIN_PASSWORD value)

Expected: Redirected to http://localhost:3000/admin (dashboard with stats)

- [ ] **Step 3: Verify blog listing**

Navigate to http://localhost:3000/blog

Expected: 5 published seeded posts render with GSAP animation, no console errors.

- [ ] **Step 4: Verify blog post detail + SEO**

Navigate to http://localhost:3000/blog/comment-optimiser-votre-seo-en-2026

Open browser DevTools → Elements → `<head>` and verify:
- `<title>` contains the meta title
- `<meta name="description">` is present
- `<script type="application/ld+json">` is present with `@type: "Article"`
- `<link rel="alternate" hreflang="fr">` and `hreflang="en"` are present

- [ ] **Step 5: Verify sitemap**

Navigate to http://localhost:3000/api/sitemap.xml

Expected: Valid XML with both `?lang=fr` and `?lang=en` entries for each published post.

- [ ] **Step 6: Verify contacts form**

Submit the contact form on http://localhost:3000/contact

Navigate to http://localhost:3000/admin/contacts

Expected: New submission appears with unread badge.

- [ ] **Step 7: Verify newsletter subscribe**

Add `<NewsletterWidget />` temporarily to the contact page (or footer) and submit an email.

Navigate to http://localhost:3000/admin/newsletter

Expected: New subscriber appears in list.

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "feat: complete blog system with ISR, admin dashboard, contacts, newsletter, SEO, and tests"
```

---

## Summary

| Phase | Tasks | What it builds |
|-------|-------|----------------|
| 1 — Foundation | 1–8 | Dependencies, env, Prisma schema, NextAuth, lib utilities |
| 2 — Public Blog | 9–17 | API routes, ISR pages, SEO head, sitemap |
| 3 — Admin Dashboard | 18–25 | Login, layout, posts CRUD, uploads |
| 4 — Contacts & Newsletter | 26–29 | Contact DB save, admin pages, subscribe API, broadcast |
| 5 — Seeding | 30 | Full seed with admin user + 6 posts + contacts + subscribers |
| 6 — Tests | 31–35 | Jest setup, all API tests (blog, admin, contact, newsletter, sitemap) |
| 7 — Final wiring | 36–37 | Image config + end-to-end verification |

**Total: 37 tasks, ~90 steps**
