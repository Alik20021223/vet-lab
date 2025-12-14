import { PrismaClient } from '@prisma/client';
import { deleteFile } from '../../../utils/file.js';
import { resolveImageUrlsInData } from '../../../utils/url.js';
const prisma = new PrismaClient();

export async function getAll() {
  const members = await prisma.teamMember.findMany({ orderBy: { sortOrder: 'asc' } });
  return resolveImageUrlsInData(members);
}

export async function getById(id) {
  const member = await prisma.teamMember.findUnique({ where: { id } });
  return resolveImageUrlsInData(member);
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

