import * as categoryController from './controller.js';
import * as categorySchema from './schema.js';
import adminOnly from '../../middlewares/adminOnly.js';

export default async function (app) {
  app.get('/', categoryController.getAll);
  app.get('/:id', categoryController.getById);
  app.post('/', { preHandler: adminOnly, schema: categorySchema.createSchema }, categoryController.create);
  app.put('/:id', { preHandler: adminOnly, schema: categorySchema.updateSchema }, categoryController.update);
  app.delete('/:id', { preHandler: adminOnly }, categoryController.remove);
}
