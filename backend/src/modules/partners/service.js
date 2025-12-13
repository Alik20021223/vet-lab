import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAll(skip, limit) {
  const [data, total] = await Promise.all([
    prisma.partner.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.partner.count(),
  ]);
  return { data, total };
}

export async function getById(id) {
  return prisma.partner.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.partner.create({ data });
}

export async function update(id, data) {
  return prisma.partner.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.partner.delete({ where: { id } });
}

