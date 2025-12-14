import { PrismaClient } from '@prisma/client';
import { resolveImageUrlsInData } from '../utils/url.js';
const prisma = new PrismaClient();

export default async function (app) {
  // GET /api/gallery - список изображений галереи
  app.get('/', async (request, reply) => {
    try {
      const page = parseInt(request.query.page) || 1;
      const limit = parseInt(request.query.limit) || 20;
      const skip = (page - 1) * limit;

      const where = {
        ...(request.query.category && { category: request.query.category }),
      };

      const [data, total] = await Promise.all([
        prisma.gallery.findMany({
          where,
          skip,
          take: limit,
          orderBy: { sortOrder: 'asc' },
        }),
        prisma.gallery.count({ where }),
      ]);

      const responseData = {
        data: data.map(item => ({
          id: item.id,
          image: item.image,
          category: item.category,
          description: item.description,
          sortOrder: item.sortOrder,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
      
      return resolveImageUrlsInData(responseData);
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });
}
