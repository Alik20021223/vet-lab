import { PrismaClient } from '@prisma/client';
import { formatCategory, parseCategory } from '../../../utils/category.js';
import { deleteFile, deleteFiles } from '../../../utils/file.js';
const prisma = new PrismaClient();

export async function getAll(skip, limit, filters = {}) {
  const where = {
    ...(filters.category && { category: filters.category }),
    ...(filters.status && { status: filters.status }),
    ...(filters.brandId && { brandId: filters.brandId }),
    ...(filters.search && {
      OR: [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.catalogItem.findMany({
      where,
      skip,
      take: limit,
      include: {
        brand: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    }),
    prisma.catalogItem.count({ where }),
  ]);

  return {
    data: data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      fullDescription: item.fullDescription,
      applicationMethod: item.applicationMethod,
      category: item.category === 'feed_additives' ? 'feed-additives' : item.category,
      brandId: item.brandId,
      brand: item.brand ? {
        id: item.brand.id,
        name: item.brand.name,
        logo: item.brand.logo,
      } : null,
      image: item.image,
      documents: item.documents || [],
      status: item.status,
      sortOrder: item.sortOrder,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
    total,
  };
}

export async function getById(id) {
  const item = await prisma.catalogItem.findUnique({
    where: { id },
    include: {
      brand: true,
      createdBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  
  if (item) {
    return {
      ...item,
      category: formatCategory(item.category),
      brand: item.brand ? {
        id: item.brand.id,
        name: item.brand.name,
        logo: item.brand.logo,
      } : null,
      documents: item.documents || [],
    };
  }
  
  return item;
}

export async function create(data) {
  // Map category from kebab-case to enum
  const categoryMap = {
    'vaccines': 'vaccines',
    'medicines': 'medicines',
    'disinfection': 'disinfection',
    'feed-additives': 'feed_additives',
    'equipment': 'equipment',
    'antibiotics': 'antibiotics',
  };
  
  if (data.category && categoryMap[data.category]) {
    data.category = categoryMap[data.category];
  }

  return prisma.catalogItem.create({
    data,
    include: {
      brand: true,
    },
  });
}

export async function update(id, data) {
  // Map category if provided
  if (data.category) {
    data.category = parseCategory(data.category);
  }

  // Получаем старую запись для удаления старых изображений
  const oldItem = await prisma.catalogItem.findUnique({ where: { id } });
  
  if (oldItem) {
    // Если обновляется изображение, удаляем старое
    if (data.image && oldItem.image && data.image !== oldItem.image) {
      await deleteFile(oldItem.image);
    }
    
    // Если обновляются документы, удаляем старые которые больше не используются
    if (data.documents && oldItem.documents) {
      const removedDocs = oldItem.documents.filter(
        doc => !data.documents.includes(doc)
      );
      await deleteFiles(removedDocs);
    }
  }

  return prisma.catalogItem.update({
    where: { id },
    data,
    include: {
      brand: true,
    },
  });
}

export async function remove(id) {
  // Получаем запись для удаления связанных файлов
  const item = await prisma.catalogItem.findUnique({ where: { id } });
  
  if (item) {
    // Удаляем изображение
    if (item.image) {
      await deleteFile(item.image);
    }
    
    // Удаляем документы
    if (item.documents && item.documents.length > 0) {
      await deleteFiles(item.documents);
    }
  }
  
  return prisma.catalogItem.delete({
    where: { id },
  });
}

