import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function (app) {
  // GET /api/careers - список активных вакансий
  app.get('/', async (request, reply) => {
    try {
      const page = parseInt(request.query.page) || 1;
      const limit = Math.min(parseInt(request.query.limit) || 10, 100);
      const skip = (page - 1) * limit;

      const where = {
        status: 'active',
        ...(request.query.location && {
          location: { contains: request.query.location, mode: 'insensitive' },
        }),
        ...(request.query.type && {
          type: request.query.type.replace('-', '_'), // full-time -> full_time
        }),
        ...(request.query.search && {
          OR: [
            { title: { contains: request.query.search, mode: 'insensitive' } },
            { description: { contains: request.query.search, mode: 'insensitive' } },
            { fullDescription: { contains: request.query.search, mode: 'insensitive' } },
          ],
        }),
        AND: [
          {
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } },
            ],
          },
        ],
      };

      const [data, total] = await Promise.all([
        prisma.career.findMany({
          where,
          skip,
          take: limit,
          orderBy: [
            { sortOrder: 'asc' },
            { createdAt: 'desc' },
          ],
        }),
        prisma.career.count({ where }),
      ]);

      return {
        data: data.map(job => ({
          id: job.id,
          title: job.title,
          titleEn: job.titleEn,
          description: job.description,
          descriptionEn: job.descriptionEn,
          fullDescription: job.fullDescription,
          fullDescriptionEn: job.fullDescriptionEn,
          location: job.location,
          locationEn: job.locationEn,
          type: job.type.replace('_', '-'), // full_time -> full-time
          department: job.department,
          departmentEn: job.departmentEn,
          requirements: job.requirements,
          requirementsEn: job.requirementsEn,
          responsibilities: job.responsibilities,
          responsibilitiesEn: job.responsibilitiesEn,
          benefits: job.benefits,
          benefitsEn: job.benefitsEn,
          salary: job.salary,
          status: job.status,
          sortOrder: job.sortOrder,
          createdAt: job.createdAt.toISOString(),
          updatedAt: job.updatedAt.toISOString(),
          expiresAt: job.expiresAt?.toISOString() || null,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });

  // GET /api/careers/:id - детальная информация о вакансии
  app.get('/:id', async (request, reply) => {
    try {
      const job = await prisma.career.findFirst({
        where: {
          id: request.params.id,
          status: 'active',
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      });

      if (!job) {
        return reply.code(404).send({
          error: { message: 'Вакансия не найдена', code: 'NOT_FOUND' },
        });
      }

      return {
        id: job.id,
        title: job.title,
        titleEn: job.titleEn,
        description: job.description,
        descriptionEn: job.descriptionEn,
        fullDescription: job.fullDescription,
        fullDescriptionEn: job.fullDescriptionEn,
        location: job.location,
        locationEn: job.locationEn,
        type: job.type.replace('_', '-'), // full_time -> full-time
        department: job.department,
        departmentEn: job.departmentEn,
        requirements: job.requirements,
        requirementsEn: job.requirementsEn,
        responsibilities: job.responsibilities,
        responsibilitiesEn: job.responsibilitiesEn,
        benefits: job.benefits,
        benefitsEn: job.benefitsEn,
        salary: job.salary,
        status: job.status,
        sortOrder: job.sortOrder,
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
        expiresAt: job.expiresAt?.toISOString() || null,
      };
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });

  // POST /api/careers/:id/apply - отправить отклик на вакансию
  app.post('/:id/apply', async (request, reply) => {
    try {
      const { id } = request.params;
      const { fullName, email, phone, coverLetter, resume } = request.body;

      // Проверяем, что вакансия существует и активна
      const job = await prisma.career.findFirst({
        where: {
          id,
          status: 'active',
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      });

      if (!job) {
        return reply.code(404).send({
          error: { message: 'Вакансия не найдена', code: 'NOT_FOUND' },
        });
      }

      // Здесь можно сохранить отклик в базу данных или отправить email
      // Пока просто возвращаем успешный ответ
      return {
        success: true,
        message: 'Ваш отклик успешно отправлен',
      };
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });
}

