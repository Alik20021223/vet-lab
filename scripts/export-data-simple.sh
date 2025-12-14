#!/bin/bash

# Simplified Export Script using Prisma
# Упрощенный скрипт экспорта через Prisma

set -e

EXPORT_DIR="./database-export"
DATE=$(date +%Y%m%d_%H%M%S)

echo "📦 Экспорт базы данных VetLab (упрощенная версия)"
echo "=================================================="
echo ""

# Создаём директорию для экспорта
mkdir -p "$EXPORT_DIR"

# Проверяем наличие backend
if [ ! -d "backend" ]; then
    echo "❌ Папка backend не найдена!"
    echo "Убедитесь, что вы находитесь в корне проекта"
    exit 1
fi

echo "📦 Создаём SQL дамп через Prisma..."
cd backend

# Используем prisma db execute для создания дампа
# Для SQLite
if grep -q "file:" .env 2>/dev/null; then
    echo "📁 Используется SQLite"
    DB_FILE=$(grep DATABASE_URL .env | cut -d '=' -f2- | tr -d '"' | tr -d "'" | sed 's/file://' | sed 's/\?.*$//')
    
    if [ -f "$DB_FILE" ]; then
        echo "📋 Копируем файл базы данных..."
        cp "$DB_FILE" "../$EXPORT_DIR/database_$DATE.db"
        
        # Создаём SQL дамп
        if command -v sqlite3 &> /dev/null; then
            echo "📋 Создаём SQL дамп..."
            sqlite3 "$DB_FILE" .dump > "../$EXPORT_DIR/database_backup_$DATE.sql"
        fi
        
        echo "✅ База данных SQLite экспортирована"
    else
        echo "❌ Файл базы данных не найден: $DB_FILE"
        exit 1
    fi
# Для PostgreSQL
elif grep -q "postgresql:" .env 2>/dev/null; then
    echo "🐘 Используется PostgreSQL"
    echo "⚠️  Для PostgreSQL используйте полный скрипт: bash scripts/export-database.sh"
    echo "   Или экспортируйте вручную используя pg_dump"
    cd ..
    exit 1
fi

cd ..

# Архивируем uploads
echo ""
echo "📦 Архивируем загруженные файлы..."
if [ -d "backend/uploads" ] && [ "$(ls -A backend/uploads)" ]; then
    tar -czf "$EXPORT_DIR/uploads_$DATE.tar.gz" backend/uploads/
    echo "✅ Файлы uploads заархивированы: $EXPORT_DIR/uploads_$DATE.tar.gz"
else
    echo "⚠️  Папка backend/uploads пуста или не найдена"
fi

# Создаём инструкцию
cat > "$EXPORT_DIR/IMPORT_INSTRUCTIONS.txt" << 'EOF'
# Инструкция по импорту данных на сервер

## 1. Скопируйте папку на сервер:
scp -r database-export root@your-server-ip:/home/vet-lab/

## 2. На сервере:
cd /home/vet-lab

## 3. Импортируйте базу данных:
# Для PostgreSQL:
docker compose -f docker-compose.production.yml exec -T db \
  psql -U vetlab_user vetlab_db < database-export/database_backup_*.sql

## 4. Восстановите uploads:
tar -xzf database-export/uploads_*.tar.gz

## 5. Перезапустите:
docker compose -f docker-compose.production.yml restart

Готово!
EOF

echo ""
echo "✅ Экспорт завершён!"
echo ""
echo "📁 Содержимое $EXPORT_DIR/:"
ls -lh "$EXPORT_DIR/"
echo ""
echo "📝 Следующие шаги:"
echo "1. Скопируйте на сервер:"
echo "   scp -r $EXPORT_DIR root@your-server-ip:/home/vet-lab/"
echo ""
echo "2. На сервере запустите:"
echo "   bash scripts/import-database.sh"
echo ""
