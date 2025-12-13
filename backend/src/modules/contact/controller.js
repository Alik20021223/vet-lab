import * as contactService from './service.js';
import { success, error, paginated } from '../../utils/responses.js';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination.js';

export async function getAll(request, reply) {
  try {
    const { page, limit, skip } = getPaginationParams(request);
    const { data, total } = await contactService.getAll(skip, limit);
    const meta = getPaginationMeta(total, page, limit);
    return paginated(reply, data, meta);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function getById(request, reply) {
  try {
    const { id } = request.params;
    const contact = await contactService.getById(id);
    if (!contact) return error(reply, 'Not found', 404);
    return success(reply, contact);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function create(request, reply) {
  try {
    const data = request.body;
    const contact = await contactService.create(data);
    return success(reply, contact, 201);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function update(request, reply) {
  try {
    const { id } = request.params;
    const data = request.body;
    const contact = await contactService.update(id, data);
    if (!contact) return error(reply, 'Not found', 404);
    return success(reply, contact);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function remove(request, reply) {
  try {
    const { id } = request.params;
    await contactService.remove(id);
    return success(reply, { message: 'Deleted' });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

