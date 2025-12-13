import * as controller from './controller.js';
import * as schema from './schema.js';
import adminOnly from '../../../middlewares/adminOnly.js';

export default async function (app) {
  app.get('/', { preHandler: adminOnly }, controller.get);
  app.put('/', { preHandler: adminOnly, schema: schema.updateSchema }, controller.update);
}

