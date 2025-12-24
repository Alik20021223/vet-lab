import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAllSections() {
  return prisma.gallerySection.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      items: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
}

export async function getSectionById(id) {
  return prisma.gallerySection.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
}

export async function createSection(data) {
  try {
    const sectionData = {
      title: data.title,
      titleEn: data.titleEn || null,
      sortOrder: data.sortOrder || 0,
    };
    
    console.log('Creating gallery section with data:', sectionData);
    
    // Пытаемся создать секцию
    const result = await prisma.gallerySection.create({ 
      data: sectionData
    });
    
    return result;
  } catch (error) {
    console.error('Prisma error creating gallery section:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      name: error.name,
    });
    
    // Если ошибка связана с отсутствием модели или свойства
    if (error.message && (
      error.message.includes('Cannot read properties') ||
      error.message.includes('gallerySection') ||
      error.message.includes('undefined')
    )) {
      const helpfulError = new Error(
        'Модель GallerySection не найдена в Prisma Client. ' +
        'Выполните следующие команды:\n' +
        '1. cd backend\n' +
        '2. npx prisma generate\n' +
        '3. Перезапустите сервер'
      );
      helpfulError.originalError = error;
      throw helpfulError;
    }
    
    throw error;
  }
}

export async function updateSection(id, data) {
  return prisma.gallerySection.update({ where: { id }, data });
}

export async function removeSection(id) {
  // Удаляем все изображения в секции
  await prisma.gallery.deleteMany({ where: { sectionId: id } });
  return prisma.gallerySection.delete({ where: { id } });
}
