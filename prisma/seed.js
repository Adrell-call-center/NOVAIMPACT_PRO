const { execSync } = require('child_process');
const bcrypt = require('bcryptjs');

const adminEmail = process.env.ADMIN_EMAIL || 'admin@novaimpact.fr';
const adminPassword = process.env.ADMIN_PASSWORD || 'NovaAdmin2026!';
const hashed = bcrypt.hashSync(adminPassword, 12);

// Use prisma db execute to run raw SQL for seeding
const sqlStatements = `
-- Create admin user if not exists
INSERT INTO users (id, name, email, password, role, "createdAt")
SELECT gen_random_uuid(), 'Admin', '${adminEmail}', '${hashed}', 'ADMIN', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = '${adminEmail}');

-- Sample posts
INSERT INTO posts (id, slug, "titleFr", "titleEn", "excerptFr", "excerptEn", "contentFr", "contentEn", category, tags, status, "publishedAt", "createdAt", "updatedAt", "metaTitleFr", "metaDescFr", "focusKeywordFr", "noIndex", "schemaType")
SELECT gen_random_uuid(), 'comment-choisir-assurance-auto', 'Comment choisir son assurance auto en 2026', 'How to Choose Car Insurance in 2026', 'Guide complet pour trouver la meilleure assurance auto.', 'Complete guide to finding the best car insurance.', 'Contenu article FR...', 'Article content EN...', 'Assurance', ARRAY['auto','assurance','guide'], 'PUBLISHED', '2026-01-15', NOW(), NOW(), 'Choisir assurance auto 2026 — Nova Impact', 'Guide complet pour choisir la meilleure assurance auto en 2026.', 'assurance auto', false, 'Article'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'comment-choisir-assurance-auto');

INSERT INTO posts (id, slug, "titleFr", "titleEn", "excerptFr", "excerptEn", "contentFr", "contentEn", category, tags, status, "publishedAt", "createdAt", "updatedAt", "metaTitleFr", "metaDescFr", "focusKeywordFr", "noIndex", "schemaType")
SELECT gen_random_uuid(), 'mutuelle-sante-pas-chere', 'Mutuelle santé pas chère : comparatif 2026', 'Affordable Health Insurance: 2026 Comparison', 'Comparez les mutuelles santé les moins chères.', 'Compare the most affordable health insurance plans.', 'Contenu article FR...', 'Article content EN...', 'Santé', ARRAY['mutuelle','santé','comparatif'], 'PUBLISHED', '2026-02-10', NOW(), NOW(), 'Mutuelle santé pas chère — Nova Impact', 'Comparatif des mutuelles santé les plus abordables en 2026.', 'mutuelle santé pas chère', false, 'Article'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'mutuelle-sante-pas-chere');

INSERT INTO posts (id, slug, "titleFr", "titleEn", "excerptFr", "excerptEn", "contentFr", "contentEn", category, tags, status, "publishedAt", "createdAt", "updatedAt", "metaTitleFr", "metaDescFr", "focusKeywordFr", "noIndex", "schemaType")
SELECT gen_random_uuid(), 'digital-marketing-trends-2026', 'Tendances du marketing digital en 2026', 'Digital Marketing Trends in 2026', 'Les tendances marketing à suivre cette année.', 'Marketing trends to follow this year.', 'Contenu article FR...', 'Article content EN...', 'Marketing', ARRAY['marketing','digital','tendances'], 'PUBLISHED', '2026-04-01', NOW(), NOW(), 'Tendances marketing digital 2026 — Nova Impact', 'Les principales tendances du marketing digital pour 2026.', 'marketing digital', false, 'Article'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'digital-marketing-trends-2026');

INSERT INTO posts (id, slug, "titleFr", "titleEn", "excerptFr", "excerptEn", "contentFr", "contentEn", category, tags, status, "createdAt", "updatedAt", "metaTitleFr", "metaDescFr", "focusKeywordFr", "noIndex", "schemaType")
SELECT gen_random_uuid(), 'seo-local-petites-entreprises', 'SEO local pour petites entreprises', 'Local SEO for Small Businesses', 'Optimisez votre visibilité locale sur Google.', 'Optimize your local visibility on Google.', 'Contenu article FR...', 'Article content EN...', 'SEO', ARRAY['seo','local','petites entreprises'], 'DRAFT', NOW(), NOW(), 'SEO local petites entreprises — Nova Impact', 'Guide SEO local pour les petites entreprises.', 'seo local', false, 'Article'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'seo-local-petites-entreprises');

INSERT INTO posts (id, slug, "titleFr", "titleEn", "excerptFr", "excerptEn", "contentFr", "contentEn", category, tags, status, "publishedAt", "createdAt", "updatedAt", "metaTitleFr", "metaDescFr", "focusKeywordFr", "noIndex", "schemaType")
SELECT gen_random_uuid(), 'branding-identite-visuelle', 'Créer une identité visuelle forte', 'Building a Strong Visual Identity', 'Les clés d''un branding réussi.', 'Keys to successful branding.', 'Contenu article FR...', 'Article content EN...', 'Branding', ARRAY['branding','identité','design'], 'PUBLISHED', '2026-03-20', NOW(), NOW(), 'Identité visuelle forte — Nova Impact', 'Comment créer une identité visuelle qui marque les esprits.', 'identité visuelle', false, 'Article'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'branding-identite-visuelle');

-- Sample subscribers
INSERT INTO subscribers (id, email, status, "subscribedAt")
SELECT gen_random_uuid(), 'user1@example.com', 'ACTIVE', NOW() WHERE NOT EXISTS (SELECT 1 FROM subscribers WHERE email = 'user1@example.com');
INSERT INTO subscribers (id, email, status, "subscribedAt")
SELECT gen_random_uuid(), 'user2@example.com', 'ACTIVE', NOW() WHERE NOT EXISTS (SELECT 1 FROM subscribers WHERE email = 'user2@example.com');
INSERT INTO subscribers (id, email, status, "subscribedAt")
SELECT gen_random_uuid(), 'user3@example.com', 'UNSUBSCRIBED', NOW() WHERE NOT EXISTS (SELECT 1 FROM subscribers WHERE email = 'user3@example.com');
INSERT INTO subscribers (id, email, status, "subscribedAt")
SELECT gen_random_uuid(), 'user4@example.com', 'ACTIVE', NOW() WHERE NOT EXISTS (SELECT 1 FROM subscribers WHERE email = 'user4@example.com');
INSERT INTO subscribers (id, email, status, "subscribedAt")
SELECT gen_random_uuid(), 'user5@example.com', 'ACTIVE', NOW() WHERE NOT EXISTS (SELECT 1 FROM subscribers WHERE email = 'user5@example.com');

-- Sample contacts
INSERT INTO contact_submissions (id, name, email, phone, message, "isRead", "createdAt")
SELECT gen_random_uuid(), 'Jean Dupont', 'jean@example.com', '+33600000000', 'Bonjour, je suis intéressé par vos services.', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM contact_submissions WHERE email = 'jean@example.com' AND name = 'Jean Dupont');
INSERT INTO contact_submissions (id, name, email, phone, message, "isRead", "createdAt")
SELECT gen_random_uuid(), 'Marie Martin', 'marie@example.com', NULL, 'Pouvez-vous me recontacter ?', false, NOW()
WHERE NOT EXISTS (SELECT 1 FROM contact_submissions WHERE email = 'marie@example.com' AND name = 'Marie Martin');
INSERT INTO contact_submissions (id, name, email, phone, message, "isRead", "createdAt")
SELECT gen_random_uuid(), 'Pierre Durand', 'pierre@example.com', '+33611111111', 'Devis pour un site web.', false, NOW()
WHERE NOT EXISTS (SELECT 1 FROM contact_submissions WHERE email = 'pierre@example.com' AND name = 'Pierre Durand');
`;

try {
  execSync(`npx prisma db execute --stdin`, {
    input: sqlStatements,
    stdio: ['pipe', 'inherit', 'inherit'],
    env: { ...process.env }
  });
  console.log('🎉 Seeding complete!');
} catch (e) {
  console.error('Seed failed:', e.message);
  process.exit(1);
}
