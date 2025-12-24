import { PrismaClient } from '@prisma/client';
import { deleteFile } from '../../../utils/file.js';
import { resolveImageUrlsInData } from '../../../utils/url.js';
const prisma = new PrismaClient();

// Функция для преобразования дат в строки
function serializeDates(news) {
  if (Array.isArray(news)) {
    return news.map(item => serializeDates(item));
  }
  if (news && typeof news === 'object') {
    const serialized = { ...news };
    if (serialized.publishedAt instanceof Date) {
      serialized.publishedAt = serialized.publishedAt.toISOString().split('T')[0];
    }
    if (serialized.createdAt instanceof Date) {
      serialized.createdAt = serialized.createdAt.toISOString();
    }
    if (serialized.updatedAt instanceof Date) {
      serialized.updatedAt = serialized.updatedAt.toISOString();
    }
    return serialized;
  }
  return news;
}

export async function getAll(skip, limit, filters = {}) {
  const where = {
    ...(filters.status && { status: filters.status }),
    ...(filters.search && {
      OR: [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { excerpt: { contains: filters.search, mode: 'insensitive' } },
      ],
    }),
  };
  const [data, total] = await Promise.all([
    prisma.news.findMany({
      where,
      skip,
      take: limit,
      include: {
        author: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.news.count({ where }),
  ]);
  const serializedData = serializeDates(data);
  return resolveImageUrlsInData({ data: serializedData, total });
}

export async function getById(id) {
  const news = await prisma.news.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true } },
    },
  });
  
  if (!news) return null;
  
  const serializedNews = serializeDates(news);
  return resolveImageUrlsInData(serializedNews);
}

export async function create(data) {
  const news = await prisma.news.create({
    data,
    include: {
      author: { select: { id: true, name: true } },
    },
  });
  const serializedNews = serializeDates(news);
  return resolveImageUrlsInData(serializedNews);
}

export async function update(id, data) {
  const oldNews = await prisma.news.findUnique({ where: { id } });
  
  if (oldNews && data.coverImage && oldNews.coverImage && data.coverImage !== oldNews.coverImage) {
    await deleteFile(oldNews.coverImage);
  }
  
  const news = await prisma.news.update({
    where: { id },
    data,
    include: {
      author: { select: { id: true, name: true } },
    },
  });
  const serializedNews = serializeDates(news);
  return resolveImageUrlsInData(serializedNews);
}

export async function remove(id) {
  const news = await prisma.news.findUnique({ where: { id } });
  
  if (news && news.coverImage) {
    await deleteFile(news.coverImage);
  }
  
  return prisma.news.delete({ where: { id } });
}

