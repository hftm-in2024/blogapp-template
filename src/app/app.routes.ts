import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./feature/blog/blog-overview-page/blog-overview-page').then(
        (m) => m.BlogOverviewPage,
      ),
  },
  {
    path: 'blog',
    loadChildren: () => import('./feature/blog/blog-detail-page/blog-detail-page.routes'),
  },
  {
    path: 'about',
    loadComponent: () => import('./feature/about-page/about-page').then((m) => m.AboutPage),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./feature/not-found-page/not-found-page').then((m) => m.NotFoundPage),
  },
];
