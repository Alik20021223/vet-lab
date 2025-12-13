import { PrismaClient } from '@prisma/client';
import { deleteFile } from '../../../utils/file.js';
const prisma = new PrismaClient();

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
  return { data, total };
}

export async function getById(id) {
  return prisma.news.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true } },
    },
  });
}

export async function create(data) {
  return prisma.news.create({
    data,
    include: {
      author: { select: { id: true, name: true } },
    },
  });
}

export async function update(id, data) {
  const oldNews = await prisma.news.findUnique({ where: { id } });
  
  if (oldNews && data.coverImage && oldNews.coverImage && data.coverImage !== oldNews.coverImage) {
    await deleteFile(oldNews.coverImage);
  }
  
  return prisma.news.update({
    where: { id },
    data,
    include: {
      author: { select: { id: true, name: true } },
    },
  });
}

export async function remove(id) {
  const news = await prisma.news.findUnique({ where: { id } });
  
  if (news && news.coverImage) {
    await deleteFile(news.coverImage);
  }
  
  return prisma.news.delete({ where: { id } });
}

