import prisma from '@/lib/prisma';
import { getAllProjectSlugs } from '@/data/projects';
import { absoluteUrl, SITE_URL } from '@/lib/site';
import { STATIC_SITEMAP_PAGES } from '@/lib/seo/static-pages';

const urlEntry = (loc, lastmod, changefreq, priority, alternates = []) => {
  if (!alternates.length) {
    return `<url><loc>${absoluteUrl(loc)}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
  }

  let xml = '<url>';
  xml += `<loc>${absoluteUrl(loc)}</loc>`;
  xml += `<lastmod>${lastmod}</lastmod>`;
  xml += `<changefreq>${changefreq}</changefreq>`;
  xml += `<priority>${priority}</priority>`;
  for (const alt of alternates) {
    xml += `<xhtml:link rel="alternate" hreflang="${alt.hrefLang}" href="${absoluteUrl(alt.href)}"/>`;
  }
  xml += '</url>';
  return xml;
};

export async function generateSitemapXml() {
  const today = new Date().toISOString();

  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED', noIndex: false },
    orderBy: { updatedAt: 'desc' },
    select: { slug: true, updatedAt: true },
  });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

  for (const page of STATIC_SITEMAP_PAGES) {
    xml += urlEntry(page.loc, today, page.changefreq, page.priority, page.alternates || []);
  }

  for (const slug of getAllProjectSlugs()) {
    xml += urlEntry(`/portfolio/${slug}`, today, 'monthly', '0.7');
  }

  for (const post of posts) {
    const postUrl = absoluteUrl(`/blog/${post.slug}`);
    const lastmod = new Date(post.updatedAt).toISOString();
    xml += '<url>';
    xml += `<loc>${postUrl}</loc>`;
    xml += `<lastmod>${lastmod}</lastmod>`;
    xml += '<changefreq>monthly</changefreq>';
    xml += '<priority>0.7</priority>';
    xml += `<xhtml:link rel="alternate" hreflang="fr" href="${SITE_URL}/blog/${post.slug}"/>`;
    xml += `<xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/blog/${post.slug}"/>`;
    xml += `<xhtml:link rel="alternate" hreflang="x-default" href="${postUrl}"/>`;
    xml += '</url>';
  }

  xml += '</urlset>';
  return xml;
}
