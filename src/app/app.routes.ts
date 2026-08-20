import { Routes } from '@angular/router';

import { BlogOverviewPage } from './feature/blog-overview-page/blog-overview-page';
import { NotFoundPage } from './feature/not-found-page/not-found-page';
import { LoginPage } from './feature/login-page/login-page';

import { blogResolver } from './core/blog.resolver';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: BlogOverviewPage,
  },
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'blog/:id',
    loadComponent: () =>
      import('./feature/blog-detail-page/blog-detail-page').then((m) => m.BlogDetailPage),
    resolve: {
      blog: blogResolver,
    },
  },
  {
    path: 'admin',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./feature/not-found-page/not-found-page').then((m) => m.NotFoundPage),
  },
  {
    path: '**',
    component: NotFoundPage,
  },
];
