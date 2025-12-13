import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAll(skip, limit) {
  const [data, total] = await Promise.all([
    prisma.equipment.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.equipment.count(),
  ]);
  return { data, total };
}

export async function getById(id) {
  return prisma.equipment.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.equipment.create({ data });
}

export async function update(id, data) {
  return prisma.equipment.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.equipment.delete({ where: { id } });
}

