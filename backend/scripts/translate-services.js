import { PrismaClient } from '@prisma/client';
import https from 'https';

const prisma = new PrismaClient();

// Функция для перевода текста через Google Translate (бесплатный API)
async function translateText(text, targetLang = 'en') {
  if (!text || text.trim() === '') return null;
  
  return new Promise((resolve, reject) => {
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ru&tl=${targetLang}&dt=t&q=${encodedText}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const translation = parsed[0].map(item => item[0]).join('');
          resolve(translation);
        } catch (error) {
          console.error('Ошибка парсинга:', error);
          resolve(null);
        }
      });
    }).on('error', (error) => {
      console.error('Ошибка запроса:', error);
      resolve(null);
    });
  });
}

// Задержка между запросами
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateServices() {
  try {
    console.log('🚀 Начинаем перевод услуг на английский...\n');

    // Получаем все услуги
    const services = await prisma.service.findMany();
    
    console.log(`📝 Найдено услуг: ${services.length}\n`);

    let updated = 0;
    let skipped = 0;

    for (const service of services) {
      // Пропускаем, если уже есть перевод
      if (service.titleEn && service.shortDescriptionEn && service.fullDescriptionEn) {
        console.log(`⏭️  Пропущено: "${service.title}" (уже переведено)`);
        skipped++;
        continue;
      }

      console.log(`🔄 Переводим: "${service.title}"`);

      // Переводим поля
      const titleEn = service.titleEn || await translateText(service.title);
      await delay(500); // Задержка между запросами
      
      const shortDescriptionEn = service.shortDescriptionEn || await translateText(service.shortDescription);
      await delay(500);
      
      const fullDescriptionEn = service.fullDescriptionEn || await translateText(service.fullDescription);
      await delay(500);

      // Обновляем запись
      await prisma.service.update({
        where: { id: service.id },
        data: {
          titleEn: titleEn || service.titleEn,
          shortDescriptionEn: shortDescriptionEn || service.shortDescriptionEn,
          fullDescriptionEn: fullDescriptionEn || service.fullDescriptionEn,
        },
      });

      console.log(`✅ Переведено: "${service.title}" -> "${titleEn}"\n`);
      updated++;
    }

    console.log('\n📊 Результаты:');
    console.log(`   Переведено: ${updated}`);
    console.log(`   Пропущено: ${skipped}`);
    console.log(`   Всего: ${services.length}`);
    console.log('\n✨ Готово!');
  } catch (error) {
    console.error('❌ Ошибка при переводе услуг:', error);
  } finally {
    await prisma.$disconnect();
  }
}

translateServices();
