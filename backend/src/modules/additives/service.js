import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAll(skip, limit) {
  const [data, total] = await Promise.all([
    prisma.additive.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.additive.count(),
  ]);
  return { data, total };
}

export async function getById(id) {
  return prisma.additive.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.additive.create({ data });
}

export async function update(id, data) {
  return prisma.additive.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.additive.delete({ where: { id } });
}

