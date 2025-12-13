import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAll(skip, limit) {
  const [data, total] = await Promise.all([
    prisma.mission.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.mission.count(),
  ]);
  return { data, total };
}

export async function getById(id) {
  return prisma.mission.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.mission.create({ data });
}

export async function update(id, data) {
  return prisma.mission.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.mission.delete({ where: { id } });
}

