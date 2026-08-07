import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BlogService } from './blog.service';
import { environment } from '../../../environments/environment';
import { Blog } from '../../shared/blog-card/blog.model';

const SAMPLE_BLOG: Blog = {
  id: 1,
  title: 'Test-Titel',
  contentPreview: 'Eine kurze Vorschau.',
  author: 'Test Autor',
  likes: 0,
  comments: 0,
  likedByMe: false,
  createdByMe: false,
  createdAt: '2026-01-01T00:00:00',
  updatedAt: '2026-01-01T00:00:00',
};

const SAMPLE_RESPONSE = {
  data: [SAMPLE_BLOG],
  pageIndex: 0,
  pageSize: 20,
  totalCount: 1,
  maxPageSize: 1000,
};

describe('BlogService', () => {
  let service: BlogService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BlogService);
    http = TestBed.inject(HttpTestingController);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() liefert die Blog-Posts aus der API-Antwort', async () => {
    const blogs = service.getAll();

    http.expectOne(`${environment.api}/entries`).flush(SAMPLE_RESPONSE);

    expect(await blogs).toEqual([SAMPLE_BLOG]);
  });

  it('getAll() liefert eine leere Liste, wenn die Antwort nicht zum Schema passt', async () => {
    const blogs = service.getAll();

    http.expectOne(`${environment.api}/entries`).flush({ data: [{ id: 'keine Zahl' }] });

    expect(await blogs).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });

  it('getAll() liefert eine leere Liste, wenn das Backend nicht erreichbar ist', async () => {
    const blogs = service.getAll();

    http.expectOne(`${environment.api}/entries`).error(new ProgressEvent('network error'));

    expect(await blogs).toEqual([]);
  });

  it('getById() liefert undefined für eine unbekannte ID', async () => {
    const blog = service.getById(-1);

    http
      .expectOne(`${environment.api}/entries/-1`)
      .flush('', { status: 404, statusText: 'Not Found' });

    expect(await blog).toBeUndefined();
  });

  it('create() schickt einen POST mit dem Blog als Body', async () => {
    const created = service.create({ title: 'Neu', content: 'Inhalt' });

    const request = http.expectOne(`${environment.api}/entries`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ title: 'Neu', content: 'Inhalt' });
    request.flush({ ...SAMPLE_BLOG, content: 'Inhalt', comments: [] });

    await created;
  });

  it('update() schickt einen PUT auf die ID', async () => {
    const updated = service.update(1, { title: 'Neu', content: 'Inhalt' });

    const request = http.expectOne(`${environment.api}/entries/1`);
    expect(request.request.method).toBe('PUT');
    request.flush({ ...SAMPLE_BLOG, content: 'Inhalt', comments: [] });

    await updated;
  });

  it('delete() schickt einen DELETE auf die ID', async () => {
    const deleted = service.delete(1);

    const request = http.expectOne(`${environment.api}/entries/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);

    await deleted;
  });
});
