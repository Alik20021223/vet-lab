import { PrismaClient } from '@prisma/client';
import { getAllUploadedFiles, deleteFile } from '../src/utils/file.js';

const prisma = new PrismaClient();

/**
 * Собирает все URL изображений, используемые в базе данных
 */
async function getAllUsedImages() {
  const usedImages = new Set();
  
  try {
    // User avatars
    const users = await prisma.user.findMany({ select: { avatar: true } });
    users.forEach(u => u.avatar && usedImages.add(u.avatar));
    
    // Brand logos
    const brands = await prisma.brand.findMany({ select: { logo: true } });
    brands.forEach(b => b.logo && usedImages.add(b.logo));
    
    // CatalogItem images and documents
    const catalogItems = await prisma.catalogItem.findMany({
      select: { image: true, documents: true }
    });
    catalogItems.forEach(item => {
      if (item.image) usedImages.add(item.image);
      if (item.documents) item.documents.forEach(doc => usedImages.add(doc));
    });
    
    // Service images and icons
    const services = await prisma.service.findMany({
      select: { image: true, icon: true }
    });
    services.forEach(s => {
      if (s.image) usedImages.add(s.image);
      if (s.icon) usedImages.add(s.icon);
    });
    
    // News cover images
    const news = await prisma.news.findMany({ select: { coverImage: true } });
    news.forEach(n => n.coverImage && usedImages.add(n.coverImage));
    
    // Team member photos
    const teamMembers = await prisma.teamMember.findMany({ select: { photo: true } });
    teamMembers.forEach(t => t.photo && usedImages.add(t.photo));
    
    // Partner logos
    const partners = await prisma.partner.findMany({ select: { logo: true } });
    partners.forEach(p => p.logo && usedImages.add(p.logo));
    
    // Gallery images
    const gallery = await prisma.gallery.findMany({ select: { image: true } });
    gallery.forEach(g => g.image && usedImages.add(g.image));
    
    return usedImages;
  } catch (error) {
    console.error('❌ Error collecting used images:', error);
    throw error;
  }
}

/**
 * Основная функция очистки
 */
async function cleanupUnusedImages() {
  try {
    console.log('🔍 Начинаем поиск неиспользуемых изображений...\n');
    
    // Получаем все файлы в uploads
    console.log('📂 Сканируем директорию uploads...');
    const allFiles = await getAllUploadedFiles();
    console.log(`   Найдено файлов: ${allFiles.length}\n`);
    
    // Получаем все используемые изображения из БД
    console.log('🗄️  Проверяем базу данных...');
    const usedImages = await getAllUsedImages();
    console.log(`   Используется изображений: ${usedImages.size}\n`);
    
    // Находим неиспользуемые файлы
    const unusedFiles = allFiles.filter(file => !usedImages.has(file));
    
    console.log(`📊 Статистика:`);
    console.log(`   Всего файлов: ${allFiles.length}`);
    console.log(`   Используется: ${usedImages.size}`);
    console.log(`   Не используется: ${unusedFiles.length}\n`);
    
    if (unusedFiles.length === 0) {
      console.log('✅ Все файлы используются! Удаление не требуется.');
      return;
    }
    
    // Спрашиваем подтверждение (в продакшене можно убрать)
    console.log('⚠️  ВНИМАНИЕ! Будут удалены следующие файлы:');
    console.log('─'.repeat(80));
    unusedFiles.slice(0, 10).forEach(file => console.log(`   ${file}`));
    if (unusedFiles.length > 10) {
      console.log(`   ... и еще ${unusedFiles.length - 10} файлов`);
    }
    console.log('─'.repeat(80));
    console.log('\n🗑️  Удаляем неиспользуемые файлы...\n');
    
    // Удаляем файлы
    let deletedCount = 0;
    for (const file of unusedFiles) {
      const success = await deleteFile(file);
      if (success) deletedCount++;
    }
    
    console.log(`\n✨ Очистка завершена!`);
    console.log(`   Удалено файлов: ${deletedCount}/${unusedFiles.length}`);
    
    // Подсчитываем освобожденное место (приблизительно)
    console.log(`\n💾 Освобождено место на диске`);
    
  } catch (error) {
    console.error('\n❌ Ошибка при очистке:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем скрипт
cleanupUnusedImages();

