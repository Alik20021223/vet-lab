import { PrismaClient } from '@prisma/client';
import { sendTelegramNotification } from '../../utils/telegram.js';

const prisma = new PrismaClient();

export async function getAll(skip, limit) {
  const [data, total] = await Promise.all([
    prisma.contact.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.contact.count(),
  ]);
  return { data, total };
}

export async function getById(id) {
  return prisma.contact.findUnique({ where: { id } });
}

export async function create(data) {
  // Создаем обращение в базе данных
  const contact = await prisma.contact.create({ data });
  
  // Отправляем уведомление в Telegram (не блокируем ответ клиенту)
  sendTelegramNotification(contact).catch((error) => {
    console.error('Failed to send Telegram notification:', error);
  });
  
  return contact;
}

export async function update(id, data) {
  return prisma.contact.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.contact.delete({ where: { id } });
}

