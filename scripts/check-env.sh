#!/bin/bash

# Скрипт для проверки переменных окружения на сервере

set -e

echo "🔍 Проверка переменных окружения"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Проверяем .env.production
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ .env.production не найден!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ .env.production найден${NC}"
echo ""

# Загружаем переменные
set -a
source .env.production
set +a

# Проверяем обязательные переменные
echo "📋 Проверка переменных:"
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}❌ DB_PASSWORD не установлен${NC}"
else
    echo -e "${GREEN}✅ DB_PASSWORD установлен (длина: ${#DB_PASSWORD} символов)${NC}"
fi

if [ -z "$JWT_SECRET" ]; then
    echo -e "${RED}❌ JWT_SECRET не установлен${NC}"
else
    echo -e "${GREEN}✅ JWT_SECRET установлен${NC}"
fi

if [ -z "$REFRESH_SECRET" ]; then
    echo -e "${RED}❌ REFRESH_SECRET не установлен${NC}"
else
    echo -e "${GREEN}✅ REFRESH_SECRET установлен${NC}"
fi

if [ -z "$VITE_API_URL" ]; then
    echo -e "${YELLOW}⚠️  VITE_API_URL не установлен (будет использован /api)${NC}"
else
    echo -e "${GREEN}✅ VITE_API_URL: $VITE_API_URL${NC}"
fi

echo ""
echo "🔍 Проверка DATABASE_URL:"
echo ""

# Формируем DATABASE_URL
DATABASE_URL="postgresql://vetlab_user:${DB_PASSWORD}@db:5432/vetlab_db?schema=public"
echo "DATABASE_URL=$DATABASE_URL"
echo ""

# Проверяем что Docker Compose видит переменные
echo "🔍 Проверка конфигурации Docker Compose:"
echo ""

docker compose --env-file .env.production -f docker-compose.production.yml config | grep -A 5 "DATABASE_URL" || echo "DATABASE_URL не найден в конфигурации"

echo ""
echo "🔍 Проверка статуса контейнеров:"
echo ""

docker compose --env-file .env.production -f docker-compose.production.yml ps

echo ""
echo "✅ Проверка завершена"
