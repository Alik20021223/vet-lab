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
    if (!item) return error(reply, 'Новость не найдена', 404);
    return success(reply, item);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function create(request, reply) {
  try {
    const rawData = await parseRequestData(request);
    const data = { ...rawData };
    if (rawData.coverImage && rawData.coverImage.file) {
      const result = await saveImage(rawData.coverImage, 'misc');
      data.coverImage = result.url; // Используем WebP версию
    }
    data.authorId = request.user.id;
    data.publishedAt = new Date(data.publishedAt);
    const item = await service.create(data);
    return success(reply, item, 201);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function update(request, reply) {
  try {
    const rawData = await parseRequestData(request);
    const data = { ...rawData };
    if (rawData.coverImage && rawData.coverImage.file) {
      const result = await saveImage(rawData.coverImage, 'misc');
      data.coverImage = result.url; // Используем WebP версию
    }
    if (data.publishedAt) {
      data.publishedAt = new Date(data.publishedAt);
    }
    const item = await service.update(request.params.id, data);
    if (!item) return error(reply, 'Новость не найдена', 404);
    return success(reply, item);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function remove(request, reply) {
  try {
    await service.remove(request.params.id);
    return success(reply, { message: 'Новость успешно удалена' });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

