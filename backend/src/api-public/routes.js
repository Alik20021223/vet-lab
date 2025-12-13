import * as products from './products.js';
import * as categories from './categories.js';
import * as services from './services.js';
import * as gallery from './gallery.js';

export default async function (app) {
  app.get('/products', products.getProducts);
  app.get('/categories', categories.getCategories);
  app.get('/services', services.getServices);
  app.get('/gallery', gallery.getGallery);
}

