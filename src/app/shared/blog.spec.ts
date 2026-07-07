import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { BlogService } from './blog';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(BlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose CRUD methods', () => {
    expect(service.getAll).toBeTruthy();
    expect(service.getById).toBeTruthy();
    expect(service.createBlog).toBeTruthy();
    expect(service.updateBlog).toBeTruthy();
    expect(service.deleteBlog).toBeTruthy();
  });
});
