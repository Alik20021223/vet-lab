import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const teamMembers = [
  {
    name: "Марухненко Александр",
    position: "Ведущий специалист, ветеринарный врач",
    sortOrder: 1,
  },
  {
    name: "Захиров Бахром",
    position: "Руководитель направления, ветеринарный врач",
    sortOrder: 2,
  },
  {
    name: "Саворовская Зоя",
    position: "Заведующая лабораторией, ветеринарный врач, бактериолог",
    sortOrder: 3,
  },
  {
    name: "Исмоилов Мухаммад",
    position: "Специалист по развитию направления",
    sortOrder: 4,
  },
  {
    name: "Ахмедов Амир",
    position: "Специалист-иммунолог",
    sortOrder: 5,
  },
  {
    name: "Негматов Мурод",
    position: "Продукт-менеджер, ветеринарный врач",
    sortOrder: 6,
  },
  {
    name: "Каримзода Нодир",
    position: "Специалист-бактериолог",
    sortOrder: 7,
  },
];

async function addTeamMembers() {
  try {
    console.log('🚀 Начинаем добавление членов команды...\n');

    let created = 0;
    let skipped = 0;

    for (const memberData of teamMembers) {
      // Проверяем, существует ли уже член команды с таким именем
      const existing = await prisma.teamMember.findFirst({
        where: { name: memberData.name },
      });

      if (existing) {
        console.log(`⏭️  Пропущен: ${memberData.name} (уже существует)`);
        skipped++;
        continue;
      }

      // Создаем нового члена команды
      const member = await prisma.teamMember.create({
        data: memberData,
      });

      console.log(`✅ Добавлен: ${member.name} - ${member.position}`);
      created++;
    }

    console.log('\n📊 Результаты:');
    console.log(`   Создано: ${created}`);
    console.log(`   Пропущено: ${skipped}`);
    console.log(`   Всего: ${teamMembers.length}`);
    console.log('\n✨ Готово!');
  } catch (error) {
    console.error('❌ Ошибка при добавлении членов команды:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTeamMembers();



