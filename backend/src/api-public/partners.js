import { PrismaClient } from '@prisma/client';
import { resolveImageUrlsInData } from '../utils/url.js';
const prisma = new PrismaClient();

export default async function (app) {
  // GET /api/partners - список всех партнёров
  app.get('/', async (request, reply) => {
    try {
      const partners = await prisma.partner.findMany({
        orderBy: { sortOrder: 'asc' },
      });

      const responseData = {
        data: partners.map(partner => ({
          id: partner.id,
          name: partner.name,
          logo: partner.logo,
          url: partner.url,
          sortOrder: partner.sortOrder,
        })),
      };
      
      return resolveImageUrlsInData(responseData);
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });
}

