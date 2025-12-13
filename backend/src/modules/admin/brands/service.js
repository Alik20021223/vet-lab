import { PrismaClient } from '@prisma/client';
import { deleteFile } from '../../../utils/file.js';
const prisma = new PrismaClient();

export async function getAll() {
  return prisma.brand.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getById(id) {
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) return null;
  const productsCount = await prisma.catalogItem.count({ where: { brandId: id } });
  return { ...brand, productsCount };
}

export async function create(data) {
  return prisma.brand.create({ data });
}

export async function update(id, data) {
  const oldBrand = await prisma.brand.findUnique({ where: { id } });
  
  if (oldBrand && data.logo && oldBrand.logo && data.logo !== oldBrand.logo) {
    await deleteFile(oldBrand.logo);
  }
  
  return prisma.brand.update({ where: { id }, data });
}

export async function remove(id) {
  const brand = await prisma.brand.findUnique({ where: { id } });
  
  if (brand && brand.logo) {
    await deleteFile(brand.logo);
  }
  
  return prisma.brand.delete({ where: { id } });
}

export async function getProductsCount(brandId) {
  return prisma.catalogItem.count({ where: { brandId } });
}

