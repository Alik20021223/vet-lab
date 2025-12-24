import * as controller from './controller.js';
import * as schema from './schema.js';
import * as sectionsController from './sections-controller.js';
import * as sectionsSchema from './sections-schema.js';
import adminOnly from '../../../middlewares/adminOnly.js';

export default async function (app) {
  // Gallery items routes
  app.get('/', { preHandler: adminOnly }, controller.getAll);
  app.get('/:id', { preHandler: adminOnly }, controller.getById);
  app.post('/', { preHandler: adminOnly, schema: schema.createSchema }, controller.create);
  app.put('/:id', { preHandler: adminOnly, schema: schema.updateSchema }, controller.update);
  app.delete('/:id', { preHandler: adminOnly }, controller.remove);
  
  // Gallery sections routes
  app.get('/sections/all', { preHandler: adminOnly }, sectionsController.getAllSections);
  app.get('/sections/:id', { preHandler: adminOnly }, sectionsController.getSectionById);
  app.post('/sections', { preHandler: adminOnly, schema: sectionsSchema.createSectionSchema }, sectionsController.createSection);
  app.put('/sections/:id', { preHandler: adminOnly, schema: sectionsSchema.updateSectionSchema }, sectionsController.updateSection);
  app.delete('/sections/:id', { preHandler: adminOnly }, sectionsController.removeSection);
}

