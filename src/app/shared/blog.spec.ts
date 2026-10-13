import { TestBed } from '@angular/core/testing';

import { BlogService } from './blog';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all blogs', () => {
    const blogs = service.getAll();

    expect(blogs.length).toBeGreaterThan(0);
  });

  it('should return a blog by id', () => {
    const firstBlog = service.getAll()[0];

    const blog = service.getById(firstBlog.id);

    expect(blog).toEqual(firstBlog);
  });

  it('should return undefined for unknown id', () => {
    const blog = service.getById(999999);

    expect(blog).toBeUndefined();
  });
});
