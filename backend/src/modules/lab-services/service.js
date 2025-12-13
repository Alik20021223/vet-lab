import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAll(skip, limit) {
  const [data, total] = await Promise.all([
    prisma.labService.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.labService.count(),
  ]);
  return { data, total };
}

export async function getById(id) {
  return prisma.labService.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.labService.create({ data });
}

export async function update(id, data) {
  return prisma.labService.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.labService.delete({ where: { id } });
}

