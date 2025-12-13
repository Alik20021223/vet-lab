import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getCategories(request, reply) {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
      orderBy: { order: 'asc' },
    });
    return { success: true, data: categories };
  } catch (err) {
    return reply.code(500).send({ success: false, error: err.message });
  }
}

