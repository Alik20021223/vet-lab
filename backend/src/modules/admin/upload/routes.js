import * as controller from './controller.js';
import adminOnly from '../../../middlewares/adminOnly.js';

export default async function (app) {
  app.post('/image', { preHandler: adminOnly }, controller.uploadImage);
  app.post('/document', { preHandler: adminOnly }, controller.uploadDocument);
}

