#!/bin/bash

# Export Database Script
# Экспортирует данные из локальной базы данных для переноса на сервер

set -e

EXPORT_DIR="./database-export"
DATE=$(date +%Y%m%d_%H%M%S)

echo "📦 Экспорт базы данных VetLab"
echo "=============================="
echo ""

# Создаём директорию для экспорта
mkdir -p $EXPORT_DIR

# Проверяем DATABASE_URL в .env
if [ ! -f backend/.env ]; then
    echo "❌ Файл backend/.env не найден!"
    echo "Убедитесь, что вы находитесь в корне проекта"
    exit 1
fi

echo "📋 Определяем тип базы данных..."

# Читаем DATABASE_URL
cd backend
DATABASE_URL=$(grep DATABASE_URL .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")

if [[ $DATABASE_URL == postgresql* ]]; then
    echo "🐘 Обнаружена PostgreSQL"
    
    # Извлекаем параметры подключения
    DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
    
    echo "📦 Экспортируем данные из PostgreSQL..."
    PGPASSWORD=$DB_PASS pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME > "../$EXPORT_DIR/database_backup_$DATE.sql"
    
elif [[ $DATABASE_URL == file:* ]]; then
    echo "📁 Обнаружена SQLite"
    
    # Получаем путь к файлу базы данных
    DB_FILE=$(echo $DATABASE_URL | sed 's/file://')
    
    if [ ! -f "$DB_FILE" ]; then
        echo "❌ Файл базы данных не найден: $DB_FILE"
        exit 1
    fi
    
    echo "📦 Экспортируем данные из SQLite..."
    sqlite3 "$DB_FILE" .dump > "../$EXPORT_DIR/database_backup_$DATE.sql"
    
    # Также копируем сам файл базы данных
    cp "$DB_FILE" "../$EXPORT_DIR/database_$DATE.db"
    
else
    echo "❌ Неизвестный тип базы данных!"
    exit 1
fi

cd ..

if [ $? -eq 0 ]; then
    echo "✅ Данные базы экспортированы: $EXPORT_DIR/database_backup_$DATE.sql"
else
    echo "❌ Ошибка экспорта!"
    exit 1
fi

# Копируем uploads
echo "📦 Копируем загруженные файлы..."
if [ -d "backend/uploads" ]; then
    tar -czf "$EXPORT_DIR/uploads_$DATE.tar.gz" backend/uploads/
    echo "✅ Файлы uploads скопированы: $EXPORT_DIR/uploads_$DATE.tar.gz"
else
    echo "⚠️  Папка backend/uploads не найдена, пропускаем..."
fi

# Создаём README с инструкциями
cat > "$EXPORT_DIR/README.txt" << 'EOF'
# Инструкция по импорту данных на сервер

## 1. Скопируйте этот каталог на сервер:

```bash
scp -r database-export root@your-server-ip:/home/vet-lab/
```

## 2. На сервере импортируйте данные:

### Для PostgreSQL:
```bash
cd /home/vet-lab
docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db < database-export/database_backup_*.sql
```

### Восстановление uploads:
```bash
cd /home/vet-lab
tar -xzf database-export/uploads_*.tar.gz
```

## 3. Перезапустите приложение:
```bash
docker compose -f docker-compose.production.yml restart
```

Готово! Все данные и файлы перенесены.
EOF

echo ""
echo "✅ Экспорт завершён!"
echo ""
echo "📁 Все файлы в папке: $EXPORT_DIR/"
ls -lh $EXPORT_DIR/
echo ""
echo "📝 Следующие шаги:"
echo "1. Скопируйте папку $EXPORT_DIR на сервер:"
echo "   scp -r $EXPORT_DIR root@your-server-ip:/home/vet-lab/"
echo ""
echo "2. На сервере выполните импорт (см. $EXPORT_DIR/README.txt)"
echo ""
