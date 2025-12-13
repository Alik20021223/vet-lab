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

async function translateNews() {
  try {
    console.log('🚀 Начинаем перевод новостей на английский...\n');

    // Получаем все новости
    const newsItems = await prisma.news.findMany();
    
    console.log(`📝 Найдено новостей: ${newsItems.length}\n`);

    let updated = 0;
    let skipped = 0;

    for (const news of newsItems) {
      // Пропускаем, если уже есть перевод
      if (news.titleEn && news.excerptEn && news.contentEn) {
        console.log(`⏭️  Пропущено: "${news.title}" (уже переведено)`);
        skipped++;
        continue;
      }

      console.log(`🔄 Переводим: "${news.title}"`);

      // Переводим поля
      const titleEn = news.titleEn || await translateText(news.title);
      await delay(500); // Задержка между запросами
      
      const excerptEn = news.excerptEn || await translateText(news.excerpt);
      await delay(500);
      
      const contentEn = news.contentEn || await translateText(news.content);
      await delay(500);

      // Обновляем запись
      await prisma.news.update({
        where: { id: news.id },
        data: {
          titleEn: titleEn || news.titleEn,
          excerptEn: excerptEn || news.excerptEn,
          contentEn: contentEn || news.contentEn,
        },
      });

      console.log(`✅ Переведено: "${news.title}" -> "${titleEn}"\n`);
      updated++;
    }

    console.log('\n📊 Результаты:');
    console.log(`   Переведено: ${updated}`);
    console.log(`   Пропущено: ${skipped}`);
    console.log(`   Всего: ${newsItems.length}`);
    console.log('\n✨ Готово!');
  } catch (error) {
    console.error('❌ Ошибка при переводе новостей:', error);
  } finally {
    await prisma.$disconnect();
  }
}

translateNews();
