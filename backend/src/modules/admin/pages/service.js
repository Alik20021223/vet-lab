import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAll() {
  return prisma.page.findMany({ orderBy: { updatedAt: 'desc' } });
}

export async function getBySlug(slug) {
  return prisma.page.findUnique({ where: { slug } });
}

export async function update(slug, data) {
  return prisma.page.update({
    where: { slug },
    data,
  });
}

