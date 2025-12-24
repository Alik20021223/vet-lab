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
  const existing = await prisma.contactInfo.findFirst({
    orderBy: { updatedAt: 'desc' },
  });
  
  // Filter out undefined and null values for optional fields, but keep required fields
  const updateData = {};
  const allowedFields = ['phone', 'email', 'address', 'addressEn', 'mapLat', 'mapLng', 'workingHours', 'workingHoursEn', 'facebook', 'instagram', 'telegram'];
  
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });
  
  if (existing) {
    return prisma.contactInfo.update({
      where: { id: existing.id },
      data: updateData,
    });
  } else {
    // For create, ensure all required fields are present
    if (!updateData.phone || !updateData.email || !updateData.address || 
        updateData.mapLat === undefined || updateData.mapLng === undefined) {
      throw new Error('Missing required fields: phone, email, address, mapLat, mapLng');
    }
    return prisma.contactInfo.create({ data: updateData });
  }
}

