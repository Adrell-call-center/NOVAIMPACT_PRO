#!/bin/sh
set -e

echo "▶ Running Prisma migrations..."
node node_modules/prisma/build/index.js migrate deploy

echo "▶ Seeding admin user (if not exists)..."
node prisma/seed.js

echo "▶ Starting Next.js..."
exec node server.js
