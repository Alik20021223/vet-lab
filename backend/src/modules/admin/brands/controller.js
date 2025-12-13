import * as service from './service.js';
import { success, error } from '../../../utils/responses.js';
import { parseRequestData } from '../../../utils/request.js';
import { saveImage } from '../../../utils/image.js';

export async function getAll(request, reply) {
  try {
    const brands = await service.getAll();
    return success(reply, { data: brands });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function getById(request, reply) {
  try {
    const brand = await service.getById(request.params.id);
    if (!brand) return error(reply, 'Бренд не найден', 404);
    return success(reply, brand);
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
    const brand = await service.create(data);
    return success(reply, brand, 201);
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
    const brand = await service.update(request.params.id, data);
    if (!brand) return error(reply, 'Бренд не найден', 404);
    return success(reply, brand);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function remove(request, reply) {
  try {
    const count = await service.getProductsCount(request.params.id);
    if (count > 0) {
      return error(reply, 'Невозможно удалить бренд, так как есть товары с этим брендом', 400);
    }
    await service.remove(request.params.id);
    return success(reply, { message: 'Бренд успешно удален' });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

