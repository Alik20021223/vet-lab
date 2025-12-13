import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function (app) {
  // GET /api/services - список всех активных услуг
  app.get('/', async (request, reply) => {
    try {
      const services = await prisma.service.findMany({
        where: { status: 'active' },
        orderBy: { sortOrder: 'asc' },
      });

      return {
        data: services.map(service => ({
          id: service.id,
          title: service.title,
          titleEn: service.titleEn,
          description: service.shortDescription,
          descriptionEn: service.shortDescriptionEn,
          fullDescription: service.fullDescription,
          fullDescriptionEn: service.fullDescriptionEn,
          image: service.image,
          icon: service.icon,
          href: `/services/${service.id}`,
          benefits: [], // Can be added later if needed
          sortOrder: service.sortOrder,
        })),
      };
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });

  // GET /api/services/:id - детальная информация об услуге
  app.get('/:id', async (request, reply) => {
    try {
      const service = await prisma.service.findFirst({
        where: {
          id: request.params.id,
          status: 'active',
        },
      });

      if (!service) {
        return reply.code(404).send({
          error: { message: 'Услуга не найдена', code: 'NOT_FOUND' },
        });
      }

      return {
        id: service.id,
        title: service.title,
        titleEn: service.titleEn,
        description: service.shortDescription,
        descriptionEn: service.shortDescriptionEn,
        fullDescription: service.fullDescription,
        fullDescriptionEn: service.fullDescriptionEn,
        image: service.image,
        icon: service.icon,
        href: `/services/${service.id}`,
        benefits: [], // Can be added later
        sortOrder: service.sortOrder,
        createdAt: service.createdAt.toISOString(),
        updatedAt: service.updatedAt.toISOString(),
      };
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });
}
