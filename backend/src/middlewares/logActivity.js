import { logActivity, getEntityName, formatActivityDetails } from '../utils/activity.js';

/**
 * Middleware для логирования активности
 * Используется как preHandler или onResponse hook
 */
export function createActivityLogger(entity) {
  return async function (request, reply) {
    // Сохраняем оригинальный send
    const originalSend = reply.send.bind(reply);
    
    // Переопределяем send для перехвата ответа
    reply.send = async function (payload) {
      // Получаем информацию о пользователе
      const user = request.user;
      if (!user) {
        return originalSend(payload);
      }

      // Определяем действие по методу запроса
      const method = request.method;
      let action = null;
      
      if (method === 'POST') {
        action = 'create';
      } else if (method === 'PUT' || method === 'PATCH') {
        action = 'update';
      } else if (method === 'DELETE') {
        action = 'delete';
      }

      if (!action) {
        return originalSend(payload);
      }

      // Получаем ID сущности
      const entityId = request.params.id || payload?.id || null;
      if (!entityId) {
        return originalSend(payload);
      }

      // Получаем название сущности
      let entityName = null;
      if (action === 'delete') {
        // Для удаления нужно получить название до удаления
        // Это должно быть сделано в контроллере
        entityName = request.entityName || null;
      } else {
        entityName = getEntityName(entity, payload);
      }

      // Формируем метаданные
      const metadata = {
        ip: request.ip || request.headers['x-forwarded-for'] || null,
        userAgent: request.headers['user-agent'] || null,
      };

      // Для update добавляем информацию об измененных полях
      if (action === 'update' && request.body) {
        const changedFields = Object.keys(request.body).filter(
          key => !['updatedAt', 'createdAt'].includes(key)
        );
        if (changedFields.length > 0) {
          metadata.changes = changedFields;
        }
      }

      // Формируем описание
      const changes = metadata.changes || [];
      const details = formatActivityDetails(action, entity, entityName, changes);

      // Логируем активность
      await logActivity({
        action,
        entity,
        entityId,
        entityName,
        userId: user.id,
        details,
        metadata,
      });

      return originalSend(payload);
    };
  };
}

