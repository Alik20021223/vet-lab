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

async function translateCatalog() {
  try {
    console.log('🚀 Начинаем перевод каталога товаров на английский...\n');

    // Получаем все товары
    const items = await prisma.catalogItem.findMany();
    
    console.log(`📝 Найдено товаров: ${items.length}\n`);

    let updated = 0;
    let skipped = 0;

    for (const item of items) {
      // Пропускаем, если уже есть перевод
      if (item.titleEn && item.descriptionEn && 
          (!item.fullDescription || item.fullDescriptionEn) &&
          (!item.applicationMethod || item.applicationMethodEn)) {
        console.log(`⏭️  Пропущено: "${item.title}" (уже переведено)`);
        skipped++;
        continue;
      }

      console.log(`🔄 Переводим: "${item.title}"`);

      // Переводим поля
      const titleEn = item.titleEn || await translateText(item.title);
      await delay(500); // Задержка между запросами
      
      const descriptionEn = item.descriptionEn || await translateText(item.description);
      await delay(500);
      
      let fullDescriptionEn = item.fullDescriptionEn;
      if (item.fullDescription && !fullDescriptionEn) {
        fullDescriptionEn = await translateText(item.fullDescription);
        await delay(500);
      }
      
      let applicationMethodEn = item.applicationMethodEn;
      if (item.applicationMethod && !applicationMethodEn) {
        applicationMethodEn = await translateText(item.applicationMethod);
        await delay(500);
      }

      // Обновляем запись
      const updateData = {
        titleEn: titleEn || item.titleEn,
        descriptionEn: descriptionEn || item.descriptionEn,
      };

      if (fullDescriptionEn) {
        updateData.fullDescriptionEn = fullDescriptionEn;
      }

      if (applicationMethodEn) {
        updateData.applicationMethodEn = applicationMethodEn;
      }

      await prisma.catalogItem.update({
        where: { id: item.id },
        data: updateData,
      });

      console.log(`✅ Переведено: "${item.title}" -> "${titleEn}"\n`);
      updated++;
    }

    console.log('\n📊 Результаты:');
    console.log(`   Переведено: ${updated}`);
    console.log(`   Пропущено: ${skipped}`);
    console.log(`   Всего: ${items.length}`);
    console.log('\n✨ Готово!');
  } catch (error) {
    console.error('❌ Ошибка при переводе каталога:', error);
  } finally {
    await prisma.$disconnect();
  }
}

translateCatalog();
