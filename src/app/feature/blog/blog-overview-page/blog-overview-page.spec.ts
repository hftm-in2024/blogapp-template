import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BlogOverviewPage } from './blog-overview-page';
import { environment } from '../../../../environments/environment';
import { Blog } from '../../../shared/blog-card/blog.model';

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

describe('BlogOverviewPage', () => {
  let component: BlogOverviewPage;
  let fixture: ComponentFixture<BlogOverviewPage>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogOverviewPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(BlogOverviewPage);
    component = fixture.componentInstance;
  });

  afterEach(() => http.verify());

  /** Lässt alle offenen Microtasks der async/await-Ketten durchlaufen. */
  function tick(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve));
  }

  /** Beantwortet den GET aus dem Konstruktor und rendert das Ergebnis. */
  async function flushBlogs(): Promise<void> {
    http.expectOne(`${environment.api}/entries`).flush(SAMPLE_RESPONSE);
    await tick();
    await fixture.whenStable();
  }

  it('should create', async () => {
    await flushBlogs();
    expect(component).toBeTruthy();
  });

  it('zeigt den Loading-State, solange der API-Call läuft', async () => {
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Laden');

    await flushBlogs();
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Laden');
  });

  it('lädt die Blog-Posts über den BlogService und rendert sie', async () => {
    await flushBlogs();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-blog-card').length).toBe(1);
  });

  it('liked einen Post und lädt die Liste neu', async () => {
    await flushBlogs();

    const liked = component.onLiked(SAMPLE_BLOG.id);
    http.expectOne(`${environment.api}/entries/${SAMPLE_BLOG.id}/like-info`).flush(null);
    await tick();
    http.expectOne(`${environment.api}/entries`).flush({ ...SAMPLE_RESPONSE, data: [] });
    await liked;

    expect(component.blogs()).toEqual([]);
  });

  it('zeigt eine Fehlermeldung, wenn ein API-Call fehlschlägt', async () => {
    await flushBlogs();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const liked = component.onLiked(SAMPLE_BLOG.id);
    http
      .expectOne(`${environment.api}/entries/${SAMPLE_BLOG.id}/like-info`)
      .flush('', { status: 401, statusText: 'Unauthorized' });
    await liked;

    expect(component.error()).toContain('fehlgeschlagen');
    vi.restoreAllMocks();
  });
});
