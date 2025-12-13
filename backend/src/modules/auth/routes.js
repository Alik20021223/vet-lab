import * as authController from './controller.js';
import adminOnly from '../../middlewares/adminOnly.js';

export default async function (app) {
  app.post('/login', authController.login);
  app.post('/refresh', authController.refresh);
  app.post('/logout', { preHandler: [app.authenticate] }, authController.logout);
  app.get('/me', { preHandler: [app.authenticate] }, authController.me);
  app.post('/register', { preHandler: adminOnly }, authController.register);
}
