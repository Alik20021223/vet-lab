import * as vaccineService from './service.js';
import { success, error, paginated } from '../../utils/responses.js';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination.js';
import { saveFile } from '../../utils/file.js';

export async function getAll(request, reply) {
  try {
    const { page, limit, skip } = getPaginationParams(request);
    const { data, total } = await vaccineService.getAll(skip, limit);
    const meta = getPaginationMeta(total, page, limit);
    return paginated(reply, data, meta);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function getById(request, reply) {
  try {
    const { id } = request.params;
    const vaccine = await vaccineService.getById(id);
    if (!vaccine) return error(reply, 'Vaccine not found', 404);
    return success(reply, vaccine);
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
        data.image = await saveFile(part, 'vaccines');
      }
    }
    const vaccine = await vaccineService.create(data);
    return success(reply, vaccine, 201);
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
        data.image = await saveFile(part, 'vaccines');
      }
    }
    const vaccine = await vaccineService.update(id, data);
    if (!vaccine) return error(reply, 'Vaccine not found', 404);
    return success(reply, vaccine);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function remove(request, reply) {
  try {
    const { id } = request.params;
    await vaccineService.remove(id);
    return success(reply, { message: 'Vaccine deleted' });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

