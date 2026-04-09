#!/bin/sh
set -e

# Fix uploads directory permissions
mkdir -p /app/public/uploads
chown -R nextjs:nodejs /app/public/uploads

echo "▶ Running Prisma migrations..."
node node_modules/prisma/build/index.js migrate deploy

echo "▶ Seeding admin user (if not exists)..."
node prisma/seed.js

echo "▶ Starting Next.js..."
exec node server.js
