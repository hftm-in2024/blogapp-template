import { Routes } from '@angular/router';
import { BlogOverviewPageComponent } from './blog-overview-page/blog-overview-page';
import { blogResolver } from './shared/blog.resolver';
import { entriesResolver } from './feature/blog/blog-overview-page/entries-resolver';

export const routes: Routes = [
  {
    path: '',
    component: BlogOverviewPageComponent,
    resolve: {
      blogs: entriesResolver,
    },
  },
  {
    path: 'blog/:id',
    loadComponent: () =>
      import('./blog-detail-page/blog-detail-page').then((m) => m.BlogDetailPage),
    resolve: {
      blog: blogResolver,
    },
  },
  {
    path: 'about',
    loadComponent: () => import('./about-page/about-page').then((m) => m.AboutPage),
  },
  {
    path: '**',
    loadComponent: () => import('./not-found-page/not-found-page').then((m) => m.NotFoundPage),
  },
];
