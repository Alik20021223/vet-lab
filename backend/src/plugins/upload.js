import fp from 'fastify-plugin';
import multipart from '@fastify/multipart';

export default fp(async function (fastify, opts) {
  fastify.register(multipart, {
    limits: {
      fileSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 10 * 1024 * 1024, // 10MB
    },
  });
});

