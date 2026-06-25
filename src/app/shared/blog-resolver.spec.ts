import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { Blog } from '../models/blog.model';
import { blogResolver } from './blog-resolver';

describe('blogResolver', () => {
  const executeResolver: ResolveFn<Blog | undefined> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => blogResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('should resolve a blog by id', () => {
    const route = {
      paramMap: {
        get: () => '1',
      },
    } as unknown as ActivatedRouteSnapshot;

    const state = {} as RouterStateSnapshot;

    const result = executeResolver(route, state);

    expect(result).toBeTruthy();
  });
});
