import * as service from './service.js';
import { success, error, paginated } from '../../../utils/responses.js';
import { getPaginationParams, getPaginationMeta } from '../../../utils/pagination.js';

export async function getAll(request, reply) {
  try {
    const { page, limit, skip } = getPaginationParams(request);
    const { data, total } = await service.getAll(skip, limit, request.query);
    const meta = getPaginationMeta(total, page, limit);
    
    // Преобразуем type обратно в формат с дефисом
    const formattedData = data.map(job => ({
      ...job,
      type: job.type.replace('_', '-'), // full_time -> full-time
    }));
    
    return paginated(reply, formattedData, meta);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function getById(request, reply) {
  try {
    const { id } = request.params;
    const job = await service.getById(id);
    if (!job) return error(reply, 'Вакансия не найдена', 404);
    
    // Преобразуем type обратно в формат с дефисом
    return success(reply, {
      ...job,
      type: job.type.replace('_', '-'), // full_time -> full-time
    });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function create(request, reply) {
  try {
    const data = request.body;
    const job = await service.create(data);
    return success(reply, {
      ...job,
      type: job.type.replace('_', '-'), // full_time -> full-time
    }, 201);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function update(request, reply) {
  try {
    const { id } = request.params;
    const data = request.body;
    const job = await service.update(id, data);
    if (!job) return error(reply, 'Вакансия не найдена', 404);
    
    return success(reply, {
      ...job,
      type: job.type.replace('_', '-'), // full_time -> full-time
    });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function remove(request, reply) {
  try {
    const { id } = request.params;
    await service.remove(id);
    return success(reply, { message: 'Вакансия успешно удалена' });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

