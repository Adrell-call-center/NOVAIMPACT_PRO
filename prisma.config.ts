// Prisma v7 configuration
// DATABASE_URL is passed via environment variable
module.exports = {
  schema: './prisma/schema.prisma',
  datasource: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL || '',
  },
  migrations: {
    path: './prisma/migrations',
  },
};
