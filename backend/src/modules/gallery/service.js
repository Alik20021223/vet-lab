import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAll(skip, limit) {
  const [data, total] = await Promise.all([
    prisma.gallery.findMany({ skip, take: limit, orderBy: { order: 'asc' } }),
    prisma.gallery.count(),
  ]);
  return { data, total };
}

export async function getById(id) {
  return prisma.gallery.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.gallery.create({ data });
}

export async function update(id, data) {
  return prisma.gallery.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.gallery.delete({ where: { id } });
}

