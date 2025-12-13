import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAll(skip, limit) {
  const [data, total] = await Promise.all([
    prisma.career.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.career.count(),
  ]);
  return { data, total };
}

export async function getById(id) {
  return prisma.career.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.career.create({ data });
}

export async function update(id, data) {
  return prisma.career.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.career.delete({ where: { id } });
}

