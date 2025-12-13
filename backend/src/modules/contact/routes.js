import * as contactController from './controller.js';
import adminOnly from '../../middlewares/adminOnly.js';

export default async function (app) {
  app.post('/', contactController.create); // Public endpoint
  app.get('/', { preHandler: adminOnly }, contactController.getAll);
  app.get('/:id', { preHandler: adminOnly }, contactController.getById);
  app.put('/:id', { preHandler: adminOnly }, contactController.update);
  app.delete('/:id', { preHandler: adminOnly }, contactController.remove);
}

