import * as service from './service.js';
import { success, error, paginated } from '../../utils/responses.js';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination.js';
import { saveFile } from '../../utils/file.js';

export async function getAll(request, reply) {
  try {
    const { page, limit, skip } = getPaginationParams(request);
    const { data, total } = await service.getAll(skip, limit);
    const meta = getPaginationMeta(total, page, limit);
    return paginated(reply, data, meta);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function getById(request, reply) {
  try {
    const { id } = request.params;
    const item = await service.getById(id);
    if (!item) return error(reply, 'Not found', 404);
    return success(reply, item);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function create(request, reply) {
  try {
    const data = request.body;
    const parts = request.parts();
    for await (const part of parts) {
      if (part.file && part.fieldname === 'image') {
        data.image = await saveFile(part, 'additives');
      }
    }
    const item = await service.create(data);
    return success(reply, item, 201);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function update(request, reply) {
  try {
    const { id } = request.params;
    const data = request.body;
    const parts = request.parts();
    for await (const part of parts) {
      if (part.file && part.fieldname === 'image') {
        data.image = await saveFile(part, 'additives');
      }
    }
    const item = await service.update(id, data);
    if (!item) return error(reply, 'Not found', 404);
    return success(reply, item);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function remove(request, reply) {
  try {
    const { id } = request.params;
    await service.remove(id);
    return success(reply, { message: 'Deleted' });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

