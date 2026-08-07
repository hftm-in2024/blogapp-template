import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { BlogOverviewPage } from './blog-overview-page';
import { BlogService } from '../blog.service';
import { BlogResponse } from '../../../shared/blog-card/blog.model';

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

describe('BlogOverviewPage', () => {
  let fixture: ComponentFixture<BlogOverviewPage>;
  const getAll = vi.fn();

  async function createComponent(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [BlogOverviewPage],
      providers: [provideRouter([]), { provide: BlogService, useValue: { getAll, like: vi.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogOverviewPage);
    await fixture.whenStable();
  }

  beforeEach(() => {
    localStorage.clear();
    getAll.mockReset().mockResolvedValue(RESPONSE);
  });

  it('should create', async () => {
    await createComponent();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('lädt die Blog-Posts über den State Service und rendert sie', async () => {
    await createComponent();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(getAll).toHaveBeenCalled();
    expect(compiled.querySelectorAll('app-blog-card')).toHaveLength(1);
    expect(compiled.querySelector('.blog-count')?.textContent).toContain('1');
  });

  it('zeigt einen Spinner, solange geladen wird', async () => {
    getAll.mockReturnValue(new Promise(() => undefined));
    await createComponent();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-spinner')).toBeTruthy();
    expect(compiled.querySelector('app-blog-card')).toBeNull();
  });

  it('zeigt eine Fehlermeldung, wenn das Laden scheitert', async () => {
    getAll.mockRejectedValue(new Error('offline'));
    await createComponent();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-state')?.textContent).toContain('nicht geladen');
  });
});
