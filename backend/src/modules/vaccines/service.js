import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAll(skip, limit) {
  const [data, total] = await Promise.all([
    prisma.vaccine.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.vaccine.count(),
  ]);
  return { data, total };
}

export async function getById(id) {
  return prisma.vaccine.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.vaccine.create({ data });
}

export async function update(id, data) {
  return prisma.vaccine.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.vaccine.delete({ where: { id } });
}

