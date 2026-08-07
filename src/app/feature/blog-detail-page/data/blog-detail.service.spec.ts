import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BlogDetailService } from './blog-detail.service';
import { environment } from '../../../../environments/environment';
import { Blog } from '../../../shared/blog-card/blog.model';

const BLOG: Blog = {
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
};

describe('BlogDetailService', () => {
  let service: BlogDetailService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BlogDetailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getById() lädt den passenden Post', async () => {
    const result = service.getById(1);
    httpMock.expectOne(environment.api + '/entries/1').flush(BLOG);

    await expect(result).resolves.toEqual(BLOG);
  });
});
