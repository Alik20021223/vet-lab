// This file imports all services to ensure they are registered with the API
// Import order matters - import base API first, then all services

import '../store/api';
import './auth.service';
import './catalog.service';
import './brands.service';
import './services.service';
import './news.service';
import './team.service';
import './partners.service';
import './gallery.service';
import './contacts.service';
import './pages.service';
import './dashboard.service';
import './upload.service';

// This file is imported in store.ts to ensure all services are registered


