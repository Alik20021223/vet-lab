import path from 'path';
import { randomBytes } from 'crypto';
import { writeFile, mkdir, unlink, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generateFileName(originalName) {
  const ext = path.extname(originalName);
  const name = randomBytes(16).toString('hex');
  return `${name}${ext}`;
}

export function getUploadPath(module) {
  return path.join(__dirname, '../../uploads', module);
}

export async function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

export async function saveFile(file, module) {
  const uploadDir = getUploadPath(module);
  await ensureDir(uploadDir);
  
  const fileName = generateFileName(file.filename);
  const filePath = path.join(uploadDir, fileName);
  
  const buffer = await file.toBuffer();
  await writeFile(filePath, buffer);
  
  return `/static/${module}/${fileName}`;
}

/**
 * Удаляет файл по URL (например, /static/misc/abc123.webp)
 */
export async function deleteFile(fileUrl) {
  if (!fileUrl || !fileUrl.startsWith('/static/')) {
    return false;
  }
  
  try {
    // Преобразуем URL в путь файловой системы
    // /static/misc/abc123.webp -> uploads/misc/abc123.webp
    const relativePath = fileUrl.replace('/static/', '');
    const filePath = path.join(__dirname, '../../uploads', relativePath);
    
    if (existsSync(filePath)) {
      await unlink(filePath);
      console.log(`✅ Deleted file: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error deleting file ${fileUrl}:`, error.message);
    return false;
  }
}

/**
 * Удаляет массив файлов
 */
export async function deleteFiles(fileUrls) {
  if (!Array.isArray(fileUrls)) return;
  
  const results = await Promise.allSettled(
    fileUrls.map(url => deleteFile(url))
  );
  
  return results.filter(r => r.status === 'fulfilled' && r.value).length;
}

/**
 * Получает список всех файлов в директории uploads
 */
export async function getAllUploadedFiles() {
  const uploadsDir = path.join(__dirname, '../../uploads');
  const files = [];
  
  async function scanDirectory(dir, prefix = '') {
    try {
      const items = await readdir(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        const relativePath = path.join(prefix, item.name);
        
        if (item.isDirectory()) {
          await scanDirectory(fullPath, relativePath);
        } else if (item.isFile()) {
          files.push(`/static/${relativePath.replace(/\\/g, '/')}`);
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error.message);
    }
  }
  
  await scanDirectory(uploadsDir);
  return files;
}

