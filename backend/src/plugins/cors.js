import fp from 'fastify-plugin';
import cors from '@fastify/cors';

export default fp(async function (fastify, opts) {
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  
  // Если CORS_ORIGIN содержит запятые, разбиваем на массив
  const allowedOrigins = corsOrigin.includes(',') 
    ? corsOrigin.split(',').map(origin => origin.trim())
    : corsOrigin;
  
  await fastify.register(cors, {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
});

