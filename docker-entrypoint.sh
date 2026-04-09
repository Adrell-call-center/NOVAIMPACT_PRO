#!/bin/sh
set -e

echo "▶ Running Prisma migrations..."
npx prisma@6.3.1 migrate deploy

echo "▶ Starting Next.js..."
exec node server.js
