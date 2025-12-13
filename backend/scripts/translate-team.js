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

async function translateTeam() {
  try {
    console.log('🚀 Начинаем перевод команды на английский...\n');

    // Получаем всех членов команды
    const members = await prisma.teamMember.findMany();
    
    console.log(`📝 Найдено членов команды: ${members.length}\n`);

    let updated = 0;
    let skipped = 0;

    for (const member of members) {
      // Пропускаем, если уже есть перевод
      if (member.nameEn && member.positionEn) {
        console.log(`⏭️  Пропущено: "${member.name}" (уже переведено)`);
        skipped++;
        continue;
      }

      console.log(`🔄 Переводим: "${member.name}"`);

      // Переводим поля
      const nameEn = member.nameEn || await translateText(member.name);
      await delay(500); // Задержка между запросами
      
      const positionEn = member.positionEn || await translateText(member.position);
      await delay(500);

      // Обновляем запись
      await prisma.teamMember.update({
        where: { id: member.id },
        data: {
          nameEn: nameEn || member.nameEn,
          positionEn: positionEn || member.positionEn,
        },
      });

      console.log(`✅ Переведено: "${member.name}" -> "${nameEn}"`);
      console.log(`   Должность: "${member.position}" -> "${positionEn}"\n`);
      updated++;
    }

    console.log('\n📊 Результаты:');
    console.log(`   Переведено: ${updated}`);
    console.log(`   Пропущено: ${skipped}`);
    console.log(`   Всего: ${members.length}`);
    console.log('\n✨ Готово!');
  } catch (error) {
    console.error('❌ Ошибка при переводе команды:', error);
  } finally {
    await prisma.$disconnect();
  }
}

translateTeam();
