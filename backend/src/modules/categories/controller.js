import * as categoryService from './service.js';
import { success, error, paginated } from '../../utils/responses.js';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination.js';

export async function getAll(request, reply) {
  try {
    const { page, limit, skip } = getPaginationParams(request);
    const { data, total } = await categoryService.getAll(skip, limit);
    const meta = getPaginationMeta(total, page, limit);
    return paginated(reply, data, meta);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function getById(request, reply) {
  try {
    const { id } = request.params;
    const category = await categoryService.getById(id);
    
    if (!category) {
      return error(reply, 'Category not found', 404);
    }
    
    return success(reply, category);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function create(request, reply) {
  try {
    const categoryData = request.body;
    const category = await categoryService.create(categoryData);
    return success(reply, category, 201);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function update(request, reply) {
  try {
    const { id } = request.params;
    const categoryData = request.body;
    const category = await categoryService.update(id, categoryData);
    
    if (!category) {
      return error(reply, 'Category not found', 404);
    }
    
    return success(reply, category);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function remove(request, reply) {
  try {
    const { id } = request.params;
    await categoryService.remove(id);
    return success(reply, { message: 'Category deleted' });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

