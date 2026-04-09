#!/bin/sh
set -e

# 1. Fix uploads directory permissions (runs as root)
mkdir -p /app/public/uploads

# Attempt to chown to the nextjs user. 
# If the volume is restricted, fallback to world-writable (777).
if ! chown -R nextjs:nodejs /app/public/uploads 2>/dev/null; then
    echo "⚠️ Cannot chown uploads directory, setting to 777..."
    chmod -R 777 /app/public/uploads
fi

echo "▶ Running Prisma migrations..."
node node_modules/prisma/build/index.js migrate deploy

echo "▶ Seeding admin user (if not exists)..."
node prisma/seed.js

echo "▶ Starting Next.js as 'nextjs' user..."
# 2. Start the app as the non-root user
exec su-exec nextjs node server.js
