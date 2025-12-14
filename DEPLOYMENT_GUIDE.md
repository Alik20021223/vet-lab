# 🚀 Руководство по развертыванию VetLab на VPS

Это руководство покажет, как развернуть полный проект VetLab (Frontend + Backend + База данных) на облачном VPS сервере.

## 📋 Предварительные требования

### На вашем локальном компьютере:
- Git установлен
- SSH клиент

### На VPS сервере:
- Ubuntu 20.04/22.04 или Debian 11/12
- Минимум 2GB RAM, 2 CPU, 20GB диска
- Root или sudo доступ
- Статический IP адрес
- (Опционально) Доменное имя, направленное на IP сервера

## 🎯 Шаг 1: Подготовка VPS сервера

### 1.1 Подключитесь к серверу через SSH

```bash
ssh root@your-server-ip
# или
ssh your-username@your-server-ip
```

### 1.2 Обновите систему

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Установите Docker и Docker Compose

```bash
# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Добавьте пользователя в группу docker (если не root)
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo apt install docker-compose-plugin -y

# Проверка установки
docker --version
docker compose version
```

### 1.4 Установите Nginx (как обратный прокси)

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 1.5 (Опционально) Установите UFW Firewall

```bash
sudo apt install ufw -y
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## 🎯 Шаг 2: Загрузка проекта на сервер

### Вариант А: Через Git (рекомендуется)

#### 2.1 Инициализируйте Git локально (если еще не сделано)

```bash
# На вашем локальном компьютере, в папке проекта
cd /Users/alishergaffarov/Desktop/js/vet-lab
git init
git add .
git commit -m "Initial commit"
```

#### 2.2 Создайте репозиторий на GitHub/GitLab

1. Создайте новый приватный репозиторий на GitHub
2. Свяжите локальный проект с удаленным:

```bash
git remote add origin https://github.com/your-username/vet-lab.git
git branch -M main
git push -u origin main
```

#### 2.3 Клонируйте на сервер

```bash
# На VPS сервере
cd /home
git clone https://github.com/your-username/vet-lab.git
cd vet-lab
```

### Вариант Б: Через SCP/SFTP

```bash
# На вашем локальном компьютере
cd /Users/alishergaffarov/Desktop/js
tar -czf vet-lab.tar.gz vet-lab/
scp vet-lab.tar.gz root@your-server-ip:/home/

# На VPS сервере
cd /home
tar -xzf vet-lab.tar.gz
cd vet-lab
```

## 🎯 Шаг 3: Настройка переменных окружения

### 3.1 Backend Environment Variables

```bash
cd /home/vet-lab
nano .env.production
```

Вставьте следующее содержимое (измените значения!):

```env
# Database
DATABASE_URL=postgresql://vetlab_user:STRONG_PASSWORD_HERE@db:5432/vetlab_db?schema=public

# JWT Secrets (сгенерируйте надежные ключи!)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters
JWT_EXPIRES_IN=1h

# App Config
NODE_ENV=production
PORT=3000

# CORS (ваш домен или IP)
CORS_ORIGIN=https://yourdomain.com

# Upload settings
UPLOAD_MAX_SIZE=10485760
UPLOAD_DIR=./uploads
```

**Генерация надежных секретов:**
```bash
# Сгенерируйте случайные строки
openssl rand -base64 32
openssl rand -base64 32
```

### 3.2 Frontend Environment Variables

**⚠️ ВАЖНО:** Настройте API URL для фронтенда!

```bash
# В корне проекта (рекомендуется)
nano .env.production
```

Добавьте:

```env
# API URL для фронтенда
# Рекомендуется относительный путь (работает на любом домене):
VITE_API_URL=/api

# Или полный URL (если API на другом домене):
# VITE_API_URL=https://yourdomain.com/api
```

**📖 Подробнее:** см. `API_URL_CONFIGURATION.md`

## 🎯 Шаг 4: Перенос данных (опционально)

Если у вас уже есть заполненная база данных на локальном компьютере:

```bash
# На вашем локальном компьютере
cd /Users/alishergaffarov/Desktop/js/vet-lab
bash scripts/export-database.sh

# Скопируйте на сервер
scp -r database-export root@your-server-ip:/home/vet-lab/
```

**📖 Подробное руководство:** см. файл `TRANSFER_DATA_GUIDE.md`

## 🎯 Шаг 5: Сборка и запуск с Docker

### 5.1 Используйте Docker Compose для деплоя

Проект уже содержит `docker-compose.production.yml` файл в корне. Запустите его:

```bash
cd /home/vet-lab

# Соберите и запустите все сервисы
docker compose -f docker-compose.production.yml up -d --build

# Проверьте статус
docker compose -f docker-compose.production.yml ps
```

**Что происходит:**
- 🐘 **PostgreSQL** - база данных запускается
- ⚡ **Backend** - Fastify API собирается и запускается
- ⚛️ **Frontend** - React проект собирается (`npm run build`) и отдаётся через Nginx

**Важно:** Frontend работает как production build, НЕ как dev server!

### 5.2 Выполните миграции базы данных

**Важно:** Node.js НЕ нужен на сервере! Prisma работает внутри Docker контейнера.

```bash
# Выполните миграции Prisma (внутри контейнера backend)
docker compose -f docker-compose.production.yml exec -T backend npx prisma migrate deploy
```

**Что происходит:**
- Команда выполняется **внутри контейнера backend**
- В контейнере уже есть Node.js и Prisma Client (сгенерирован при сборке образа)
- Миграции применяются к базе данных

**📖 Подробнее:** см. `PRISMA_ON_SERVER.md`

### 5.3 Импорт данных (если вы перенесли их)

Если вы на шаге 4 скопировали папку `database-export`:

```bash
bash scripts/import-database.sh
```

Или создайте администратора вручную:

```bash
docker compose -f docker-compose.production.yml exec backend npm run create-admin
```

Следуйте инструкциям для создания первого admin пользователя.

### 5.4 Проверьте логи

```bash
# Все сервисы
docker compose -f docker-compose.production.yml logs -f

# Только backend
docker compose -f docker-compose.production.yml logs -f backend

# Только frontend
docker compose -f docker-compose.production.yml logs -f frontend
```

## 🎯 Шаг 6: Настройка Nginx как обратного прокси

### 6.1 Создайте конфигурацию Nginx

```bash
sudo nano /etc/nginx/sites-available/vetlab
```

Вставьте следующее:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;  # Измените на ваш домен или IP
    
    client_max_body_size 10M;
    
    # Frontend (React Production Build)
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files (uploads)
    location /static {
        alias /home/vet-lab/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6.2 Включите конфигурацию

```bash
# Создайте символическую ссылку
sudo ln -s /etc/nginx/sites-available/vetlab /etc/nginx/sites-enabled/

# Удалите дефолтную конфигурацию
sudo rm /etc/nginx/sites-enabled/default

# Проверьте конфигурацию
sudo nginx -t

# Перезагрузите Nginx
sudo systemctl reload nginx
```

## 🔒 Шаг 7: Настройка SSL сертификата (HTTPS)

### 7.1 Установите Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 7.2 Получите SSL сертификат

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Следуйте инструкциям Certbot. Он автоматически настроит SSL и обновит конфигурацию Nginx.

### 7.3 Автоматическое обновление сертификата

```bash
# Certbot автоматически добавляет cron задачу, проверьте:
sudo systemctl status certbot.timer
```

## 🎯 Шаг 8: Управление приложением

### Основные команды:

```bash
cd /home/vet-lab

# Остановить все сервисы
docker compose -f docker-compose.production.yml down

# Запустить сервисы
docker compose -f docker-compose.production.yml up -d

# Перезапустить сервисы
docker compose -f docker-compose.production.yml restart

# Обновить код и пересобрать
git pull
docker compose -f docker-compose.production.yml up -d --build

# Посмотреть логи
docker compose -f docker-compose.production.yml logs -f

# Выполнить команду в контейнере backend
docker compose -f docker-compose.production.yml exec backend npm run create-admin
```

## 📦 Резервное копирование

### Бэкап базы данных:

```bash
# Создать дамп БД
docker compose -f docker-compose.production.yml exec -T db pg_dump -U vetlab_user vetlab_db > backup_$(date +%Y%m%d).sql

# Восстановить из дампа
docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db < backup_20250101.sql
```

### Бэкап файлов загрузок:

```bash
# Создать архив uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz backend/uploads/

# Восстановить
tar -xzf uploads_backup_20250101.tar.gz
```

## 🔧 Устранение неполадок

### Проблема: Контейнеры не запускаются

```bash
# Проверьте логи
docker compose -f docker-compose.production.yml logs

# Проверьте статус
docker compose -f docker-compose.production.yml ps

# Пересоздайте контейнеры
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml up -d --force-recreate
```

### Проблема: База данных не подключается

```bash
# Проверьте, что контейнер БД запущен
docker compose -f docker-compose.production.yml ps db

# Проверьте подключение
docker compose -f docker-compose.production.yml exec backend npx prisma db pull
```

### Проблема: 502 Bad Gateway в Nginx

```bash
# Проверьте, что backend запущен
docker compose -f docker-compose.production.yml ps backend

# Проверьте логи backend
docker compose -f docker-compose.production.yml logs backend

# Проверьте логи Nginx
sudo tail -f /var/log/nginx/error.log
```

## 🎉 Готово!

Ваше приложение теперь доступно по адресу:
- **Frontend**: http://yourdomain.com (или http://your-server-ip)
- **Backend API**: http://yourdomain.com/api
- **Admin Panel**: http://yourdomain.com/admin

## 📚 Дополнительные рекомендации

1. **Регулярные обновления**: Обновляйте систему и Docker образы
2. **Мониторинг**: Настройте мониторинг (Prometheus, Grafana)
3. **Логирование**: Настройте централизованное логирование
4. **Автоматические бэкапы**: Настройте cron задачи для бэкапов
5. **CDN**: Используйте CDN для статических файлов (Cloudflare)
6. **Rate Limiting**: Настройте ограничение запросов в Nginx
