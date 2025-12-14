import TelegramBot from 'node-telegram-bot-api';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

let bot = null;

// Инициализация бота (без polling, только для отправки)
function initBot() {
  if (!bot && TELEGRAM_BOT_TOKEN) {
    try {
      bot = new TelegramBot(TELEGRAM_BOT_TOKEN);
    } catch (error) {
      console.error('Failed to initialize Telegram bot:', error);
    }
  }
  return bot;
}

/**
 * Отправляет уведомление в Telegram о новом обращении
 * @param {Object} contact - Данные обращения
 * @returns {Promise<boolean>} - Успешность отправки
 */
export async function sendTelegramNotification(contact) {
  // Проверяем наличие токена и chat ID
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials not configured, skipping notification');
    return false;
  }

  try {
    const telegramBot = initBot();
    if (!telegramBot) {
      console.error('Failed to initialize Telegram bot');
      return false;
    }

    const message = formatContactMessage(contact);
    
    await telegramBot.sendMessage(TELEGRAM_CHAT_ID, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });

    console.log('Telegram notification sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
}

/**
 * Форматирует сообщение для Telegram
 * @param {Object} contact - Данные обращения
 * @returns {string} - Отформатированное сообщение
 */
function formatContactMessage(contact) {
  const {
    name,
    email,
    phone,
    message,
    contextType,
    contextTitle,
    createdAt,
  } = contact;

  let messageText = '🔔 <b>Новое обращение с сайта VET-LAB</b>\n\n';

  // Информация о клиенте
  messageText += '👤 <b>Клиент:</b> ' + escapeHtml(name) + '\n';
  
  if (phone) {
    messageText += '📞 <b>Телефон:</b> ' + escapeHtml(phone) + '\n';
  }
  
  if (email) {
    messageText += '📧 <b>Email:</b> ' + escapeHtml(email) + '\n';
  }

  messageText += '\n';

  // Контекст обращения
  if (contextType && contextTitle) {
    if (contextType === 'product') {
      messageText += '📦 <b>По продукту:</b>\n';
      messageText += escapeHtml(contextTitle) + '\n\n';
    } else if (contextType === 'service') {
      messageText += '💼 <b>По услуге:</b>\n';
      messageText += escapeHtml(contextTitle) + '\n\n';
    }
  }

  // Сообщение клиента
  if (message) {
    messageText += '💬 <b>Сообщение:</b>\n';
    messageText += escapeHtml(message) + '\n\n';
  }

  // Дата и время
  const date = new Date(createdAt);
  const dateStr = date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  messageText += '🕐 <b>Дата:</b> ' + dateStr + ', ' + timeStr;

  return messageText;
}

/**
 * Экранирует HTML символы для Telegram
 * @param {string} text - Текст для экранирования
 * @returns {string} - Экранированный текст
 */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Тестирует подключение к Telegram боту
 * @returns {Promise<boolean>} - Успешность теста
 */
export async function testTelegramConnection() {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not configured');
    return false;
  }

  try {
    const telegramBot = initBot();
    if (!telegramBot) {
      return false;
    }

    const botInfo = await telegramBot.getMe();
    console.log('Telegram bot connected:', botInfo.username);
    return true;
  } catch (error) {
    console.error('Failed to connect to Telegram bot:', error);
    return false;
  }
}




