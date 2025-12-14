import * as service from './service.js';
import { success, error } from '../../../utils/responses.js';
import { parseRequestData } from '../../../utils/request.js';
import { saveImage } from '../../../utils/image.js';

export async function getAll(request, reply) {
  try {
    const team = await service.getAll();
    return success(reply, { data: team });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function getById(request, reply) {
  try {
    const member = await service.getById(request.params.id);
    if (!member) return error(reply, 'Член команды не найден', 404);
    return success(reply, member);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function create(request, reply) {
  try {
    const rawData = await parseRequestData(request);
    const data = { ...rawData };
    if (rawData.photo && rawData.photo.file) {
      const result = await saveImage(rawData.photo, 'team');
      data.photo = result.url; // Используем WebP версию
    }
    // Remove fields that don't exist in schema
    delete data.email;
    delete data.phone;
    delete data.social;
    const member = await service.create(data);
    return success(reply, member, 201);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function update(request, reply) {
  try {
    const rawData = await parseRequestData(request);
    const data = { ...rawData };
    if (rawData.photo && rawData.photo.file) {
      const result = await saveImage(rawData.photo, 'team');
      data.photo = result.url; // Используем WebP версию
    }
    // Remove fields that don't exist in schema
    delete data.email;
    delete data.phone;
    delete data.social;
    const member = await service.update(request.params.id, data);
    if (!member) return error(reply, 'Член команды не найден', 404);
    return success(reply, member);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function remove(request, reply) {
  try {
    await service.remove(request.params.id);
    return success(reply, { message: 'Член команды успешно удален' });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

