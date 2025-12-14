import { PrismaClient } from '@prisma/client';
import { resolveImageUrlsInData } from '../utils/url.js';
const prisma = new PrismaClient();

export default async function (app) {
  // GET /api/team - список всех членов команды
  app.get('/', async (request, reply) => {
    try {
      const team = await prisma.teamMember.findMany({
        orderBy: { sortOrder: 'asc' },
      });

      const responseData = {
        data: team.map(member => ({
          id: member.id,
          name: member.name,
          nameEn: member.nameEn,
          position: member.position,
          positionEn: member.positionEn,
          photo: member.photo,
          sortOrder: member.sortOrder,
        })),
      };
      
      return resolveImageUrlsInData(responseData);
    } catch (err) {
      return reply.code(500).send({ error: { message: err.message } });
    }
  });
}

