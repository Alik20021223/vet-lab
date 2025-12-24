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
    
    // Remove requisites if present (no longer needed)
    if (data.requisites !== undefined) {
      delete data.requisites;
    }
    
    // Convert mapLat and mapLng to numbers if they're strings and validate ranges
    if (data.mapLat !== undefined && data.mapLat !== null) {
      const lat = typeof data.mapLat === 'string' ? parseFloat(data.mapLat) : Number(data.mapLat);
      if (isNaN(lat)) {
        return error(reply, 'mapLat must be a valid number', 400);
      }
      if (lat < -90 || lat > 90) {
        return error(reply, 'mapLat must be between -90 and 90', 400);
      }
      data.mapLat = lat;
    }
    if (data.mapLng !== undefined && data.mapLng !== null) {
      const lng = typeof data.mapLng === 'string' ? parseFloat(data.mapLng) : Number(data.mapLng);
      if (isNaN(lng)) {
        return error(reply, 'mapLng must be a valid number', 400);
      }
      if (lng < -180 || lng > 180) {
        return error(reply, 'mapLng must be between -180 and 180', 400);
      }
      data.mapLng = lng;
    }
    
    // Validate required fields
    if (!data.phone || !data.email || !data.address || 
        data.mapLat === undefined || data.mapLat === null ||
        data.mapLng === undefined || data.mapLng === null) {
      return error(reply, 'Missing required fields: phone, email, address, mapLat, mapLng', 400);
    }
    
    // Convert empty strings to null for optional fields
    const optionalFields = ['addressEn', 'workingHours', 'workingHoursEn', 'facebook', 'instagram', 'telegram'];
    optionalFields.forEach(field => {
      if (data[field] === '') {
        data[field] = null;
      }
    });
    
    // Remove undefined values to avoid Prisma issues
    Object.keys(data).forEach(key => {
      if (data[key] === undefined) {
        delete data[key];
      }
    });
    
    const contactInfo = await service.update(data);
    return success(reply, contactInfo);
  } catch (err) {
    console.error('Error updating contact info:', err);
    return error(reply, err.message || 'Failed to update contact information', 500);
  }
}

