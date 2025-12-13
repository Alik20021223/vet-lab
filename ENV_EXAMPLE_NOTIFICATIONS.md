# Пример заполнения .env для уведомлений

## Для development (backend/.env)

Скопируйте и вставьте в файл `backend/.env`, заполнив своими значениями:

```env
# ===========================================
# DATABASE (уже должно быть)
# ===========================================
DATABASE_URL="postgresql://user:password@localhost:5432/vetlab"

# ===========================================
# JWT SECRETS (уже должно быть)
# ===========================================
JWT_SECRET=your-jwt-secret-key-min-32-chars
REFRESH_SECRET=your-refresh-secret-key-min-32-chars

# ===========================================
# CORS (уже должно быть)
# ===========================================
CORS_ORIGIN=http://localhost:5173

# ===========================================
# TELEGRAM BOT (НОВОЕ - для уведомлений)
# ===========================================
# Получить от @BotFather в Telegram
# Инструкция: см. CONTACT_NOTIFICATIONS_SETUP.md или QUICK_SETUP_CHECKLIST.md
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789

# ===========================================
# EMAIL SMTP (НОВОЕ - для уведомлений)
# ===========================================
# Gmail (рекомендуется для начала):
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=notifications@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM=notifications@gmail.com
NOTIFICATION_EMAIL=admin@vet-lab.tj

# Или Yandex:
# SMTP_HOST=smtp.yandex.ru
# SMTP_PORT=465
# SMTP_SECURE=true
# SMTP_USER=notifications@yandex.ru
# SMTP_PASS=your-app-password
# SMTP_FROM=notifications@yandex.ru
# NOTIFICATION_EMAIL=admin@vet-lab.tj
```

---

## Для production (.env.production)

Используйте обновленный шаблон `env.production.template` с вашими реальными данными.

---

## ✅ Проверка корректности заполнения

### Telegram:
- ✅ `TELEGRAM_BOT_TOKEN` содержит двоеточие `:` (например: `123:ABC`)
- ✅ `TELEGRAM_CHAT_ID` это число (может быть отрицательным для групп)

### Email:
- ✅ `SMTP_USER` и `SMTP_FROM` обычно одинаковые
- ✅ `SMTP_PASS` для Gmail - это 16-символьный App Password (без пробелов)
- ✅ `SMTP_PORT` для Gmail = 587, для Yandex = 465
- ✅ `SMTP_SECURE` для Gmail = false, для Yandex = true
- ✅ `NOTIFICATION_EMAIL` - email, куда будут приходить уведомления

---

## 🎯 Реальный пример заполнения

```env
# Telegram (примеры значений)
TELEGRAM_BOT_TOKEN=5876543210:AAFdB-1234567890abcdefGHIJKLMnopqrs
TELEGRAM_CHAT_ID=987654321

# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=vetlab.notifications@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM=vetlab.notifications@gmail.com
NOTIFICATION_EMAIL=alisher@vet-lab.tj
```

---

## 📝 Шаги после заполнения

1. ✅ Сохраните файл `backend/.env`
2. ✅ Перезапустите backend сервер
3. ✅ Проверьте, что нет ошибок в логах
4. ✅ Отправьте тестовое сообщение через форму

---

**См. также:**
- 📖 Полная инструкция: `CONTACT_NOTIFICATIONS_SETUP.md`
- ⚡ Быстрый чеклист: `QUICK_SETUP_CHECKLIST.md`
