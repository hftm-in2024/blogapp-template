import { Routes } from '@angular/router';

import { BlogDetailPage } from './blog-detail-page';
import { blogResolver } from './blog.resolver';

/**
 * Child-Routes des Detail-Features. Werden per `loadChildren` geladen, damit
 * Resolver und Service erst mit dem Feature im Bundle landen.
 */
export const routes: Routes = [
  {
    path: '',
    component: BlogDetailPage,
    resolve: { blog: blogResolver },
  },
];
