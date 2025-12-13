import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAll(skip, limit) {
  const [data, total] = await Promise.all([
    prisma.premix.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.premix.count(),
  ]);
  return { data, total };
}

export async function getById(id) {
  return prisma.premix.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.premix.create({ data });
}

export async function update(id, data) {
  return prisma.premix.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.premix.delete({ where: { id } });
}

