import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { Blog } from '../../../shared/blog-card/blog.model';
import { BlogService } from '../../../shared/blog.service';

/** Lädt den passenden Blog-Post anhand der Route-ID, bevor die Detail-Seite aktiviert wird. */
export const blogResolver: ResolveFn<Blog | undefined> = (route) => {
  const blogService = inject(BlogService);
  const id = Number(route.paramMap.get('id'));

  return blogService.getById(id);
};
