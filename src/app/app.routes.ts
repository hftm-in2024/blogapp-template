import { Routes } from '@angular/router';

import { BlogOverviewPageComponent } from './feature/blog-overview-page/blog-overview-page.component';

export const routes: Routes = [
  {
    path: '',
    component: BlogOverviewPageComponent,
  },
  {
    path: 'blog/:id',
    loadComponent: () =>
      import('./feature/blog-detail-page/blog-detail-page.component').then(
        (m) => m.BlogDetailPageComponent,
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./feature/about-page/about-page.component').then((m) => m.AboutPageComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./feature/not-found-page/not-found-page.component').then(
        (m) => m.NotFoundPageComponent,
      ),
  },
];
