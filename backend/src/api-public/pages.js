import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function (app) {
  // GET /api/pages/:slug - статическая страница по slug
  app.get('/:slug', async (request, reply) => {
    try {
      const page = await prisma.page.findUnique({
        where: { slug: request.params.slug },
      });

      if (!page) {
        return reply.code(404).send({
          error: { message: 'Страница не найдена', code: 'NOT_FOUND' },
        });
      }

      return {
        slug: page.slug,
        title: page.title,
        content: page.content,
        seo: page.seo || {},
        updatedAt: page.updatedAt.toISOString(),
      };
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });
}

