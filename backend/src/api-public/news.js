import { PrismaClient } from '@prisma/client';
import { resolveImageUrlsInData } from '../utils/url.js';
const prisma = new PrismaClient();

export default async function (app) {
  // GET /api/news - список опубликованных новостей
  app.get('/', async (request, reply) => {
    try {
      const page = parseInt(request.query.page) || 1;
      const limit = Math.min(parseInt(request.query.limit) || 10, 50);
      const skip = (page - 1) * limit;

      const where = {
        status: 'published',
        publishedAt: { lte: new Date() },
        ...(request.query.search && {
          OR: [
            { title: { contains: request.query.search, mode: 'insensitive' } },
            { excerpt: { contains: request.query.search, mode: 'insensitive' } },
          ],
        }),
      };

      const [data, total] = await Promise.all([
        prisma.news.findMany({
          where,
          skip,
          take: limit,
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { publishedAt: 'desc' },
        }),
        prisma.news.count({ where }),
      ]);

      const responseData = {
        data: data.map(news => ({
          id: news.id,
          title: news.title,
          titleEn: news.titleEn,
          excerpt: news.excerpt,
          excerptEn: news.excerptEn,
          content: news.content,
          contentEn: news.contentEn,
          coverImage: news.coverImage,
          publishedAt: news.publishedAt.toISOString().split('T')[0],
          author: news.author?.name || 'Admin User',
          createdAt: news.createdAt.toISOString(),
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

  // GET /api/news/:id - детальная информация о новости
  app.get('/:id', async (request, reply) => {
    try {
      const news = await prisma.news.findFirst({
        where: {
          id: request.params.id,
          status: 'published',
          publishedAt: { lte: new Date() },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!news) {
        return reply.code(404).send({
          error: { message: 'Новость не найдена', code: 'NOT_FOUND' },
        });
      }

      // Get related news
      const related = await prisma.news.findMany({
        where: {
          status: 'published',
          publishedAt: { lte: new Date() },
          id: { not: news.id },
        },
        take: 3,
        select: {
          id: true,
          title: true,
          coverImage: true,
          publishedAt: true,
        },
        orderBy: { publishedAt: 'desc' },
      });

      const responseData = {
        id: news.id,
        title: news.title,
        titleEn: news.titleEn,
        excerpt: news.excerpt,
        excerptEn: news.excerptEn,
        content: news.content,
        contentEn: news.contentEn,
        coverImage: news.coverImage,
        publishedAt: news.publishedAt.toISOString().split('T')[0],
        author: news.author?.name || 'Admin User',
        relatedNews: related.map(n => ({
          id: n.id,
          title: n.title,
          coverImage: n.coverImage,
          publishedAt: n.publishedAt.toISOString().split('T')[0],
        })),
        createdAt: news.createdAt.toISOString(),
        updatedAt: news.updatedAt.toISOString(),
      };
      
      return resolveImageUrlsInData(responseData);
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });
}

