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

# Загружаем переменные окружения из .env.production
echo -e "${YELLOW}📋 Загружаем переменные окружения...${NC}"
set -a  # Автоматически экспортировать все переменные
source .env.production
set +a  # Отключить автоматический экспорт

# Check if frontend/dist exists (should be built locally)
if [ ! -d "frontend/dist" ]; then
    echo -e "${YELLOW}⚠️  frontend/dist не найден!${NC}"
    echo -e "${YELLOW}📦 Собираем фронтенд...${NC}"
    
    # Загружаем переменные окружения для сборки
    if [ -f ".env.production" ]; then
        echo -e "${YELLOW}📋 Загружаем VITE_API_URL из .env.production...${NC}"
        export $(grep -v '^#' .env.production | grep '^VITE_' | xargs)
    elif [ -f "frontend/.env.production" ]; then
        echo -e "${YELLOW}📋 Загружаем VITE_API_URL из frontend/.env.production...${NC}"
        export $(grep -v '^#' frontend/.env.production | grep '^VITE_' | xargs)
    else
        echo -e "${YELLOW}⚠️  .env.production не найден, используем /api${NC}"
        export VITE_API_URL=/api
    fi
    
    if [ -z "$VITE_API_URL" ]; then
        export VITE_API_URL=/api
    fi
    
    echo -e "${GREEN}✅ API URL для сборки: ${VITE_API_URL}${NC}"
    
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📥 Установка зависимостей...${NC}"
        npm install
    fi
    
    echo -e "${YELLOW}🔨 Сборка production билда...${NC}"
    npm run build
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Ошибка сборки фронтенда!${NC}"
        exit 1
    fi
    
    cd ..
    echo -e "${GREEN}✅ Фронтенд собран!${NC}"
fi

echo -e "${YELLOW}📦 Pulling latest changes from git...${NC}"
git pull

echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker compose --env-file .env.production -f docker-compose.production.yml down

echo -e "${YELLOW}🏗️  Building and starting containers...${NC}"

# Проверяем что DB_PASSWORD установлен
if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}❌ Ошибка: DB_PASSWORD не установлен в .env.production!${NC}"
    echo -e "${YELLOW}   Добавьте DB_PASSWORD=your-password в .env.production${NC}"
    exit 1
fi

echo -e "${GREEN}✅ DB_PASSWORD загружен (длина: ${#DB_PASSWORD} символов)${NC}"

# Показываем какой DATABASE_URL будет использован (без пароля)
echo -e "${YELLOW}   DATABASE_URL будет: postgresql://vetlab_user:***@db:5432/vetlab_db?schema=public${NC}"

# Запускаем контейнеры с явным указанием env файла
echo -e "${YELLOW}   Используем переменные из .env.production${NC}"
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build

echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"

# Ждем пока база данных станет здоровой (healthcheck)
MAX_WAIT=60
WAIT_COUNT=0
while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    DB_STATUS=$(docker compose --env-file .env.production -f docker-compose.production.yml ps db --format json 2>/dev/null | grep -o '"Health":"[^"]*"' | cut -d'"' -f4 || echo "")
    if [ "$DB_STATUS" = "healthy" ]; then
        echo -e "${GREEN}✅ База данных готова!${NC}"
        break
    fi
    echo -e "${YELLOW}   Ожидание базы данных... ($WAIT_COUNT/$MAX_WAIT сек)${NC}"
    sleep 2
    WAIT_COUNT=$((WAIT_COUNT + 2))
done

if [ "$DB_STATUS" != "healthy" ]; then
    echo -e "${RED}❌ База данных не готова после $MAX_WAIT секунд!${NC}"
    echo -e "${YELLOW}   Проверьте логи: docker compose -f docker-compose.production.yml logs db${NC}"
    exit 1
fi

# Дополнительная пауза для полной инициализации PostgreSQL
echo -e "${YELLOW}   Дополнительная пауза для инициализации...${NC}"
sleep 5

# Prisma Client уже сгенерирован в Dockerfile при сборке образа
echo -e "${GREEN}✅ Prisma Client уже сгенерирован в Docker образе${NC}"

echo -e "${YELLOW}🔄 Running database migrations...${NC}"
echo -e "${YELLOW}   (Prisma Client уже сгенерирован в Docker образе)${NC}"

# Пытаемся применить миграции с повторными попытками
MAX_RETRIES=3
RETRY_COUNT=0
MIGRATION_SUCCESS=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker compose --env-file .env.production -f docker-compose.production.yml exec -T backend npx prisma migrate deploy; then
        MIGRATION_SUCCESS=true
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
        echo -e "${YELLOW}   Попытка $RETRY_COUNT/$MAX_RETRIES не удалась, повтор через 5 сек...${NC}"
        sleep 5
    fi
done

if [ "$MIGRATION_SUCCESS" = true ]; then
    echo -e "${GREEN}✅ Миграции применены успешно!${NC}"
else
    echo -e "${RED}❌ Ошибка применения миграций после $MAX_RETRIES попыток!${NC}"
    echo ""
    echo -e "${YELLOW}🔍 Диагностика:${NC}"
    echo ""
    echo -e "${YELLOW}1. Проверьте статус контейнеров:${NC}"
    echo "   docker compose --env-file .env.production -f docker-compose.production.yml ps"
    echo ""
    echo -e "${YELLOW}2. Проверьте логи базы данных:${NC}"
    echo "   docker compose --env-file .env.production -f docker-compose.production.yml logs db"
    echo ""
    echo -e "${YELLOW}3. Проверьте логи backend:${NC}"
    echo "   docker compose --env-file .env.production -f docker-compose.production.yml logs backend"
    echo ""
    echo -e "${YELLOW}4. Проверьте DATABASE_URL в контейнере:${NC}"
    echo "   docker compose --env-file .env.production -f docker-compose.production.yml exec backend env | grep DATABASE_URL"
    echo ""
    echo -e "${YELLOW}5. Попробуйте подключиться вручную:${NC}"
    echo "   docker compose --env-file .env.production -f docker-compose.production.yml exec backend npx prisma db pull"
    echo ""
    exit 1
fi

echo -e "${YELLOW}📊 Checking container status...${NC}"
docker compose --env-file .env.production -f docker-compose.production.yml ps

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "🌐 Your application should now be running:"
echo "   - Frontend: http://localhost:8080 (или через Nginx на 80/443)"
echo "   - Backend API: http://localhost:3000"
echo ""
echo "📝 View logs with:"
echo "   docker compose --env-file .env.production -f docker-compose.production.yml logs -f"
echo ""
