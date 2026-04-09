import prisma from '@/lib/prisma';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://novaimpact.io';

const url = (loc, lastmod, changefreq, priority) =>
  `<url><loc>${SITE_URL}${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;

const today = new Date().toISOString();

const staticPages = [
  { loc: '/',          changefreq: 'weekly',  priority: '1.0' },
  { loc: '/about',     changefreq: 'monthly', priority: '0.8' },
  { loc: '/service',   changefreq: 'monthly', priority: '0.9' },
  { loc: '/portfolio', changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog',      changefreq: 'weekly',  priority: '0.8' },
  { loc: '/contact',   changefreq: 'monthly', priority: '0.7' },
  { loc: '/faq',       changefreq: 'monthly', priority: '0.6' },
  { loc: '/team',      changefreq: 'monthly', priority: '0.6' },
  // Service details
  { loc: '/service-details/website-creation',       changefreq: 'monthly', priority: '0.8' },
  { loc: '/service-details/social-media-management',changefreq: 'monthly', priority: '0.8' },
  { loc: '/service-details/content-creation',       changefreq: 'monthly', priority: '0.8' },
  { loc: '/service-details/meta-ads',               changefreq: 'monthly', priority: '0.8' },
  { loc: '/service-details/google-ads',             changefreq: 'monthly', priority: '0.8' },
  { loc: '/service-details/seo',                    changefreq: 'monthly', priority: '0.8' },
  { loc: '/service-details/brand-identity',         changefreq: 'monthly', priority: '0.7' },
  { loc: '/service-details/comparator-creation',    changefreq: 'monthly', priority: '0.7' },
  { loc: '/service-details/consulting-support',     changefreq: 'monthly', priority: '0.7' },
  // Legal
  { loc: '/mentions-legales',         changefreq: 'yearly', priority: '0.3' },
  { loc: '/politique-confidentialite',changefreq: 'yearly', priority: '0.3' },
  { loc: '/refund-policy',            changefreq: 'yearly', priority: '0.3' },
  { loc: '/terms-of-service',         changefreq: 'yearly', priority: '0.3' },
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED', noIndex: false },
    orderBy: { updatedAt: 'desc' },
    select: { slug: true, updatedAt: true },
  });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

  for (const page of staticPages) {
    xml += url(page.loc, today, page.changefreq, page.priority);
  }

  for (const post of posts) {
    const frUrl = `${SITE_URL}/blog/${post.slug}?lang=fr`;
    const enUrl = `${SITE_URL}/blog/${post.slug}?lang=en`;
    const lastmod = new Date(post.updatedAt).toISOString();
    xml += `<url>`;
    xml += `<loc>${frUrl}</loc>`;
    xml += `<lastmod>${lastmod}</lastmod>`;
    xml += `<changefreq>monthly</changefreq>`;
    xml += `<priority>0.7</priority>`;
    xml += `<xhtml:link rel="alternate" hreflang="fr" href="${frUrl}"/>`;
    xml += `<xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>`;
    xml += `<xhtml:link rel="alternate" hreflang="x-default" href="${frUrl}"/>`;
    xml += `</url>`;
  }

  xml += '</urlset>';

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.write(xml);
  res.end();
}
