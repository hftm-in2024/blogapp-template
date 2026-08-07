import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, convertToParamMap } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { blogResolver } from './blog.resolver';
import { environment } from '../../../../environments/environment';

const SAMPLE_DETAIL = {
  id: 7,
  title: 'Test-Titel',
  content: 'Ein Inhalt.',
  author: 'Test Autor',
  likes: 0,
  likedByMe: false,
  createdByMe: false,
  createdAt: '2026-01-01T00:00:00',
  updatedAt: '2026-01-01T00:00:00',
};

describe('blogResolver', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function routeWithId(id: string): ActivatedRouteSnapshot {
    return { paramMap: convertToParamMap({ id }) } as ActivatedRouteSnapshot;
  }

  it('lädt den Blog-Post zur ID aus der Route', async () => {
    const result = TestBed.runInInjectionContext(() =>
      blogResolver(routeWithId('7'), {} as RouterStateSnapshot),
    );

    http.expectOne(`${environment.api}/entries/7`).flush(SAMPLE_DETAIL);

    expect(await result).toEqual(SAMPLE_DETAIL);
  });
});
