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

// Функция для перевода массива строк
async function translateArray(array, targetLang = 'en') {
  if (!array || array.length === 0) return [];
  
  const translated = [];
  for (const item of array) {
    const translation = await translateText(item, targetLang);
    translated.push(translation || item);
    await delay(500);
  }
  
  return translated;
}

// Задержка между запросами
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateCareers() {
  try {
    console.log('🚀 Начинаем перевод вакансий на английский...\n');

    // Получаем все вакансии
    const careers = await prisma.career.findMany();
    
    console.log(`📝 Найдено вакансий: ${careers.length}\n`);

    let updated = 0;
    let skipped = 0;

    for (const career of careers) {
      // Пропускаем, если уже есть базовый перевод
      if (career.titleEn && career.descriptionEn && career.fullDescriptionEn &&
          (!career.location || career.locationEn) &&
          (!career.department || career.departmentEn) &&
          (career.requirements.length === 0 || career.requirementsEn.length > 0) &&
          (career.responsibilities.length === 0 || career.responsibilitiesEn.length > 0) &&
          (career.benefits.length === 0 || career.benefitsEn.length > 0)) {
        console.log(`⏭️  Пропущено: "${career.title}" (уже переведено)`);
        skipped++;
        continue;
      }

      console.log(`🔄 Переводим: "${career.title}"`);

      // Переводим основные поля
      const titleEn = career.titleEn || await translateText(career.title);
      await delay(500);
      
      const descriptionEn = career.descriptionEn || await translateText(career.description);
      await delay(500);
      
      const fullDescriptionEn = career.fullDescriptionEn || await translateText(career.fullDescription);
      await delay(500);
      
      let locationEn = career.locationEn;
      if (career.location && !locationEn) {
        locationEn = await translateText(career.location);
        await delay(500);
      }
      
      let departmentEn = career.departmentEn;
      if (career.department && !departmentEn) {
        departmentEn = await translateText(career.department);
        await delay(500);
      }

      // Переводим массивы
      let requirementsEn = career.requirementsEn;
      if (career.requirements.length > 0 && requirementsEn.length === 0) {
        console.log('   📋 Переводим требования...');
        requirementsEn = await translateArray(career.requirements);
      }

      let responsibilitiesEn = career.responsibilitiesEn;
      if (career.responsibilities.length > 0 && responsibilitiesEn.length === 0) {
        console.log('   📋 Переводим обязанности...');
        responsibilitiesEn = await translateArray(career.responsibilities);
      }

      let benefitsEn = career.benefitsEn;
      if (career.benefits.length > 0 && benefitsEn.length === 0) {
        console.log('   📋 Переводим преимущества...');
        benefitsEn = await translateArray(career.benefits);
      }

      // Обновляем запись
      const updateData = {
        titleEn: titleEn || career.titleEn,
        descriptionEn: descriptionEn || career.descriptionEn,
        fullDescriptionEn: fullDescriptionEn || career.fullDescriptionEn,
      };

      if (locationEn) {
        updateData.locationEn = locationEn;
      }

      if (departmentEn) {
        updateData.departmentEn = departmentEn;
      }

      if (requirementsEn.length > 0) {
        updateData.requirementsEn = requirementsEn;
      }

      if (responsibilitiesEn.length > 0) {
        updateData.responsibilitiesEn = responsibilitiesEn;
      }

      if (benefitsEn.length > 0) {
        updateData.benefitsEn = benefitsEn;
      }

      await prisma.career.update({
        where: { id: career.id },
        data: updateData,
      });

      console.log(`✅ Переведено: "${career.title}" -> "${titleEn}"\n`);
      updated++;
    }

    console.log('\n📊 Результаты:');
    console.log(`   Переведено: ${updated}`);
    console.log(`   Пропущено: ${skipped}`);
    console.log(`   Всего: ${careers.length}`);
    console.log('\n✨ Готово!');
  } catch (error) {
    console.error('❌ Ошибка при переводе вакансий:', error);
  } finally {
    await prisma.$disconnect();
  }
}

translateCareers();





