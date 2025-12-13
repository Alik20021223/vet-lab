import { PrismaClient } from '@prisma/client';
import { sendTelegramNotification } from '../utils/telegram.js';

const prisma = new PrismaClient();

export default async function (app) {
  // GET /api/contacts - контактная информация компании
  app.get('/', async (request, reply) => {
    try {
      // Get the latest contact info (assuming single record or latest)
      const contactInfo = await prisma.contactInfo.findFirst({
        orderBy: { updatedAt: 'desc' },
      });

      if (!contactInfo) {
        return reply.code(404).send({
          error: { message: 'Контактная информация не найдена', code: 'NOT_FOUND' },
        });
      }

      return {
        phone: contactInfo.phone,
        email: contactInfo.email,
        address: contactInfo.address,
        addressEn: contactInfo.addressEn,
        mapLat: contactInfo.mapLat,
        mapLng: contactInfo.mapLng,
        workingHours: contactInfo.workingHours,
        workingHoursEn: contactInfo.workingHoursEn,
        requisites: contactInfo.requisites || {},
      };
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });

  // POST /api/contacts/submit - создание обращения (публичный endpoint)
  app.post('/submit', async (request, reply) => {
    try {
      const {
        name,
        email,
        phone,
        message,
        contextType,
        contextId,
        contextTitle,
      } = request.body;

      // Валидация обязательных полей
      if (!name || !message) {
        return reply.code(400).send({
          error: { message: 'Имя и сообщение обязательны', code: 'VALIDATION_ERROR' },
        });
      }

      // Создаем обращение
      const contact = await prisma.contact.create({
        data: {
          name,
          email: email || '',
          phone: phone || null,
          message,
          contextType: contextType || null,
          contextId: contextId || null,
          contextTitle: contextTitle || null,
          status: 'new',
        },
      });

      // Отправляем уведомление в Telegram (асинхронно)
      sendTelegramNotification(contact).catch((error) => {
        console.error('Failed to send Telegram notification:', error);
      });

      return reply.code(201).send({
        success: true,
        message: 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.',
      });
    } catch (err) {
      console.error('Error creating contact:', err);
      return reply.code(500).send({
        error: { message: 'Ошибка при создании обращения', code: 'SERVER_ERROR' },
      });
    }
  });
}

