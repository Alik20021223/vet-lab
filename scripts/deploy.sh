#!/bin/bash

# VetLab Production Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 VetLab Production Deployment"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ Error: .env.production file not found!${NC}"
    echo "Please create .env.production from env.production.template"
    exit 1
fi

echo -e "${YELLOW}📦 Pulling latest changes from git...${NC}"
git pull

echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker compose -f docker-compose.production.yml down

echo -e "${YELLOW}🏗️  Building and starting containers...${NC}"
docker compose -f docker-compose.production.yml up -d --build

echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
sleep 10

echo -e "${YELLOW}🔄 Running database migrations...${NC}"
docker compose -f docker-compose.production.yml exec -T backend npx prisma migrate deploy

echo -e "${YELLOW}📊 Checking container status...${NC}"
docker compose -f docker-compose.production.yml ps

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "🌐 Your application should now be running:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API: http://localhost:3000"
echo ""
echo "📝 View logs with:"
echo "   docker compose -f docker-compose.production.yml logs -f"
echo ""
