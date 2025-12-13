import * as service from './service.js';
import { success, error } from '../../../utils/responses.js';
import { parseRequestData } from '../../../utils/request.js';
import { saveImage } from '../../../utils/image.js';

export async function getAll(request, reply) {
  try {
    const partners = await service.getAll();
    return success(reply, { data: partners });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function getById(request, reply) {
  try {
    const partner = await service.getById(request.params.id);
    if (!partner) return error(reply, 'Партнёр не найден', 404);
    return success(reply, partner);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function create(request, reply) {
  try {
    const rawData = await parseRequestData(request);
    const data = { ...rawData };
    if (rawData.logo && rawData.logo.file) {
      const result = await saveImage(rawData.logo, 'partners');
      data.logo = result.url; // Используем WebP версию
    }
    const partner = await service.create(data);
    return success(reply, partner, 201);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function update(request, reply) {
  try {
    const rawData = await parseRequestData(request);
    const data = { ...rawData };
    if (rawData.logo && rawData.logo.file) {
      const result = await saveImage(rawData.logo, 'partners');
      data.logo = result.url; // Используем WebP версию
    }
    const partner = await service.update(request.params.id, data);
    if (!partner) return error(reply, 'Партнёр не найден', 404);
    return success(reply, partner);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function remove(request, reply) {
  try {
    await service.remove(request.params.id);
    return success(reply, { message: 'Партнёр успешно удален' });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

