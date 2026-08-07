import { Routes } from '@angular/router';

import { BlogDetailPage } from './blog-detail-page';
import { blogResolver } from './blog.resolver';

/** Lazy geladene Child-Routes der Detail-Seite — via `loadChildren` in `app.routes.ts`. */
const routes: Routes = [
  { path: ':id', component: BlogDetailPage, resolve: { blog: blogResolver } },
];

export default routes;
