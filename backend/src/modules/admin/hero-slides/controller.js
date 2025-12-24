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
    if (!item) return error(reply, 'Слайд не найден', 404);
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
      const result = await saveImage(rawData.image, 'hero-slides');
      data.image = result.url;
    }
    
    if (!data.image) {
      return error(reply, 'Изображение обязательно', 400);
    }
    
    if (!data.title) {
      return error(reply, 'Заголовок обязателен', 400);
    }
    
    const itemData = {
      image: data.image,
      title: data.title.trim(),
      titleEn: data.titleEn?.trim() || null,
      sortOrder: data.sortOrder ? parseInt(data.sortOrder, 10) : 0,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    };
    
    const item = await service.create(itemData);
    return success(reply, item, 201);
  } catch (err) {
    console.error('Error creating hero slide:', err);
    return error(reply, err.message || 'Ошибка при создании слайда', 500);
  }
}

export async function update(request, reply) {
  try {
    const rawData = await parseRequestData(request);
    const data = { ...rawData };
    
    if (rawData.image && rawData.image.file) {
      const result = await saveImage(rawData.image, 'hero-slides');
      data.image = result.url;
    }
    
    const updateData = {};
    if (data.image !== undefined) updateData.image = data.image;
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.titleEn !== undefined) updateData.titleEn = data.titleEn?.trim() || null;
    if (data.sortOrder !== undefined) updateData.sortOrder = parseInt(data.sortOrder, 10);
    if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);
    
    const item = await service.update(request.params.id, updateData);
    if (!item) return error(reply, 'Слайд не найден', 404);
    return success(reply, item);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function remove(request, reply) {
  try {
    await service.remove(request.params.id);
    return success(reply, { message: 'Слайд успешно удален' });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}
