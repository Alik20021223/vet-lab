#!/bin/bash

# VPS Initial Setup Script
# Run this script on a fresh VPS server

set -e

echo "🔧 VetLab VPS Setup Script"
echo "==========================="
echo ""

# Check if running as root or with sudo
if [[ $EUID -ne 0 ]]; then
   echo "⚠️  This script should be run as root or with sudo"
   echo "Usage: sudo bash setup-vps.sh"
   exit 1
fi

echo "📦 Updating system packages..."
apt update && apt upgrade -y

echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo "✅ Docker installed"
else
    echo "✅ Docker already installed"
fi

echo "🐳 Installing Docker Compose..."
if ! command -v docker compose version &> /dev/null; then
    apt install docker-compose-plugin -y
    echo "✅ Docker Compose installed"
else
    echo "✅ Docker Compose already installed"
fi

echo "🌐 Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install nginx -y
    systemctl enable nginx
    systemctl start nginx
    echo "✅ Nginx installed and started"
else
    echo "✅ Nginx already installed"
fi

echo "🔒 Installing Certbot for SSL..."
if ! command -v certbot &> /dev/null; then
    apt install certbot python3-certbot-nginx -y
    echo "✅ Certbot installed"
else
    echo "✅ Certbot already installed"
fi

echo "🔥 Setting up UFW Firewall..."
if ! command -v ufw &> /dev/null; then
    apt install ufw -y
fi

ufw --force enable
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
echo "✅ Firewall configured"

echo "📦 Installing Git..."
if ! command -v git &> /dev/null; then
    apt install git -y
    echo "✅ Git installed"
else
    echo "✅ Git already installed"
fi

echo ""
echo "✅ VPS setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Clone your project:"
echo "   cd /home"
echo "   git clone https://github.com/username/vet-lab.git"
echo "   cd vet-lab"
echo ""
echo "2. Create .env.production file from template:"
echo "   cp env.production.template .env.production"
echo "   nano .env.production"
echo ""
echo "3. Deploy the application:"
echo "   bash scripts/deploy.sh"
echo ""
echo "4. Configure Nginx (see DEPLOYMENT_GUIDE.md)"
echo ""
echo "5. Setup SSL certificate:"
echo "   certbot --nginx -d yourdomain.com"
echo ""
