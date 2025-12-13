#!/bin/bash

# VetLab Backup Script
# Creates backups of database and uploaded files

set -e

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "🔒 VetLab Backup Script"
echo "======================"
echo ""

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup database
echo "📦 Backing up database..."
docker compose -f docker-compose.production.yml exec -T db \
    pg_dump -U vetlab_user vetlab_db > "$BACKUP_DIR/db_backup_$DATE.sql"

if [ $? -eq 0 ]; then
    echo "✅ Database backup created: $BACKUP_DIR/db_backup_$DATE.sql"
else
    echo "❌ Database backup failed!"
    exit 1
fi

# Backup uploads directory
echo "📦 Backing up uploaded files..."
tar -czf "$BACKUP_DIR/uploads_backup_$DATE.tar.gz" backend/uploads/

if [ $? -eq 0 ]; then
    echo "✅ Uploads backup created: $BACKUP_DIR/uploads_backup_$DATE.tar.gz"
else
    echo "❌ Uploads backup failed!"
    exit 1
fi

# List backups
echo ""
echo "📋 Available backups:"
ls -lh $BACKUP_DIR | grep backup

echo ""
echo "✅ Backup completed successfully!"
echo ""
echo "💡 To restore from backup:"
echo "   Database:  docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db < $BACKUP_DIR/db_backup_$DATE.sql"
echo "   Uploads:   tar -xzf $BACKUP_DIR/uploads_backup_$DATE.tar.gz"
