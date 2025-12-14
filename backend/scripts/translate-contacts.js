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

async function translateContacts() {
  try {
    console.log('🚀 Начинаем перевод контактной информации на английский...\n');

    // Получаем контактную информацию
    const contactInfos = await prisma.contactInfo.findMany();
    
    if (contactInfos.length === 0) {
      console.log('⚠️  Контактная информация не найдена в базе данных');
      return;
    }
    
    console.log(`📝 Найдено записей: ${contactInfos.length}\n`);

    let updated = 0;
    let skipped = 0;

    for (const contact of contactInfos) {
      // Пропускаем, если уже есть перевод
      if (contact.addressEn && 
          (!contact.workingHours || contact.workingHoursEn)) {
        console.log(`⏭️  Пропущено: запись ID ${contact.id} (уже переведено)`);
        skipped++;
        continue;
      }

      console.log(`🔄 Переводим контактную информацию ID: ${contact.id}`);

      // Переводим адрес
      const addressEn = contact.addressEn || await translateText(contact.address);
      await delay(500); // Задержка между запросами
      
      // Переводим часы работы, если они есть
      let workingHoursEn = contact.workingHoursEn;
      if (contact.workingHours && !workingHoursEn) {
        workingHoursEn = await translateText(contact.workingHours);
        await delay(500);
      }

      // Обновляем запись
      const updateData = {
        addressEn: addressEn || contact.addressEn,
      };

      if (workingHoursEn) {
        updateData.workingHoursEn = workingHoursEn;
      }

      await prisma.contactInfo.update({
        where: { id: contact.id },
        data: updateData,
      });

      console.log(`✅ Переведено:`);
      console.log(`   Адрес: "${contact.address}" -> "${addressEn}"`);
      if (workingHoursEn) {
        console.log(`   Часы работы: "${contact.workingHours}" -> "${workingHoursEn}"`);
      }
      console.log();
      updated++;
    }

    console.log('\n📊 Результаты:');
    console.log(`   Переведено: ${updated}`);
    console.log(`   Пропущено: ${skipped}`);
    console.log(`   Всего: ${contactInfos.length}`);
    console.log('\n✨ Готово!');
  } catch (error) {
    console.error('❌ Ошибка при переводе контактной информации:', error);
  } finally {
    await prisma.$disconnect();
  }
}

translateContacts();



