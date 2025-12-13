import { PrismaClient } from '@prisma/client';
import { formatCategory } from '../../../utils/category.js';
const prisma = new PrismaClient();

export async function getStats() {
  const [
    totalProducts,
    totalServices,
    totalNews,
    totalTeamMembers,
    totalPartners,
    totalGalleryItems,
    totalBrands,
    totalCareers,
    productsByCategoryRaw,
  ] = await Promise.all([
    // Только активные товары
    prisma.catalogItem.count({ where: { status: 'active' } }),
    // Только активные услуги
    prisma.service.count({ where: { status: 'active' } }),
    // Только опубликованные новости
    prisma.news.count({ where: { status: 'published' } }),
    // Все члены команды
    prisma.teamMember.count(),
    // Все партнеры
    prisma.partner.count(),
    // Все элементы галереи
    prisma.gallery.count(),
    // Все бренды
    prisma.brand.count(),
    // Только активные вакансии
    prisma.career.count({ where: { status: 'active' } }),
    // Распределение товаров по категориям
    prisma.catalogItem.groupBy({
      by: ['category'],
      where: { status: 'active' },
      _count: true,
    }),
  ]);

  const totalProductsCount = totalProducts;
  
  // Форматируем категории и считаем проценты
  const productsByCategory = productsByCategoryRaw.map(item => ({
    category: formatCategory(item.category),
    count: item._count,
    percentage: totalProductsCount > 0 
      ? Number(((item._count / totalProductsCount) * 100).toFixed(2))
      : 0,
  }));

  // Вычисляем изменения за месяц
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [
    productsLastMonth,
    servicesLastMonth,
    newsLastMonth,
    teamMembersLastMonth,
    partnersLastMonth,
    galleryItemsLastMonth,
    brandsLastMonth,
    careersLastMonth,
  ] = await Promise.all([
    prisma.catalogItem.count({
      where: {
        status: 'active',
        createdAt: { lt: oneMonthAgo },
      },
    }),
    prisma.service.count({
      where: {
        status: 'active',
        createdAt: { lt: oneMonthAgo },
      },
    }),
    prisma.news.count({
      where: {
        status: 'published',
        createdAt: { lt: oneMonthAgo },
      },
    }),
    prisma.teamMember.count({
      where: {
        createdAt: { lt: oneMonthAgo },
      },
    }),
    prisma.partner.count({
      where: {
        createdAt: { lt: oneMonthAgo },
      },
    }),
    prisma.gallery.count({
      where: {
        createdAt: { lt: oneMonthAgo },
      },
    }),
    prisma.brand.count({
      where: {
        createdAt: { lt: oneMonthAgo },
      },
    }),
    prisma.career.count({
      where: {
        status: 'active',
        createdAt: { lt: oneMonthAgo },
      },
    }),
  ]);

  // Вычисляем изменения
  const calculateChange = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? { value: 100, type: 'percent', period: 'month' } : null;
    }
    const percentChange = ((current - previous) / previous) * 100;
    return {
      value: Number(percentChange.toFixed(2)),
      type: 'percent',
      period: 'month',
    };
  };

  const changes = {};
  
  const productsChange = calculateChange(totalProducts, productsLastMonth);
  if (productsChange) changes.products = productsChange;
  
  const servicesChange = calculateChange(totalServices, servicesLastMonth);
  if (servicesChange) changes.services = servicesChange;
  
  const newsChange = calculateChange(totalNews, newsLastMonth);
  if (newsChange) changes.news = newsChange;
  
  // Для teamMembers используем абсолютное значение
  const teamMembersDiff = totalTeamMembers - teamMembersLastMonth;
  if (teamMembersDiff !== 0) {
    changes.teamMembers = {
      value: teamMembersDiff,
      type: 'absolute',
      period: 'month',
    };
  }
  
  const partnersChange = calculateChange(totalPartners, partnersLastMonth);
  if (partnersChange) changes.partners = partnersChange;
  
  const galleryChange = calculateChange(totalGalleryItems, galleryItemsLastMonth);
  if (galleryChange) changes.galleryItems = galleryChange;
  
  const brandsChange = calculateChange(totalBrands, brandsLastMonth);
  if (brandsChange) changes.brands = brandsChange;
  
  const careersChange = calculateChange(totalCareers, careersLastMonth);
  if (careersChange) changes.careers = careersChange;

  return {
    totalProducts,
    totalServices,
    totalNews,
    totalTeamMembers,
    totalPartners,
    totalGalleryItems,
    totalBrands,
    totalCareers,
    productsByCategory,
    ...(Object.keys(changes).length > 0 && { changes }),
  };
}

export async function getActivity(filters = {}) {
  const limit = Math.min(parseInt(filters.limit) || 20, 100);
  const offset = parseInt(filters.offset) || 0;

  const where = {
    ...(filters.entity && { entity: filters.entity }),
    ...(filters.action && { action: filters.action }),
    ...(filters.userId && { userId: filters.userId }),
  };

  const [activity, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.activity.count({ where }),
  ]);

  return {
    activity: activity.map(item => ({
      id: item.id,
      action: item.action,
      entity: item.entity,
      entityId: item.entityId,
      entityName: item.entityName,
      user: {
        id: item.user.id,
        name: item.user.name || 'Unknown',
        email: item.user.email,
      },
      timestamp: item.timestamp.toISOString(),
      details: item.details,
      metadata: item.metadata || {},
    })),
    pagination: {
      limit,
      offset,
      total,
      hasMore: offset + limit < total,
    },
  };
}
