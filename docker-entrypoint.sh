#!/bin/sh
set -e

echo "▶ Running Prisma migrations..."
node node_modules/prisma/build/index.js migrate deploy --skip-generate

echo "▶ Starting Next.js..."
exec node server.js
