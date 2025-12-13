import { PrismaClient } from '@prisma/client';
import { formatCategory, parseCategory } from '../utils/category.js';
const prisma = new PrismaClient();

export default async function (app) {
  // GET /api/catalog - список товаров с фильтрацией
  app.get('/', async (request, reply) => {
    try {
      const page = parseInt(request.query.page) || 1;
      const limit = Math.min(parseInt(request.query.limit) || 20, 100);
      const skip = (page - 1) * limit;
      
      const where = {
        status: 'active',
        ...(request.query.category && { category: parseCategory(request.query.category) }),
        ...(request.query.brandId && { brandId: request.query.brandId }),
        ...(request.query.search && {
          OR: [
            { title: { contains: request.query.search, mode: 'insensitive' } },
            { description: { contains: request.query.search, mode: 'insensitive' } },
          ],
        }),
      };

      const [data, total] = await Promise.all([
        prisma.catalogItem.findMany({
          where,
          skip,
          take: limit,
          include: {
            brand: true,
          },
          orderBy: [
            { sortOrder: 'asc' },
            { createdAt: 'desc' },
          ],
        }),
        prisma.catalogItem.count({ where }),
      ]);

      return {
        data: data.map(item => ({
          id: item.id,
          title: item.title,
          titleEn: item.titleEn,
          description: item.description,
          descriptionEn: item.descriptionEn,
          fullDescription: item.fullDescription,
          fullDescriptionEn: item.fullDescriptionEn,
          applicationMethod: item.applicationMethod,
          applicationMethodEn: item.applicationMethodEn,
          category: item.category === 'feed_additives' ? 'feed-additives' : item.category,
          brandId: item.brandId,
          brand: item.brand ? {
            id: item.brand.id,
            name: item.brand.name,
            logo: item.brand.logo,
          } : null,
          image: item.image,
          documents: item.documents || [],
          status: item.status,
          sortOrder: item.sortOrder,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
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

  // GET /api/catalog/:id - детальная информация о товаре
  app.get('/:id', async (request, reply) => {
    try {
      const item = await prisma.catalogItem.findFirst({
        where: {
          id: request.params.id,
          status: 'active',
        },
        include: {
          brand: true,
        },
      });

      if (!item) {
        return reply.code(404).send({
          error: { message: 'Товар не найден', code: 'NOT_FOUND' },
        });
      }

      return {
        id: item.id,
        title: item.title,
        titleEn: item.titleEn,
        description: item.description,
        descriptionEn: item.descriptionEn,
        fullDescription: item.fullDescription,
        fullDescriptionEn: item.fullDescriptionEn,
        applicationMethod: item.applicationMethod,
        applicationMethodEn: item.applicationMethodEn,
        category: formatCategory(item.category),
        brandId: item.brandId,
        brand: item.brand ? {
          id: item.brand.id,
          name: item.brand.name,
          logo: item.brand.logo,
        } : null,
        image: item.image,
        documents: item.documents || [],
        status: item.status,
        sortOrder: item.sortOrder,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      };
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });
}

