import { PrismaClient } from '@prisma/client';
import { deleteFile } from '../../../utils/file.js';
const prisma = new PrismaClient();

export async function getAll(skip, limit, filters = {}) {
  const where = {
    ...(filters.isActive !== undefined && { isActive: filters.isActive === 'true' }),
  };
  const [data, total] = await Promise.all([
    prisma.heroSlide.findMany({ 
      where, 
      skip, 
      take: limit, 
      orderBy: { sortOrder: 'asc' } 
    }),
    prisma.heroSlide.count({ where }),
  ]);
  return { data, total };
}

export async function getById(id) {
  return prisma.heroSlide.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.heroSlide.create({ data });
}

export async function update(id, data) {
  const oldItem = await prisma.heroSlide.findUnique({ where: { id } });
  
  if (oldItem && data.image && oldItem.image && data.image !== oldItem.image) {
    await deleteFile(oldItem.image);
  }
  
  return prisma.heroSlide.update({ where: { id }, data });
}

export async function remove(id) {
  const item = await prisma.heroSlide.findUnique({ where: { id } });
  
  if (item && item.image) {
    await deleteFile(item.image);
  }
  
  return prisma.heroSlide.delete({ where: { id } });
}
