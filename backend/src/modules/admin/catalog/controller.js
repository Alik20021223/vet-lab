import * as catalogService from './service.js';
import { success, error, paginated } from '../../../utils/responses.js';
import { getPaginationParams, getPaginationMeta } from '../../../utils/pagination.js';

export async function getAll(request, reply) {
  try {
    const { page, limit, skip } = getPaginationParams(request);
    const { data, total } = await catalogService.getAll(skip, limit, request.query);
    const meta = getPaginationMeta(total, page, limit);
    return paginated(reply, data, meta);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function getById(request, reply) {
  try {
    const { id } = request.params;
    const item = await catalogService.getById(id);
    if (!item) return error(reply, 'Товар не найден', 404);
    return success(reply, item);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function create(request, reply) {
  try {
    // Используем JSON body, файлы загружаются отдельно через /api/upload
    const data = request.body;
    
    // Set createdBy
    data.createdById = request.user.id;
    
    const item = await catalogService.create(data);
    
    // Форматируем ответ согласно документации
    const formattedItem = {
      ...item,
      category: item.category === 'feed_additives' ? 'feed-additives' : item.category,
      brand: item.brand || null,
      documents: item.documents || [],
    };
    
    return success(reply, formattedItem, 201);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function update(request, reply) {
  try {
    const { id } = request.params;
    // Используем JSON body, файлы загружаются отдельно через /api/upload
    const data = request.body;
    
    const item = await catalogService.update(id, data);
    if (!item) return error(reply, 'Товар не найден', 404);
    
    // Форматируем ответ согласно документации
    const formattedItem = {
      ...item,
      category: item.category === 'feed_additives' ? 'feed-additives' : item.category,
      brand: item.brand || null,
      documents: item.documents || [],
    };
    
    return success(reply, formattedItem);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function remove(request, reply) {
  try {
    const { id } = request.params;
    await catalogService.remove(id);
    return success(reply, { message: 'Товар успешно удален' });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

