import { PrismaClient } from '@prisma/client';
import { resolveImageUrlsInData } from '../utils/url.js';
const prisma = new PrismaClient();

export default async function (app) {
  // GET /api/hero-slides - список активных слайдов
  app.get('/', async (request, reply) => {
    try {
      const slides = await prisma.heroSlide.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });

      const responseData = {
        data: slides.map(slide => ({
          id: slide.id,
          image: slide.image,
          title: slide.title,
          titleEn: slide.titleEn,
          sortOrder: slide.sortOrder,
        })),
      };
      
      return resolveImageUrlsInData(responseData);
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });
}
