#!/bin/bash

# Build and Deploy Script
# Собирает фронтенд локально и готовит к деплою

set -e

echo "🚀 VetLab Build & Deploy Script"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Проверяем что мы в корне проекта
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ Ошибка: Запустите скрипт из корня проекта!${NC}"
    exit 1
fi

# Шаг 1: Сборка фронтенда
echo -e "${YELLOW}📦 Шаг 1: Сборка фронтенда...${NC}"

# Загружаем переменные из .env.production (корень проекта) или frontend/.env.production
if [ -f ".env.production" ]; then
    echo -e "${YELLOW}📋 Загружаем переменные из .env.production (корень проекта)...${NC}"
    # Загружаем только VITE_ переменные
    export $(grep -v '^#' .env.production | grep '^VITE_' | xargs)
elif [ -f "frontend/.env.production" ]; then
    echo -e "${YELLOW}📋 Загружаем переменные из frontend/.env.production...${NC}"
    export $(grep -v '^#' frontend/.env.production | grep '^VITE_' | xargs)
else
    echo -e "${YELLOW}⚠️  .env.production не найден!${NC}"
    echo -e "${YELLOW}   Используем дефолтный URL: /api (относительный путь)${NC}"
    export VITE_API_URL=${VITE_API_URL:-/api}
fi

# Проверяем что VITE_API_URL установлен
if [ -z "$VITE_API_URL" ]; then
    echo -e "${YELLOW}⚠️  VITE_API_URL не установлен, используем /api${NC}"
    export VITE_API_URL=/api
fi

echo -e "${GREEN}✅ API URL: ${VITE_API_URL}${NC}"
echo ""

cd frontend

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Установка зависимостей...${NC}"
    npm install
fi

# Собираем проект
echo -e "${YELLOW}🔨 Сборка production билда...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Фронтенд успешно собран!${NC}"
else
    echo -e "${RED}❌ Ошибка сборки фронтенда!${NC}"
    exit 1
fi

cd ..

# Шаг 2: Проверка что dist/ существует
if [ ! -d "frontend/dist" ]; then
    echo -e "${RED}❌ Ошибка: frontend/dist не найден!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Готово к деплою!${NC}"
echo ""
echo "📝 Следующие шаги:"
echo "1. Скопируйте проект на сервер (через git или scp)"
echo "2. На сервере запустите:"
echo "   docker compose -f docker-compose.production.yml up -d --build"
echo ""
echo "💡 Или используйте полный скрипт деплоя:"
echo "   bash scripts/deploy.sh"
echo ""
