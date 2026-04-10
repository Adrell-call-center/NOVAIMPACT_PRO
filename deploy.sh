#!/bin/bash
# ===========================================
# Deploy Script for Nova Impact Production
# ===========================================

echo "🚀 Starting deployment..."

# 1. Pull latest code
echo "📥 Pulling latest code..."
git pull origin main || { echo "❌ Git pull failed!"; exit 1; }

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm ci || npm install

# 3. Build Next.js
echo "🔨 Building Next.js..."
npm run build || { echo "❌ Build failed!"; exit 1; }

# 4. Restart PM2
echo "🔄 Restarting PM2..."
pm2 restart all || { echo "⚠️ PM2 restart failed, trying pm2 restart 0..."; pm2 restart 0; }

# 5. Wait and check
echo "⏳ Waiting 5 seconds for restart..."
sleep 5
pm2 status

echo ""
echo "✅ Deployment complete! Check your site now."
echo ""

# Auto-delete this script after success
echo "🗑️ Removing deploy script..."
rm -- "$0"
echo "Done!"
