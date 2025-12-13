import * as service from './service.js';
import { success, error } from '../../../utils/responses.js';
import { parseRequestData } from '../../../utils/request.js';

export async function get(request, reply) {
  try {
    const contactInfo = await service.get();
    return success(reply, contactInfo);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function update(request, reply) {
  try {
    const rawData = await parseRequestData(request);
    const data = { ...rawData };
    if (data.requisites && typeof data.requisites === 'string') {
      data.requisites = JSON.parse(data.requisites);
    }
    const contactInfo = await service.update(data);
    return success(reply, contactInfo);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

