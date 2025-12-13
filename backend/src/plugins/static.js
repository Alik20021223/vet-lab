import fp from 'fastify-plugin';
import staticFiles from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default fp(async function (fastify, opts) {
  // Основная папка для загрузок
  await fastify.register(staticFiles, {
    root: path.join(__dirname, '../../uploads'),
    prefix: '/static/',
  });
  
  // Роут для оригинальных файлов (чтобы избежать конфликта декораторов)
  fastify.get('/static/originals/*', async (request, reply) => {
    const filePath = request.url.replace('/static/originals/', '');
    const fullPath = path.join(__dirname, '../../uploads/originals', filePath);
    
    // Проверка безопасности - только файлы из папки originals
    const originalsDir = path.join(__dirname, '../../uploads/originals');
    const resolvedPath = path.resolve(fullPath);
    const resolvedDir = path.resolve(originalsDir);
    
    if (!resolvedPath.startsWith(resolvedDir)) {
      return reply.code(403).send({ error: 'Forbidden' });
    }
    
    if (!existsSync(resolvedPath)) {
      return reply.code(404).send({ error: 'File not found' });
    }
    
    try {
      const file = await readFile(resolvedPath);
      const ext = path.extname(resolvedPath).toLowerCase();
      const contentType = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
      }[ext] || 'application/octet-stream';
      
      reply.type(contentType);
      return reply.send(file);
    } catch (err) {
      return reply.code(500).send({ error: 'Error reading file' });
    }
  });
});

