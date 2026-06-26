import { TestBed } from '@angular/core/testing';

import { BlogService } from './blog.service';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() liefert alle Blog-Posts', () => {
    expect(service.getAll().length).toBeGreaterThan(0);
  });

  it('getById() liefert den passenden Post', () => {
    const [firstBlog] = service.getAll();

    expect(service.getById(firstBlog.id)).toEqual(firstBlog);
  });

  it('getById() liefert undefined für eine unbekannte ID', () => {
    expect(service.getById(-1)).toBeUndefined();
  });
});
