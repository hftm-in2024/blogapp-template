import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BlogService } from './blog.service';
import { environment } from '../../../environments/environment';
import { BlogResponse } from '../../shared/blog-card/blog.model';

const RESPONSE: BlogResponse = {
  data: [
    {
      id: 1,
      title: 'Test-Titel',
      contentPreview: 'Ein Inhalt.',
      author: 'Test Autor',
      likes: 0,
      comments: 0,
      likedByMe: false,
      createdByMe: false,
      createdAt: '2026-01-01T00:00:00',
      updatedAt: '2026-01-01T00:00:00',
    },
  ],
  total: 1,
  page: 1,
  limit: 10,
};

describe('BlogService', () => {
  let service: BlogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BlogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() lädt die Blog-Posts vom Backend', async () => {
    const result = service.getAll();
    httpMock.expectOne(environment.api + '/entries').flush(RESPONSE);

    await expect(result).resolves.toEqual(RESPONSE);
  });

  it('getById() lädt den passenden Post', async () => {
    const result = service.getById(1);
    httpMock.expectOne(environment.api + '/entries/1').flush(RESPONSE.data[0]);

    await expect(result).resolves.toEqual(RESPONSE.data[0]);
  });

  it('like() sendet einen POST auf den like-info-Endpoint', async () => {
    const result = service.like(1);
    const request = httpMock.expectOne(environment.api + '/entries/1/like-info');
    expect(request.request.method).toBe('POST');
    request.flush({});

    await expect(result).resolves.toBeUndefined();
  });
});
