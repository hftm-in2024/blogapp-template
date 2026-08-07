import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { BlogDetailService } from './data/blog-detail.service';
import { Blog } from '../../shared/blog-card/blog.model';

/** Lädt den passenden Blog-Post anhand der Route-ID, bevor die Detail-Seite aktiviert wird. */
export const blogResolver: ResolveFn<Blog | undefined> = (route) => {
  const blogService = inject(BlogDetailService);
  const id = Number(route.paramMap.get('id'));

  return blogService.getById(id);
};
