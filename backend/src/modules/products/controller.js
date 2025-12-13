import * as productService from './service.js';
import { success, error, paginated } from '../../utils/responses.js';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination.js';
import { saveFile } from '../../utils/file.js';
import { parseRequestData } from '../../utils/request.js';

export async function getAll(request, reply) {
  try {
    const { page, limit, skip } = getPaginationParams(request);
    const { data, total } = await productService.getAll(skip, limit);
    const meta = getPaginationMeta(total, page, limit);
    return paginated(reply, data, meta);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function getById(request, reply) {
  try {
    const { id } = request.params;
    const product = await productService.getById(id);
    
    if (!product) {
      return error(reply, 'Product not found', 404);
    }
    
    return success(reply, product);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function create(request, reply) {
  try {
    const rawData = await parseRequestData(request);
    const data = { ...rawData };
    
    // Handle file uploads
    if (rawData.image && rawData.image.file) {
      data.image = await saveFile(rawData.image, 'products');
    }
    
    const product = await productService.create(data);
    return success(reply, product, 201);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function update(request, reply) {
  try {
    const { id } = request.params;
    const rawData = await parseRequestData(request);
    const data = { ...rawData };
    
    // Handle file uploads
    if (rawData.image && rawData.image.file) {
      data.image = await saveFile(rawData.image, 'products');
    }
    
    const product = await productService.update(id, data);
    
    if (!product) {
      return error(reply, 'Product not found', 404);
    }
    
    return success(reply, product);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function remove(request, reply) {
  try {
    const { id } = request.params;
    await productService.remove(id);
    return success(reply, { message: 'Product deleted' });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

