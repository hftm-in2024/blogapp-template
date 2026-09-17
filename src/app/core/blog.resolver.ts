import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { BlogService } from '../shared/blog';

export const blogResolver: ResolveFn<unknown> = (route) => {
  console.log('Resolver executado');

  const service = inject(BlogService);

  return service.getById(Number(route.paramMap.get('id')));
};
