# ⚡ Быстрое развертывание на VPS

Краткая инструкция для опытных пользователей.

## 1️⃣ На локальном компьютере

```bash
# Инициализация Git (если еще не сделано)
cd /Users/alishergaffarov/Desktop/js/vet-lab
git init
git add .
git commit -m "Initial commit"

# Push в GitHub/GitLab
git remote add origin https://github.com/username/vet-lab.git
git push -u origin main
```

## 2️⃣ На VPS сервере

```bash
# Установка Docker
curl -fsSL https://get.docker.com | sh
sudo apt install docker-compose-plugin -y

# Установка Nginx
sudo apt install nginx certbot python3-certbot-nginx -y

# Клонирование проекта
cd /home
git clone https://github.com/username/vet-lab.git
cd vet-lab

# Создание .env.production
nano .env.production
```

Вставьте:
```env
DB_PASSWORD=strong_password_here
JWT_SECRET=$(openssl rand -base64 32)
REFRESH_SECRET=$(openssl rand -base64 32)
CORS_ORIGIN=https://yourdomain.com
VITE_API_URL=https://yourdomain.com/api
```

```bash
# Запуск с Docker
docker compose -f docker-compose.production.yml up -d --build

# Миграции и создание админа
docker compose -f docker-compose.production.yml exec backend npx prisma migrate deploy
docker compose -f docker-compose.production.yml exec backend npm run create-admin
```

## 3️⃣ Настройка Nginx

```bash
sudo nano /etc/nginx/sites-available/vetlab
```

Вставьте:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static {
        alias /home/vet-lab/backend/uploads;
        expires 30d;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/vetlab /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# SSL сертификат
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 4️⃣ Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## ✅ Готово!

- Frontend: https://yourdomain.com (production build через Nginx)
- Backend API: https://yourdomain.com/api
- Admin: https://yourdomain.com/admin

## 📦 Перенос локальных данных на сервер

### На локальном компьютере:
```bash
# Экспортировать БД и uploads
bash scripts/export-database.sh

# Скопировать на сервер
scp -r database-export root@your-server-ip:/home/vet-lab/
```

### На сервере:
```bash
cd /home/vet-lab
bash scripts/import-database.sh
```

**📖 Подробнее:** см. `TRANSFER_DATA_GUIDE.md`

## 🔄 Обновление

```bash
cd /home/vet-lab
git pull
docker compose -f docker-compose.production.yml up -d --build
```

## 📦 Бэкап

```bash
# База данных
docker compose -f docker-compose.production.yml exec -T db pg_dump -U vetlab_user vetlab_db > backup.sql

# Файлы
tar -czf uploads_backup.tar.gz backend/uploads/
```
