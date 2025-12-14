import { PrismaClient } from '@prisma/client';
import { deleteFile } from '../../../utils/file.js';
const prisma = new PrismaClient();

export async function getAll() {
  return prisma.partner.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getById(id) {
  return prisma.partner.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.partner.create({ data });
}

export async function update(id, data) {
  const oldPartner = await prisma.partner.findUnique({ where: { id } });
  
  if (oldPartner && data.logo && oldPartner.logo && data.logo !== oldPartner.logo) {
    await deleteFile(oldPartner.logo);
  }
  
  return prisma.partner.update({ where: { id }, data });
}

export async function remove(id) {
  const partner = await prisma.partner.findUnique({ where: { id } });
  
  if (partner && partner.logo) {
    await deleteFile(partner.logo);
  }
  
  return prisma.partner.delete({ where: { id } });
}

