import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getProducts(request, reply) {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: products };
  } catch (err) {
    return reply.code(500).send({ success: false, error: err.message });
  }
}

