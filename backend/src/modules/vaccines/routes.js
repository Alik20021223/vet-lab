import * as vaccineController from './controller.js';
import * as vaccineSchema from './schema.js';
import adminOnly from '../../middlewares/adminOnly.js';

export default async function (app) {
  app.get('/', vaccineController.getAll);
  app.get('/:id', vaccineController.getById);
  app.post('/', { preHandler: adminOnly, schema: vaccineSchema.createSchema }, vaccineController.create);
  app.put('/:id', { preHandler: adminOnly, schema: vaccineSchema.updateSchema }, vaccineController.update);
  app.delete('/:id', { preHandler: adminOnly }, vaccineController.remove);
}

