import * as dashboardController from './controller.js';
import adminOnly from '../../../middlewares/adminOnly.js';

export default async function (app) {
  app.get('/stats', { preHandler: adminOnly }, dashboardController.getStats);
  app.get('/activity', { preHandler: adminOnly }, dashboardController.getActivity);
}

