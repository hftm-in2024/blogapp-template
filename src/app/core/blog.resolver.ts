import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { BlogService } from '../shared/blog';

export const blogResolver: ResolveFn<unknown> = async (route) => {
  const service = inject(BlogService);

  return await service.getById(Number(route.paramMap.get('id')));
};
