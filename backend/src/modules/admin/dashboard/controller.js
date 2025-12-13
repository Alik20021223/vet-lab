import * as dashboardService from './service.js';
import { success, error } from '../../../utils/responses.js';

export async function getStats(request, reply) {
  try {
    const stats = await dashboardService.getStats();
    return success(reply, stats);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function getActivity(request, reply) {
  try {
    const filters = {
      limit: request.query.limit,
      offset: request.query.offset,
      entity: request.query.entity,
      action: request.query.action,
      userId: request.query.userId,
    };
    
    const result = await dashboardService.getActivity(filters);
    return success(reply, result);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

