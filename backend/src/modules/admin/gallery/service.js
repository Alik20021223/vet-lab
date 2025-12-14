import { PrismaClient } from '@prisma/client';
import { deleteFile } from '../../../utils/file.js';
const prisma = new PrismaClient();

export async function getAll(skip, limit, filters = {}) {
  const where = {
    ...(filters.category && { category: filters.category }),
  };
  const [data, total] = await Promise.all([
    prisma.gallery.findMany({ where, skip, take: limit, orderBy: { sortOrder: 'asc' } }),
    prisma.gallery.count({ where }),
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
  const oldItem = await prisma.gallery.findUnique({ where: { id } });
  
  if (oldItem && data.image && oldItem.image && data.image !== oldItem.image) {
    await deleteFile(oldItem.image);
  }
  
  return prisma.gallery.update({ where: { id }, data });
}

export async function remove(id) {
  const item = await prisma.gallery.findUnique({ where: { id } });
  
  if (item && item.image) {
    await deleteFile(item.image);
  }
  
  return prisma.gallery.delete({ where: { id } });
}

