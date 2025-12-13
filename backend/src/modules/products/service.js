import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAll(skip, limit) {
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count(),
  ]);

  return { data, total };
}

export async function getById(id) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function create(data) {
  return prisma.product.create({
    data,
    include: { category: true },
  });
}

export async function update(id, data) {
  return prisma.product.update({
    where: { id },
    data,
    include: { category: true },
  });
}

export async function remove(id) {
  return prisma.product.delete({
    where: { id },
  });
}

