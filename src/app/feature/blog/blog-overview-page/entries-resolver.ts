import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { BlogService } from '../../../shared/blog';

export const entriesResolver: ResolveFn<boolean> = () => {
  const blogService = inject(BlogService);
  return blogService.getAll().then(() => true);
};
