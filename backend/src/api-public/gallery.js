import { PrismaClient } from '@prisma/client';
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

      return {
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
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });
}
