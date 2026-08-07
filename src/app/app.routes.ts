import { Routes } from '@angular/router';

export const routes: Routes = [
  // Kein Resolver mehr: die Daten holt der BlogStateService, damit Loading- und
  // Error-State in der Komponente sichtbar werden.
  {
    path: '',
    loadComponent: () =>
      import('./feature/blog-overview-page/blog-overview-page').then((m) => m.BlogOverviewPage),
  },
  {
    path: 'blog/:id',
    loadChildren: () =>
      import('./feature/blog-detail-page/blog-detail-page.routes').then((m) => m.routes),
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
