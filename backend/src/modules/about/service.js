import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAll(skip, limit) {
  const [data, total] = await Promise.all([
    prisma.about.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.about.count(),
  ]);
  return { data, total };
}

export async function getById(id) {
  return prisma.about.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.about.create({ data });
}

export async function update(id, data) {
  return prisma.about.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.about.delete({ where: { id } });
}

