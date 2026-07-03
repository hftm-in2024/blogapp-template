import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { BlogService } from '../blog.service';
import { Blog } from '../../../shared/blog-card/blog.model';

export const entriesResolver: ResolveFn<Promise<Blog[]>> = async () => {
  const blogService = inject(BlogService);
  const result_1 = await blogService.getAll();
  return result_1.data;
};
