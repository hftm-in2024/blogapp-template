import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, convertToParamMap } from '@angular/router';
import { vi } from 'vitest';

import { blogResolver } from './blog.resolver';
import { BlogService } from '../blog.service';
import { Blog } from '../../../shared/blog-card/blog.model';

const SAMPLE_BLOG: Blog = {
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

describe('blogResolver', () => {
  const getById = vi.fn();

  beforeEach(() => {
    getById.mockReset();
    TestBed.configureTestingModule({
      providers: [{ provide: BlogService, useValue: { getById } }],
    });
  });

  function routeWithId(id: string): ActivatedRouteSnapshot {
    return { paramMap: convertToParamMap({ id }) } as ActivatedRouteSnapshot;
  }

  it('lädt den Blog-Post zur ID aus der Route', async () => {
    getById.mockResolvedValue(SAMPLE_BLOG);

    const result = TestBed.runInInjectionContext(() =>
      blogResolver(routeWithId(String(SAMPLE_BLOG.id)), {} as RouterStateSnapshot),
    );

    expect(getById).toHaveBeenCalledWith(SAMPLE_BLOG.id);
    await expect(result).resolves.toEqual(SAMPLE_BLOG);
  });

  it('liefert undefined für eine unbekannte ID', async () => {
    getById.mockResolvedValue(undefined);

    const result = TestBed.runInInjectionContext(() =>
      blogResolver(routeWithId('-1'), {} as RouterStateSnapshot),
    );

    await expect(result).resolves.toBeUndefined();
  });
});
