import * as productController from './controller.js';
import * as productSchema from './schema.js';
import adminOnly from '../../middlewares/adminOnly.js';

export default async function (app) {
  app.get('/', productController.getAll);
  app.get('/:id', productController.getById);
  app.post('/', { preHandler: adminOnly, schema: productSchema.createSchema }, productController.create);
  app.put('/:id', { preHandler: adminOnly, schema: productSchema.updateSchema }, productController.update);
  app.delete('/:id', { preHandler: adminOnly }, productController.remove);
}
