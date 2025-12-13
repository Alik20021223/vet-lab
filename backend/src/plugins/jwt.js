import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

export default fp(async function (fastify, opts) {
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  });

  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});

