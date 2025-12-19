import * as service from './sections-service.js';
import { success, error } from '../../../utils/responses.js';

export async function getAllSections(request, reply) {
  try {
    const sections = await service.getAllSections();
    return success(reply, sections);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function getSectionById(request, reply) {
  try {
    const section = await service.getSectionById(request.params.id);
    if (!section) return error(reply, 'Секция не найдена', 404);
    return success(reply, section);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function createSection(request, reply) {
  try {
    const data = request.body;
    console.log('Received data for section creation:', data);
    
    // Валидация и нормализация данных
    const sectionData = {
      title: data.title?.trim(),
      titleEn: data.titleEn?.trim() || null,
      sortOrder: data.sortOrder ? parseInt(data.sortOrder, 10) : 0,
    };
    
    if (!sectionData.title) {
      return error(reply, 'Название секции обязательно', 400);
    }
    
    console.log('Normalized section data:', sectionData);
    
    const section = await service.createSection(sectionData);
    return success(reply, section, 201);
  } catch (err) {
    console.error('Error creating gallery section:', err);
    console.error('Error stack:', err.stack);
    const errorMessage = err.message || 'Ошибка при создании секции';
    
    // Если ошибка связана с отсутствием модели, даем более понятное сообщение
    if (errorMessage.includes('gallerySection') || errorMessage.includes('not available')) {
      return error(reply, 'Модель галереи не найдена. Выполните: npx prisma generate', 500);
    }
    
    return error(reply, errorMessage, 500);
  }
}

export async function updateSection(request, reply) {
  try {
    const section = await service.updateSection(request.params.id, request.body);
    if (!section) return error(reply, 'Секция не найдена', 404);
    return success(reply, section);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function removeSection(request, reply) {
  try {
    await service.removeSection(request.params.id);
    return success(reply, { message: 'Секция успешно удалена' });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}
