import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const serviceImages = {
  'Лабораторные услуги': 'https://images.unsplash.com/photo-1559757148-5c3507fa47ba?w=800&h=600&fit=crop',
  'Ветеринарный специалист': 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=600&fit=crop',
  'Технический сервис': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
  'Специалист по кормлению': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop',
};

async function updateServiceImages() {
  try {
    console.log('Обновляем изображения услуг...\n');

    for (const [title, imageUrl] of Object.entries(serviceImages)) {
      const service = await prisma.service.findFirst({
        where: { title },
      });

      if (!service) {
        console.log(`⚠️  Услуга "${title}" не найдена, пропускаем...`);
        continue;
      }

      await prisma.service.update({
        where: { id: service.id },
        data: { image: imageUrl },
      });

      console.log(`✅ Изображение обновлено для: ${title}`);
    }

    console.log('\n✨ Все изображения успешно обновлены!');
  } catch (error) {
    console.error('❌ Ошибка при обновлении изображений:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateServiceImages();

