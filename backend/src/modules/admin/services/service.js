import { PrismaClient } from '@prisma/client';
import { deleteFile } from '../../../utils/file.js';
import { resolveImageUrlsInData } from '../../../utils/url.js';
const prisma = new PrismaClient();

export async function getAll(skip, limit, filters = {}) {
  const where = {
    ...(filters.status && { status: filters.status }),
  };
  const [data, total] = await Promise.all([
    prisma.service.findMany({ where, skip, take: limit, orderBy: { sortOrder: 'asc' } }),
    prisma.service.count({ where }),
  ]);
  return resolveImageUrlsInData({ data, total });
}

export async function getById(id) {
  const service = await prisma.service.findUnique({ where: { id } });
  return resolveImageUrlsInData(service);
}

export async function create(data) {
  return prisma.service.create({ data });
}

export async function update(id, data) {
  const oldService = await prisma.service.findUnique({ where: { id } });
  
  if (oldService) {
    // Удаляем старое изображение если оно изменилось
    if (data.image && oldService.image && data.image !== oldService.image) {
      await deleteFile(oldService.image);
    }
    
    // Удаляем старую иконку если она изменилась
    if (data.icon && oldService.icon && data.icon !== oldService.icon) {
      await deleteFile(oldService.icon);
    }
  }
  
  return prisma.service.update({ where: { id }, data });
}

export async function remove(id) {
  const service = await prisma.service.findUnique({ where: { id } });
  
  if (service) {
    if (service.image) await deleteFile(service.image);
    if (service.icon) await deleteFile(service.icon);
  }
  
  return prisma.service.delete({ where: { id } });
}

