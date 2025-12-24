import * as controller from './controller.js';
import * as schema from './schema.js';
import adminOnly from '../../../middlewares/adminOnly.js';

export default async function (app) {
  app.get('/', { preHandler: adminOnly }, controller.getAll);
  app.get('/:id', { preHandler: adminOnly }, controller.getById);
  app.post('/', { preHandler: adminOnly, schema: schema.createSchema }, controller.create);
  app.put('/:id', { preHandler: adminOnly, schema: schema.updateSchema }, controller.update);
  app.delete('/:id', { preHandler: adminOnly }, controller.remove);
}
