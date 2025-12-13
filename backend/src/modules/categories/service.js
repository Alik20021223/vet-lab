import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAll(skip, limit) {
  const [data, total] = await Promise.all([
    prisma.category.findMany({
      skip,
      take: limit,
      orderBy: { order: 'asc' },
    }),
    prisma.category.count(),
  ]);

  return { data, total };
}

export async function getById(id) {
  return prisma.category.findUnique({
    where: { id },
    include: { products: true },
  });
}

export async function create(data) {
  return prisma.category.create({
    data,
  });
}

export async function update(id, data) {
  return prisma.category.update({
    where: { id },
    data,
  });
}

export async function remove(id) {
  return prisma.category.delete({
    where: { id },
  });
}

