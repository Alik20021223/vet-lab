import * as service from './service.js';
import { success, error } from '../../../utils/responses.js';
import { parseRequestData } from '../../../utils/request.js';

export async function getAll(request, reply) {
  try {
    const pages = await service.getAll();
    return success(reply, { data: pages });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function getBySlug(request, reply) {
  try {
    const page = await service.getBySlug(request.params.slug);
    if (!page) return error(reply, 'Страница не найдена', 404);
    return success(reply, page);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function update(request, reply) {
  try {
    const rawData = await parseRequestData(request);
    const data = { ...rawData };
    if (data.seo && typeof data.seo === 'string') {
      data.seo = JSON.parse(data.seo);
    }
    const page = await service.update(request.params.slug, data);
    if (!page) return error(reply, 'Страница не найдена', 404);
    return success(reply, page);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

