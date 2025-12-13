import Fastify from 'fastify';
import cors from './plugins/cors.js';
import jwt from './plugins/jwt.js';
import staticFiles from './plugins/static.js';
import upload from './plugins/upload.js';

// Public routes
import publicCatalogRoutes from './api-public/catalog.js';
import publicBrandRoutes from './api-public/brands.js';
import publicServiceRoutes from './api-public/services.js';
import publicNewsRoutes from './api-public/news.js';
import publicTeamRoutes from './api-public/team.js';
import publicPartnerRoutes from './api-public/partners.js';
import publicGalleryRoutes from './api-public/gallery.js';
import publicContactRoutes from './api-public/contacts.js';
import publicPageRoutes from './api-public/pages.js';
import publicCareerRoutes from './api-public/careers.js';

// Auth routes
import authRoutes from './modules/auth/routes.js';

// Admin routes
import adminCatalogRoutes from './modules/admin/catalog/routes.js';
import adminBrandRoutes from './modules/admin/brands/routes.js';
import adminServiceRoutes from './modules/admin/services/routes.js';
import adminNewsRoutes from './modules/admin/news/routes.js';
import adminTeamRoutes from './modules/admin/team/routes.js';
import adminPartnerRoutes from './modules/admin/partners/routes.js';
import adminGalleryRoutes from './modules/admin/gallery/routes.js';
import adminContactRoutes from './modules/admin/contacts/routes.js';
import adminPageRoutes from './modules/admin/pages/routes.js';
import adminDashboardRoutes from './modules/admin/dashboard/routes.js';
import adminUploadRoutes from './modules/admin/upload/routes.js';
import adminCareerRoutes from './modules/admin/careers/routes.js';

export default async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Register plugins
  await app.register(cors);
  await app.register(jwt);
  await app.register(staticFiles);
  await app.register(upload);

  // Health check
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Public API routes
  await app.register(publicCatalogRoutes, { prefix: '/api/catalog' });
  await app.register(publicBrandRoutes, { prefix: '/api/brands' });
  await app.register(publicServiceRoutes, { prefix: '/api/services' });
  await app.register(publicNewsRoutes, { prefix: '/api/news' });
  await app.register(publicTeamRoutes, { prefix: '/api/team' });
  await app.register(publicPartnerRoutes, { prefix: '/api/partners' });
  await app.register(publicGalleryRoutes, { prefix: '/api/gallery' });
  await app.register(publicContactRoutes, { prefix: '/api/contacts' });
  await app.register(publicPageRoutes, { prefix: '/api/pages' });
  await app.register(publicCareerRoutes, { prefix: '/api/careers' });

  // Auth routes
  await app.register(authRoutes, { prefix: '/api/auth' });

  // Admin API routes
  await app.register(adminDashboardRoutes, { prefix: '/api/admin/dashboard' });
  await app.register(adminCatalogRoutes, { prefix: '/api/admin/catalog' });
  await app.register(adminBrandRoutes, { prefix: '/api/admin/brands' });
  await app.register(adminServiceRoutes, { prefix: '/api/admin/services' });
  await app.register(adminNewsRoutes, { prefix: '/api/admin/news' });
  await app.register(adminTeamRoutes, { prefix: '/api/admin/team' });
  await app.register(adminPartnerRoutes, { prefix: '/api/admin/partners' });
  await app.register(adminGalleryRoutes, { prefix: '/api/admin/gallery' });
  await app.register(adminContactRoutes, { prefix: '/api/admin/contacts' });
  await app.register(adminPageRoutes, { prefix: '/api/admin/pages' });
  await app.register(adminCareerRoutes, { prefix: '/api/admin/careers' });
  await app.register(adminUploadRoutes, { prefix: '/api/upload' });

  return app;
}
