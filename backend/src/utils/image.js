import sharp from 'sharp';
import path from 'path';
import { randomBytes } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Проверяет, является ли файл изображением PNG или JPG
 */
export function isPngOrJpg(mimetype) {
  return ['image/png', 'image/jpeg', 'image/jpg'].includes(mimetype);
}

/**
 * Сохраняет оригинальное изображение в папку originals
 */
export async function saveOriginal(file, module) {
  const originalsDir = path.join(__dirname, '../../uploads/originals', module);
  if (!existsSync(originalsDir)) {
    await mkdir(originalsDir, { recursive: true });
  }
  
  const ext = path.extname(file.filename);
  const fileName = `${randomBytes(16).toString('hex')}${ext}`;
  const filePath = path.join(originalsDir, fileName);
  
  const buffer = await file.toBuffer();
  await writeFile(filePath, buffer);
  
  return `/static/originals/${module}/${fileName}`;
}

/**
 * Конвертирует изображение в WebP и сохраняет
 */
export async function convertToWebP(file, module) {
  const uploadDir = path.join(__dirname, '../../uploads', module);
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }
  
  const fileName = `${randomBytes(16).toString('hex')}.webp`;
  const filePath = path.join(uploadDir, fileName);
  
  const buffer = await file.toBuffer();
  
  // Конвертируем в WebP с оптимизацией
  await sharp(buffer)
    .webp({ quality: 85, effort: 6 })
    .toFile(filePath);
  
  return `/static/${module}/${fileName}`;
}

/**
 * Сохраняет изображение: конвертирует PNG/JPG в WebP, оригинал сохраняет отдельно
 */
export async function saveImage(file, module) {
  const isImage = isPngOrJpg(file.mimetype);
  
  if (isImage) {
    // Сохраняем оригинал в папку originals
    const originalUrl = await saveOriginal(file, module);
    
    // Конвертируем и сохраняем WebP версию
    const webpUrl = await convertToWebP(file, module);
    
    return {
      url: webpUrl, // Возвращаем URL WebP версии
      originalUrl, // URL оригинального файла (для справки)
      format: 'webp',
    };
  } else {
    // Если уже WebP или другой формат, сохраняем как есть
    const uploadDir = path.join(__dirname, '../../uploads', module);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    const ext = path.extname(file.filename);
    const fileName = `${randomBytes(16).toString('hex')}${ext}`;
    const filePath = path.join(uploadDir, fileName);
    
    const buffer = await file.toBuffer();
    await writeFile(filePath, buffer);
    
    return {
      url: `/static/${module}/${fileName}`,
      format: ext.replace('.', ''),
    };
  }
}

