import fp from 'fastify-plugin';
import staticFiles from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default fp(async function (fastify, opts) {
  // Роут для оригинальных файлов (чтобы избежать конфликта декораторов)
  // Регистрируем ДО @fastify/static чтобы иметь приоритет
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
      
      // Добавляем CORS заголовки для статических файлов
      reply.header('Access-Control-Allow-Origin', '*');
      reply.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
      reply.header('Access-Control-Allow-Headers', 'Content-Type');
      reply.type(contentType);
      return reply.send(file);
    } catch (err) {
      return reply.code(500).send({ error: 'Error reading file' });
    }
  });
  
  // Роут для файлов категорий (явная обработка для файлов с дефисом и других специальных символов)
  // Регистрируем ДО @fastify/static чтобы иметь приоритет
  fastify.get('/static/categories/*', async (request, reply) => {
    // Декодируем URL для правильной обработки специальных символов
    const filePath = decodeURIComponent(request.url.replace('/static/categories/', ''));
    const fullPath = path.join(__dirname, '../../uploads/categories', filePath);
    
    // Проверка безопасности - только файлы из папки categories
    const categoriesDir = path.join(__dirname, '../../uploads/categories');
    const resolvedPath = path.resolve(fullPath);
    const resolvedDir = path.resolve(categoriesDir);
    
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
      
      // Добавляем CORS заголовки для статических файлов
      reply.header('Access-Control-Allow-Origin', '*');
      reply.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
      reply.header('Access-Control-Allow-Headers', 'Content-Type');
      reply.type(contentType);
      return reply.send(file);
    } catch (err) {
      return reply.code(500).send({ error: 'Error reading file' });
    }
  });
  
  // Основная папка для загрузок (регистрируем после специфичных роутов)
  await fastify.register(staticFiles, {
    root: path.join(__dirname, '../../uploads'),
    prefix: '/static/',
    setHeaders: (res, pathName) => {
      // Добавляем CORS заголовки для всех статических файлов
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    },
  });
});

