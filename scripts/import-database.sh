#!/bin/bash

# Import Database Script
# Импортирует данные на сервере в production базу данных

set -e

echo "📥 Импорт базы данных VetLab"
echo "============================"
echo ""

# Проверяем наличие файла экспорта
if [ ! -d "database-export" ]; then
    echo "❌ Папка database-export не найдена!"
    echo "Скопируйте папку database-export с вашего локального компьютера на сервер"
    exit 1
fi

# Находим последний SQL файл
SQL_FILE=$(ls -t database-export/database_backup_*.sql 2>/dev/null | head -1)

if [ -z "$SQL_FILE" ]; then
    echo "❌ SQL файл не найден в database-export/"
    exit 1
fi

echo "📄 Найден файл: $SQL_FILE"
echo ""

# Проверяем, запущены ли контейнеры
if ! docker compose -f docker-compose.production.yml ps | grep -q "Up"; then
    echo "⚠️  Контейнеры не запущены. Запускаем..."
    docker compose -f docker-compose.production.yml up -d
    echo "⏳ Ждём запуска базы данных..."
    sleep 15
fi

echo "🔄 Импортируем данные в базу..."
docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db < "$SQL_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Данные успешно импортированы!"
else
    echo "❌ Ошибка импорта данных!"
    exit 1
fi

# Восстанавливаем uploads
UPLOADS_FILE=$(ls -t database-export/uploads_*.tar.gz 2>/dev/null | head -1)

if [ -n "$UPLOADS_FILE" ]; then
    echo "📦 Восстанавливаем файлы uploads..."
    tar -xzf "$UPLOADS_FILE"
    echo "✅ Файлы uploads восстановлены!"
else
    echo "⚠️  Архив uploads не найден, пропускаем..."
fi

echo ""
echo "🔄 Перезапускаем приложение..."
docker compose -f docker-compose.production.yml restart

echo ""
echo "✅ Импорт завершён успешно!"
echo ""
echo "🌐 Ваше приложение доступно с полными данными"
echo ""
