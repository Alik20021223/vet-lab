import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testNews = [
  {
    title: 'Открытие новой лаборатории по диагностике заболеваний животных',
    titleEn: 'Opening of a new laboratory for animal disease diagnostics',
    excerpt: 'Мы рады сообщить об открытии современной лаборатории, оснащенной самым передовым оборудованием для диагностики заболеваний животных.',
    excerptEn: 'We are pleased to announce the opening of a modern laboratory equipped with the latest equipment for animal disease diagnostics.',
    content: `Мы рады сообщить об открытии новой современной лаборатории, специализирующейся на диагностике заболеваний животных. Лаборатория оснащена самым передовым оборудованием и использует современные методы исследования.

Наша новая лаборатория предлагает широкий спектр диагностических услуг:
- Бактериологические исследования
- Вирусологические анализы
- Паразитологические исследования
- Иммунологические тесты
- Биохимические анализы крови

Все исследования проводятся квалифицированными специалистами с многолетним опытом работы. Мы гарантируем точность результатов и соблюдение всех стандартов качества.

Лаборатория работает в соответствии с международными стандартами и регулярно проходит аккредитацию. Мы стремимся предоставить нашим клиентам лучший сервис в области ветеринарной диагностики.`,
    contentEn: `We are pleased to announce the opening of a new modern laboratory specializing in animal disease diagnostics. The laboratory is equipped with the latest equipment and uses modern research methods.

Our new laboratory offers a wide range of diagnostic services:
- Bacteriological studies
- Virological analyses
- Parasitological studies
- Immunological tests
- Biochemical blood tests

All studies are conducted by qualified specialists with years of experience. We guarantee the accuracy of results and compliance with all quality standards.

The laboratory operates in accordance with international standards and regularly undergoes accreditation. We strive to provide our clients with the best service in the field of veterinary diagnostics.`,
    publishedAt: new Date(),
    status: 'published',
  },
  {
    title: 'Новая линейка вакцин для сельскохозяйственных животных',
    titleEn: 'New line of vaccines for farm animals',
    excerpt: 'Представляем новую линейку высокоэффективных вакцин для защиты сельскохозяйственных животных от инфекционных заболеваний.',
    excerptEn: 'Introducing a new line of highly effective vaccines to protect farm animals from infectious diseases.',
    content: `Мы рады представить новую линейку вакцин для сельскохозяйственных животных. Эти вакцины разработаны с использованием самых современных технологий и обеспечивают надежную защиту от широкого спектра инфекционных заболеваний.

Основные преимущества новой линейки:
- Высокая эффективность защиты
- Длительный срок иммунитета
- Безопасность для животных
- Удобство в применении
- Соответствие международным стандартам

Новые вакцины прошли все необходимые клинические испытания и получили соответствующие сертификаты. Они подходят для профилактики заболеваний крупного и мелкого рогатого скота, свиней и птицы.

Мы уверены, что новая продукция поможет нашим клиентам обеспечить здоровье и благополучие своих животных, а также повысить продуктивность хозяйств.`,
    contentEn: `We are pleased to introduce a new line of vaccines for farm animals. These vaccines are developed using the latest technologies and provide reliable protection against a wide range of infectious diseases.

Main advantages of the new line:
- High protection effectiveness
- Long-lasting immunity
- Safety for animals
- Easy to use
- Compliance with international standards

The new vaccines have passed all necessary clinical trials and received appropriate certificates. They are suitable for preventing diseases in cattle and small ruminants, pigs, and poultry.

We are confident that the new products will help our clients ensure the health and well-being of their animals, as well as increase farm productivity.`,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 дня назад
    status: 'published',
  },
  {
    title: 'Семинар по современным методам ветеринарной диагностики',
    titleEn: 'Seminar on modern veterinary diagnostic methods',
    excerpt: 'Приглашаем ветеринарных специалистов на обучающий семинар, посвященный современным методам диагностики заболеваний животных.',
    excerptEn: 'We invite veterinary specialists to an educational seminar on modern methods of diagnosing animal diseases.',
    content: `Уважаемые коллеги! Приглашаем вас принять участие в обучающем семинаре "Современные методы ветеринарной диагностики", который пройдет в нашем учебном центре.

Программа семинара включает:
- Лекции по новейшим диагностическим технологиям
- Практические занятия по работе с современным оборудованием
- Разбор клинических случаев
- Обмен опытом с ведущими специалистами

Семинар будет полезен как начинающим, так и опытным ветеринарным врачам. Участники получат сертификаты о прохождении обучения.

Дата проведения: уточняется
Место: наш учебный центр
Регистрация: обязательна

Для регистрации и получения дополнительной информации обращайтесь по контактам, указанным на нашем сайте. Количество мест ограничено, поэтому рекомендуем зарегистрироваться заранее.`,
    contentEn: `Dear colleagues! We invite you to participate in an educational seminar "Modern Methods of Veterinary Diagnostics", which will be held at our training center.

The seminar program includes:
- Lectures on the latest diagnostic technologies
- Practical sessions on working with modern equipment
- Analysis of clinical cases
- Exchange of experience with leading specialists

The seminar will be useful for both beginners and experienced veterinarians. Participants will receive certificates of completion.

Date: to be announced
Location: our training center
Registration: required

To register and get more information, please contact us using the contacts listed on our website. Places are limited, so we recommend registering in advance.`,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 дней назад
    status: 'published',
  },
  {
    title: 'Расширение ассортимента препаратов для лечения инфекционных заболеваний',
    titleEn: 'Expanding the range of drugs for treating infectious diseases',
    excerpt: 'В нашем каталоге появились новые препараты для эффективного лечения инфекционных заболеваний у животных различных видов.',
    excerptEn: 'New drugs for effective treatment of infectious diseases in animals of various species have appeared in our catalog.',
    content: `Мы рады сообщить о значительном расширении нашего каталога препаратов. Теперь мы предлагаем еще более широкий спектр лекарственных средств для лечения инфекционных заболеваний у животных.

Новые препараты включают:
- Антибактериальные средства широкого спектра действия
- Противовирусные препараты
- Антипаразитарные средства
- Иммуномодуляторы
- Препараты для комплексной терапии

Все препараты произведены ведущими мировыми производителями и соответствуют высочайшим стандартам качества. Они подходят для лечения различных видов животных, включая крупный и мелкий рогатый скот, свиней, птицу и домашних животных.

Наши специалисты помогут вам подобрать оптимальное лечение для каждого конкретного случая. Мы также предоставляем консультации по применению препаратов и дозировкам.`,
    contentEn: `We are pleased to announce a significant expansion of our drug catalog. Now we offer an even wider range of medicines for the treatment of infectious diseases in animals.

New drugs include:
- Broad-spectrum antibacterial agents
- Antiviral drugs
- Antiparasitic agents
- Immunomodulators
- Drugs for complex therapy

All drugs are manufactured by leading world manufacturers and meet the highest quality standards. They are suitable for treating various types of animals, including cattle and small ruminants, pigs, poultry, and pets.

Our specialists will help you choose the optimal treatment for each specific case. We also provide consultations on drug use and dosages.`,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // неделю назад
    status: 'published',
  },
  {
    title: 'Новые возможности в области генетической диагностики',
    titleEn: 'New possibilities in genetic diagnostics',
    excerpt: 'Наша лаборатория внедрила современные методы генетической диагностики, позволяющие выявлять наследственные заболевания и предрасположенности у животных.',
    excerptEn: 'Our laboratory has introduced modern methods of genetic diagnostics that allow detecting hereditary diseases and predispositions in animals.',
    content: `Современная ветеринарная медицина активно развивается, и мы рады сообщить о внедрении в нашей лаборатории передовых методов генетической диагностики.

Новые возможности включают:
- Выявление наследственных заболеваний
- Определение генетических предрасположенностей
- Тестирование на носительство генетических мутаций
- Генетическое типирование пород
- Определение родства и происхождения

Генетическая диагностика позволяет выявлять проблемы на ранних стадиях, до появления клинических признаков. Это особенно важно для заводчиков, которые хотят получить здоровое потомство и избежать передачи наследственных заболеваний.

Методы, которые мы используем, основаны на ПЦР-диагностике и секвенировании ДНК. Результаты анализов обрабатываются с использованием современных биоинформатических методов и сравниваются с международными базами данных.

Мы предлагаем как индивидуальные тесты, так и комплексные панели для различных пород и видов животных.`,
    contentEn: `Modern veterinary medicine is actively developing, and we are pleased to announce the introduction of advanced genetic diagnostic methods in our laboratory.

New possibilities include:
- Detection of hereditary diseases
- Determination of genetic predispositions
- Testing for carriage of genetic mutations
- Genetic breed typing
- Determination of kinship and origin

Genetic diagnostics allows detecting problems at early stages, before the appearance of clinical signs. This is especially important for breeders who want to get healthy offspring and avoid the transmission of hereditary diseases.

The methods we use are based on PCR diagnostics and DNA sequencing. Test results are processed using modern bioinformatics methods and compared with international databases.

We offer both individual tests and comprehensive panels for various breeds and species of animals.`,
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 дней назад
    status: 'published',
  },
];

async function addTestNews() {
  try {
    console.log('🚀 Начинаем добавление тестовых новостей...\n');

    // Пытаемся найти первого админа для authorId
    const admin = await prisma.user.findFirst({
      where: {
        role: {
          in: ['super_admin', 'admin'],
        },
      },
    });

    const authorId = admin?.id || null;
    if (admin) {
      console.log(`👤 Используется автор: ${admin.name || admin.email}\n`);
    } else {
      console.log('⚠️  Админ не найден, новости будут созданы без автора\n');
    }

    let created = 0;
    let skipped = 0;

    for (const newsData of testNews) {
      // Проверяем, существует ли уже новость с таким заголовком
      const existing = await prisma.news.findFirst({
        where: { title: newsData.title },
      });

      if (existing) {
        console.log(`⏭️  Пропущено: "${newsData.title}" (уже существует)`);
        skipped++;
        continue;
      }

      // Создаем новую новость
      const news = await prisma.news.create({
        data: {
          ...newsData,
          authorId,
        },
        include: {
          author: { select: { id: true, name: true } },
        },
      });

      console.log(`✅ Добавлено: "${news.title}"`);
      console.log(`   Статус: ${news.status}, Дата публикации: ${news.publishedAt.toLocaleDateString('ru-RU')}\n`);
      created++;
    }

    console.log('\n📊 Результаты:');
    console.log(`   Создано: ${created}`);
    console.log(`   Пропущено: ${skipped}`);
    console.log(`   Всего: ${testNews.length}`);
    console.log('\n✨ Готово!');
  } catch (error) {
    console.error('❌ Ошибка при добавлении новостей:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addTestNews();
