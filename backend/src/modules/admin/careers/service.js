import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAll(skip, limit, filters = {}) {
  const where = {
    ...(filters.status && { status: filters.status }),
    ...(filters.location && {
      location: { contains: filters.location, mode: 'insensitive' },
    }),
    ...(filters.type && {
      type: filters.type.replace('-', '_'), // full-time -> full_time
    }),
    ...(filters.search && {
      OR: [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { fullDescription: { contains: filters.search, mode: 'insensitive' } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.career.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    }),
    prisma.career.count({ where }),
  ]);

  return { data, total };
}

export async function getById(id) {
  return prisma.career.findUnique({ where: { id } });
}

export async function create(data) {
  // Преобразуем данные для Prisma
  const prismaData = {
    title: data.title,
    titleEn: data.titleEn,
    description: data.description,
    descriptionEn: data.descriptionEn,
    fullDescription: data.fullDescription,
    fullDescriptionEn: data.fullDescriptionEn,
    location: data.location,
    locationEn: data.locationEn,
    type: data.type.replace('-', '_'), // full-time -> full_time
    department: data.department,
    departmentEn: data.departmentEn,
    requirements: data.requirements || [],
    requirementsEn: data.requirementsEn || [],
    responsibilities: data.responsibilities || [],
    responsibilitiesEn: data.responsibilitiesEn || [],
    benefits: data.benefits || [],
    benefitsEn: data.benefitsEn || [],
    salary: data.salary || null,
    status: data.status,
    sortOrder: data.sortOrder || 0,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
  };

  return prisma.career.create({ data: prismaData });
}

export async function update(id, data) {
  const prismaData = {};

  if (data.title !== undefined) prismaData.title = data.title;
  if (data.titleEn !== undefined) prismaData.titleEn = data.titleEn;
  if (data.description !== undefined) prismaData.description = data.description;
  if (data.descriptionEn !== undefined) prismaData.descriptionEn = data.descriptionEn;
  if (data.fullDescription !== undefined) prismaData.fullDescription = data.fullDescription;
  if (data.fullDescriptionEn !== undefined) prismaData.fullDescriptionEn = data.fullDescriptionEn;
  if (data.location !== undefined) prismaData.location = data.location;
  if (data.locationEn !== undefined) prismaData.locationEn = data.locationEn;
  if (data.type !== undefined) prismaData.type = data.type.replace('-', '_');
  if (data.department !== undefined) prismaData.department = data.department;
  if (data.departmentEn !== undefined) prismaData.departmentEn = data.departmentEn;
  if (data.requirements !== undefined) prismaData.requirements = data.requirements;
  if (data.requirementsEn !== undefined) prismaData.requirementsEn = data.requirementsEn;
  if (data.responsibilities !== undefined) prismaData.responsibilities = data.responsibilities;
  if (data.responsibilitiesEn !== undefined) prismaData.responsibilitiesEn = data.responsibilitiesEn;
  if (data.benefits !== undefined) prismaData.benefits = data.benefits;
  if (data.benefitsEn !== undefined) prismaData.benefitsEn = data.benefitsEn;
  if (data.salary !== undefined) prismaData.salary = data.salary;
  if (data.status !== undefined) prismaData.status = data.status;
  if (data.sortOrder !== undefined) prismaData.sortOrder = data.sortOrder;
  if (data.expiresAt !== undefined) {
    prismaData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
  }

  return prisma.career.update({ where: { id }, data: prismaData });
}

export async function remove(id) {
  return prisma.career.delete({ where: { id } });
}

