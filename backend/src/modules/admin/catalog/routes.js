import * as catalogController from './controller.js';
import * as catalogSchema from './schema.js';
import adminOnly from '../../../middlewares/adminOnly.js';

export default async function (app) {
  app.get('/', { preHandler: adminOnly }, catalogController.getAll);
  app.get('/:id', { preHandler: adminOnly }, catalogController.getById);
  app.post('/', { preHandler: adminOnly, schema: catalogSchema.createSchema }, catalogController.create);
  app.put('/:id', { preHandler: adminOnly, schema: catalogSchema.updateSchema }, catalogController.update);
  app.delete('/:id', { preHandler: adminOnly }, catalogController.remove);
}

