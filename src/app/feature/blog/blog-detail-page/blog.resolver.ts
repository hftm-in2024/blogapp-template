import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { BlogService } from '../blog.service';
import { BlogDetail } from '../../../shared/blog-card/blog.model';

/** Lädt den passenden Blog-Post anhand der Route-ID, bevor die Detail-Seite aktiviert wird. */
export const blogResolver: ResolveFn<BlogDetail | undefined> = (route) => {
  const blogService = inject(BlogService);
  const id = Number(route.paramMap.get('id'));

  return blogService.getById(id);
};
