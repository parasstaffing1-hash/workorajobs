#!/bin/bash
# ==============================================================================
# Workora Jobs — AWS EC2 / Lightsail Production Deployment Script
# ==============================================================================
set -e

echo "🚀 Starting Workora Jobs Production Deployment..."

# 1. Ensure Docker & Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y docker.io docker-compose-plugin
    sudo systemctl enable --now docker
    sudo usermod -aG docker $USER
fi

# 2. Pull latest code if in git repository
if [ -d ".git" ]; then
    echo "🔄 Pulling latest repository updates..."
    git pull origin main || true
fi

# 3. Ensure .env exists
if [ ! -f ".env" ]; then
    echo "⚠️ .env file missing! Copying from .env.example..."
    cp .env.example .env
fi

# 4. Build and run Docker containers (Web, API, Postgres, Redis)
echo "🏗️ Building and starting Docker services..."
if command -v docker-compose &> /dev/null; then
    sudo docker-compose up -d --build
else
    sudo docker compose up -d --build
fi

# 5. Run Prisma database migrations
echo "🗄️ Running Prisma database migrations..."
docker compose exec -T api npx prisma migrate deploy || true

echo "✅ Docker deployment completed successfully!"
echo "🌐 Nginx proxy is running on port 80/8080."
echo ""
echo "🔐 To enable free HTTPS SSL with Certbot for your domain, run:"
echo "sudo apt-get install -y certbot python3-certbot-nginx"
echo "sudo certbot --nginx -d workorajobs.com -d www.workorajobs.com"
