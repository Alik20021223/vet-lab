import { PrismaClient } from '@prisma/client';
import { resolveImageUrlsInData } from '../utils/url.js';
const prisma = new PrismaClient();

export default async function (app) {
  // GET /api/brands - список всех активных брендов
  app.get('/', async (request, reply) => {
    try {
      const brands = await prisma.brand.findMany({
        orderBy: { sortOrder: 'asc' },
      });

      const responseData = {
        data: brands.map(brand => ({
          id: brand.id,
          name: brand.name,
          logo: brand.logo,
          description: brand.description,
          sortOrder: brand.sortOrder,
        })),
      };
      
      return resolveImageUrlsInData(responseData);
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });

  // GET /api/brands/:id - информация о бренде
  app.get('/:id', async (request, reply) => {
    try {
      const brand = await prisma.brand.findUnique({
        where: { id: request.params.id },
      });

      if (!brand) {
        return reply.code(404).send({
          error: { message: 'Бренд не найден', code: 'NOT_FOUND' },
        });
      }

      const productsCount = await prisma.catalogItem.count({
        where: { brandId: brand.id, status: 'active' },
      });

      const responseData = {
        id: brand.id,
        name: brand.name,
        logo: brand.logo,
        description: brand.description,
        productsCount,
        sortOrder: brand.sortOrder,
      };
      
      return resolveImageUrlsInData(responseData);
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });
}

