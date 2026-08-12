import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { BlogStateService } from './blog-state';

describe('BlogStateService', () => {
  let service: BlogStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(BlogStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have an initial blog count of 0', () => {
    expect(service.blogCount()).toBe(0);
  });

  it('should have loading set to false initially', () => {
    expect(service.loading()).toBe(false);
  });

  it('should have no error initially', () => {
    expect(service.error()).toBeNull();
  });
});
