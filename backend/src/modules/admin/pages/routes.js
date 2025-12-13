import * as controller from './controller.js';
import * as schema from './schema.js';
import adminOnly from '../../../middlewares/adminOnly.js';

export default async function (app) {
  app.get('/', { preHandler: adminOnly }, controller.getAll);
  app.get('/:slug', { preHandler: adminOnly }, controller.getBySlug);
  app.put('/:slug', { preHandler: adminOnly, schema: schema.updateSchema }, controller.update);
}

