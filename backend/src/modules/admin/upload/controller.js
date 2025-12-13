import { saveImage } from '../../../utils/image.js';
import { success, error } from '../../../utils/responses.js';

export async function uploadImage(request, reply) {
  try {
    const parts = request.parts();
    let file = null;
    
    for await (const part of parts) {
      if (part.file) {
        file = part;
        break;
      }
    }

    if (!file) {
      return error(reply, 'Файл не найден', 400);
    }

    // Validate image type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return error(reply, 'Неподдерживаемый формат изображения', 400);
    }

    // Сохраняем изображение (конвертируем PNG/JPG в WebP)
    const result = await saveImage(file, 'misc');
    const filename = result.url.split('/').pop();

    return success(reply, {
      url: result.url, // URL WebP версии
      filename,
      size: file.file.bytesRead || 0,
      mimeType: 'image/webp', // Всегда возвращаем webp
      format: result.format,
      ...(result.originalUrl && { originalUrl: result.originalUrl }), // Оригинал только если был конвертирован
    });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function uploadDocument(request, reply) {
  try {
    const parts = request.parts();
    let file = null;
    
    for await (const part of parts) {
      if (part.file) {
        file = part;
        break;
      }
    }

    if (!file) {
      return error(reply, 'Файл не найден', 400);
    }

    // Validate document type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.mimetype)) {
      return error(reply, 'Неподдерживаемый формат документа', 400);
    }

    const url = await saveFile(file, 'misc');
    const filename = url.split('/').pop();

    return success(reply, {
      url,
      filename,
      size: file.file.bytesRead || 0,
      mimeType: file.mimetype,
    });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

