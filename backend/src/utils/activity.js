import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Логирует активность пользователя
 */
export async function logActivity({
  action,
  entity,
  entityId,
  entityName = null,
  userId,
  details,
  metadata = {},
}) {
  try {
    await prisma.activity.create({
      data: {
        action,
        entity,
        entityId,
        entityName,
        userId,
        details,
        metadata,
      },
    });
  } catch (err) {
    // Не прерываем выполнение, если логирование не удалось
    console.error('Failed to log activity:', err);
  }
}

/**
 * Получает название сущности для отображения
 */
export function getEntityName(entity, data) {
  const nameFields = {
    catalog: data?.title,
    service: data?.title,
    news: data?.title,
    team: data?.name,
    partner: data?.name,
    gallery: data?.description || 'Изображение',
    brand: data?.name,
    career: data?.title,
    contact: 'Контактная информация',
    page: data?.title,
  };
  
  return nameFields[entity] || null;
}

/**
 * Формирует описание действия
 */
export function formatActivityDetails(action, entity, entityName, changes = []) {
  const entityLabels = {
    catalog: 'товар',
    service: 'услуга',
    news: 'новость',
    team: 'член команды',
    partner: 'партнер',
    gallery: 'изображение',
    brand: 'бренд',
    career: 'вакансия',
    contact: 'контактная информация',
    page: 'страница',
  };
  
  const actionLabels = {
    create: 'Создан',
    update: 'Обновлен',
    delete: 'Удален',
  };
  
  const entityLabel = entityLabels[entity] || entity;
  const actionLabel = actionLabels[action] || action;
  
  if (action === 'update' && changes.length > 0) {
    return `${actionLabel} ${entityLabel}: ${entityName} (изменены: ${changes.join(', ')})`;
  }
  
  return `${actionLabel} ${entityLabel}: ${entityName || 'неизвестно'}`;
}

