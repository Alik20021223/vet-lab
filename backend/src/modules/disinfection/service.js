import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAll(skip, limit) {
  const [data, total] = await Promise.all([
    prisma.disinfection.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.disinfection.count(),
  ]);
  return { data, total };
}

export async function getById(id) {
  return prisma.disinfection.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.disinfection.create({ data });
}

export async function update(id, data) {
  return prisma.disinfection.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.disinfection.delete({ where: { id } });
}

