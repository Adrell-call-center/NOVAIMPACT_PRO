#!/bin/sh
set -e

# Prepare writable runtime directories before dropping privileges.
mkdir -p /app/public/uploads
mkdir -p /app/.next/cache

if ! chown -R nextjs:nodejs /app/public/uploads 2>/dev/null; then
    echo "Cannot chown uploads directory, setting to 777..."
    chmod -R 777 /app/public/uploads
fi

# Next.js writes optimized image cache files to .next/cache and updates ISR
# files under .next/server/pages at runtime.
if ! chown -R nextjs:nodejs /app/.next 2>/dev/null; then
    echo "Cannot chown Next.js runtime cache, setting writable permissions..."
    chmod -R u+rwX,g+rwX,o+rwX /app/.next
fi

echo "Running Prisma migrations..."
node node_modules/prisma/build/index.js migrate deploy

echo "Seeding admin user (if not exists)..."
node prisma/seed.js

echo "Starting Next.js as nextjs user..."
exec su-exec nextjs node server.js
