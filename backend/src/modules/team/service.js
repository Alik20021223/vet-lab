import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAll(skip, limit) {
  const [data, total] = await Promise.all([
    prisma.teamMember.findMany({ skip, take: limit, orderBy: { order: 'asc' } }),
    prisma.teamMember.count(),
  ]);
  return { data, total };
}

export async function getById(id) {
  return prisma.teamMember.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.teamMember.create({ data });
}

export async function update(id, data) {
  return prisma.teamMember.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.teamMember.delete({ where: { id } });
}

