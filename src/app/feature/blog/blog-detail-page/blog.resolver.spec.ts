import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, convertToParamMap } from '@angular/router';

import { blogResolver } from './blog.resolver';
import { BlogService } from '../blog.service';

describe('blogResolver', () => {
  let blogService: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    blogService = TestBed.inject(BlogService);
  });

  function routeWithId(id: string): ActivatedRouteSnapshot {
    return { paramMap: convertToParamMap({ id }) } as ActivatedRouteSnapshot;
  }

  it('lädt den Blog-Post zur ID aus der Route', () => {
    const [firstBlog] = blogService.getAll();

    const result = TestBed.runInInjectionContext(() =>
      blogResolver(routeWithId(String(firstBlog.id)), {} as RouterStateSnapshot),
    );

    expect(result).toEqual(firstBlog);
  });

  it('liefert undefined für eine unbekannte ID', () => {
    const result = TestBed.runInInjectionContext(() =>
      blogResolver(routeWithId('-1'), {} as RouterStateSnapshot),
    );

    expect(result).toBeUndefined();
  });
});
