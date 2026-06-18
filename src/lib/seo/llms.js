import prisma from '@/lib/prisma';
import { getAllProjectSlugs, getProjectBySlug } from '@/data/projects';
import { absoluteUrl, SITE_URL } from '@/lib/site';
import {
  LEGAL_PAGES,
  MAIN_PAGES,
  SERVICE_PAGES,
} from '@/lib/seo/static-pages';

function markdownLink(label, url, description) {
  if (description) {
    return `- [${label}](${url}): ${description}`;
  }
  return `- [${label}](${url})`;
}

export async function generateLlmsTxt() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED', noIndex: false },
    orderBy: { publishedAt: 'desc' },
    select: {
      slug: true,
      titleEn: true,
      excerptEn: true,
    },
  });

  const lines = [
    '# Nova Impact',
    '',
    '> Nova Impact (NOVA IMPACT LTD) is a full-service digital agency specializing in website creation, SEO, paid advertising (Meta Ads, Google Ads), social media management, content creation, brand identity, comparison platforms, and custom SaaS development. Offices in London, Marseille, and Agadir. Languages: English and French.',
    '',
    'Nova Impact helps brands and businesses grow through strategy, technology, design, and performance marketing. The agency builds comparison platforms, lead-generation ecosystems, media sites, internal management tools, and SaaS products for clients across Europe and beyond.',
    '',
    '## Contact',
    '',
    `- Website: ${SITE_URL}`,
    '- Email: contact@novaimpactltd.com',
    '- Phone (UK): +44 7477 884817',
    '- Phone (FR): +33 980 801 417',
    '- Instagram: https://www.instagram.com/novaimpact.io/',
    '- LinkedIn: https://www.linkedin.com/company/nova-impact-io/',
    '- YouTube: https://www.youtube.com/@NovaImpact.agency/',
    '- Facebook: https://www.facebook.com/novaimpact.agency',
    '',
    '## Offices',
    '',
    '- London: 71-75 Shelton Street, Covent Garden, WC2H 9JQ, United Kingdom',
    '- Marseille: Bureau 3, 154 Rue de Rome, 13006 Marseille, France',
    '- Agadir: Rue 204 Imm Afouize, Quartier Industriel, Agadir, Morocco',
    '',
    '## Main pages',
    '',
    ...MAIN_PAGES.map((page) =>
      markdownLink(page.label, absoluteUrl(page.path), page.description)
    ),
    '',
    '## Services',
    '',
    ...SERVICE_PAGES.map((page) =>
      markdownLink(page.label, absoluteUrl(page.path), page.description)
    ),
    '',
    '## Portfolio case studies',
    '',
    ...getAllProjectSlugs().map((slug) => {
      const project = getProjectBySlug(slug);
      const label = project?.title || slug;
      const description = project?.subtitle || project?.description || '';
      return markdownLink(label, absoluteUrl(`/portfolio/${slug}`), description);
    }),
  ];

  if (posts.length > 0) {
    lines.push('', '## Blog articles', '');
    lines.push(
      ...posts.map((post) =>
        markdownLink(
          post.titleEn,
          absoluteUrl(`/blog/${post.slug}`),
          post.excerptEn
        )
      )
    );
  }

  lines.push(
    '',
    '## Legal',
    '',
    ...LEGAL_PAGES.map((page) =>
      markdownLink(page.label, absoluteUrl(page.path))
    ),
    '',
    '## Technical',
    '',
    `- Sitemap: ${absoluteUrl('/sitemap.xml')}`,
    `- Primary domain: ${SITE_URL}`,
    '- Admin routes (`/admin/*`) are private and should not be indexed or summarized',
    '',
    '## Optional',
    '',
    '- For structured data, pages include JSON-LD schema (Organization, WebSite, Service, Article, BreadcrumbList).',
    '- Portfolio and blog content is updated periodically; prefer sitemap and live pages over cached summaries.',
    ''
  );

  return lines.join('\n');
}
