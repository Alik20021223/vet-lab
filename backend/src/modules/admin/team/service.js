import { PrismaClient } from '@prisma/client';
import { deleteFile } from '../../../utils/file.js';
const prisma = new PrismaClient();

export async function getAll() {
  return prisma.teamMember.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getById(id) {
  return prisma.teamMember.findUnique({ where: { id } });
}

export async function create(data) {
  return prisma.teamMember.create({ data });
}

export async function update(id, data) {
  const oldMember = await prisma.teamMember.findUnique({ where: { id } });
  
  if (oldMember && data.photo && oldMember.photo && data.photo !== oldMember.photo) {
    await deleteFile(oldMember.photo);
  }
  
  return prisma.teamMember.update({ where: { id }, data });
}

export async function remove(id) {
  const member = await prisma.teamMember.findUnique({ where: { id } });
  
  if (member && member.photo) {
    await deleteFile(member.photo);
  }
  
  return prisma.teamMember.delete({ where: { id } });
}

