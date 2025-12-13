import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function (app) {
  // GET /api/partners - список всех партнёров
  app.get('/', async (request, reply) => {
    try {
      const partners = await prisma.partner.findMany({
        orderBy: { sortOrder: 'asc' },
      });

      return {
        data: partners.map(partner => ({
          id: partner.id,
          name: partner.name,
          logo: partner.logo,
          url: partner.url,
          sortOrder: partner.sortOrder,
        })),
      };
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });
}

