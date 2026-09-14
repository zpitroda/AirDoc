#!/bin/bash
# ==============================================================================
# AirDoc Deployment Script for Hostinger Linux VPS
# Run on VPS: bash deploy.sh
# ==============================================================================

set -e

echo "🚀 Starting AirDoc Deployment..."

# 1. Pull latest code from repository
echo "📥 Pulling latest git updates..."
git pull

# 2. Ensure data directory exists with write permissions
echo "📁 Checking persistent storage directory..."
mkdir -p data
chmod 775 data

# 3. Install production dependencies
echo "📦 Installing npm dependencies..."
npm install

# 4. Build Next.js application (standalone production build)
echo "🔨 Building Next.js production bundle..."
npm run build

# 5. Reload or start PM2 process manager
echo "🔄 Reloading PM2 process..."
if command -v pm2 &> /dev/null; then
    pm2 reload ecosystem.config.cjs || pm2 start ecosystem.config.cjs
    pm2 save
    echo "✅ PM2 process restarted successfully!"
else
    echo "⚠️ PM2 not found. Please install PM2 globally: npm install -g pm2"
fi

echo "🎉 AirDoc deployment complete! Running on http://127.0.0.1:3000"
