import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function get() {
  const contactInfo = await prisma.contactInfo.findFirst({
    orderBy: { updatedAt: 'desc' },
  });
  return contactInfo || {};
}

export async function update(data) {
  // Update or create single contact info record
  const existing = await prisma.contactInfo.findFirst();
  if (existing) {
    return prisma.contactInfo.update({
      where: { id: existing.id },
      data,
    });
  } else {
    return prisma.contactInfo.create({ data });
  }
}

