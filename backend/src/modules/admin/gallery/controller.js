import * as service from './service.js';
import { success, error, paginated } from '../../../utils/responses.js';
import { getPaginationParams, getPaginationMeta } from '../../../utils/pagination.js';
import { parseRequestData } from '../../../utils/request.js';
import { saveImage } from '../../../utils/image.js';

export async function getAll(request, reply) {
  try {
    const { page, limit, skip } = getPaginationParams(request);
    const { data, total } = await service.getAll(skip, limit, request.query);
    const meta = getPaginationMeta(total, page, limit);
    return paginated(reply, data, meta);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function getById(request, reply) {
  try {
    const item = await service.getById(request.params.id);
    if (!item) return error(reply, 'Изображение не найдено', 404);
    return success(reply, item);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function create(request, reply) {
  try {
    const rawData = await parseRequestData(request);
    const data = { ...rawData };
    
    if (rawData.image && rawData.image.file) {
      const result = await saveImage(rawData.image, 'gallery');
      data.image = result.url; // Используем WebP версию
    }
    
    if (!data.image) {
      return error(reply, 'Изображение обязательно', 400);
    }
    
    // Валидация и нормализация данных
    const itemData = {
      image: data.image,
      sectionId: data.sectionId || null,
      category: data.category?.trim() || null,
      description: data.description?.trim() || null,
      sortOrder: data.sortOrder ? parseInt(data.sortOrder, 10) : 0,
    };
    
    // Если sectionId указан, проверяем что секция существует
    if (itemData.sectionId) {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      const section = await prisma.gallerySection.findUnique({
        where: { id: itemData.sectionId },
      });
      if (!section) {
        return error(reply, 'Секция не найдена', 400);
      }
    }
    
    const item = await service.create(itemData);
    return success(reply, item, 201);
  } catch (err) {
    console.error('Error creating gallery item:', err);
    return error(reply, err.message || 'Ошибка при создании изображения', 500);
  }
}

export async function update(request, reply) {
  try {
    const rawData = await parseRequestData(request);
    const data = { ...rawData };
    if (rawData.image && rawData.image.file) {
      const result = await saveImage(rawData.image, 'gallery');
      data.image = result.url; // Используем WebP версию
    }
    const item = await service.update(request.params.id, data);
    if (!item) return error(reply, 'Изображение не найдено', 404);
    return success(reply, item);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function remove(request, reply) {
  try {
    await service.remove(request.params.id);
    return success(reply, { message: 'Изображение успешно удалено' });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

