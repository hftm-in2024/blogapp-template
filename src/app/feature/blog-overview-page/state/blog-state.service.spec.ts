import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ALL_AUTHORS, BlogStateService } from './blog-state.service';
import { BlogOverviewService } from '../data/blog-overview.service';
import { Blog, BlogResponse } from '../../../shared/blog-card/blog.model';

function blog(id: number, author: string, likes = 0): Blog {
  return {
    id,
    title: 'Post ' + id,
    contentPreview: 'Ein Inhalt.',
    author,
    likes,
    comments: 0,
    likedByMe: false,
    createdByMe: false,
    createdAt: '2026-01-01T00:00:00',
    updatedAt: '2026-01-01T00:00:00',
  };
}

const RESPONSE: BlogResponse = {
  data: [blog(1, 'Maria Keller'), blog(2, 'Jonas Müller'), blog(3, 'Maria Keller')],
  total: 3,
  page: 1,
  limit: 10,
};

describe('BlogStateService', () => {
  const getAll = vi.fn();
  const like = vi.fn();

  function createStore(): BlogStateService {
    TestBed.configureTestingModule({
      providers: [{ provide: BlogOverviewService, useValue: { getAll, like } }],
    });

    return TestBed.inject(BlogStateService);
  }

  beforeEach(() => {
    localStorage.clear();
    getAll.mockReset().mockResolvedValue(RESPONSE);
    like.mockReset().mockResolvedValue(undefined);
  });

  it('startet leer und ohne Fehler', () => {
    const store = createStore();

    expect(store.blogs()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.blogCount()).toBe(0);
  });

  it('loadBlogs() füllt die Blogs und schaltet loading wieder ab', async () => {
    const store = createStore();

    await store.loadBlogs();

    expect(store.blogs()).toEqual(RESPONSE.data);
    expect(store.blogCount()).toBe(3);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('loadBlogs() setzt loading, solange das Backend antwortet', async () => {
    const store = createStore();
    getAll.mockReturnValue(new Promise(() => undefined));

    void store.loadBlogs();

    expect(store.loading()).toBe(true);
  });

  it('loadBlogs() setzt error, wenn das Backend scheitert', async () => {
    const store = createStore();
    getAll.mockRejectedValue(new Error('offline'));

    await store.loadBlogs();

    expect(store.error()).toBeTruthy();
    expect(store.loading()).toBe(false);
  });

  it('filteredBlogs() filtert nach dem gewählten Autor', async () => {
    const store = createStore();
    await store.loadBlogs();

    expect(store.filteredBlogs()).toHaveLength(3);
    expect(store.authors()).toEqual(['Jonas Müller', 'Maria Keller']);

    store.setAuthor('Maria Keller');

    expect(store.filteredBlogs().map((entry) => entry.id)).toEqual([1, 3]);

    store.setAuthor(ALL_AUTHORS);

    expect(store.filteredBlogs()).toHaveLength(3);
  });

  it('merkt sich den gewählten Autor über den effect im localStorage', () => {
    const store = createStore();

    store.setAuthor('Maria Keller');
    TestBed.tick(); // effect läuft erst mit der nächsten Change Detection

    expect(localStorage.getItem('blog.selectedAuthor')).toBe('Maria Keller');
  });

  it('liest den gespeicherten Autor beim Start wieder ein', () => {
    localStorage.setItem('blog.selectedAuthor', 'Jonas Müller');

    expect(createStore().selectedAuthor()).toBe('Jonas Müller');
  });

  it('like() aktualisiert den State sofort und meldet ihn ans Backend', async () => {
    const store = createStore();
    await store.loadBlogs();

    await store.like(1);

    expect(like).toHaveBeenCalledWith(1);
    expect(store.blogs()[0]).toMatchObject({ likedByMe: true, likes: 1 });
  });

  it('like() nimmt die Änderung bei einem Backend-Fehler zurück', async () => {
    const store = createStore();
    await store.loadBlogs();
    like.mockRejectedValue(new Error('offline'));

    await store.like(1);

    expect(store.blogs()[0]).toMatchObject({ likedByMe: false, likes: 0 });
    expect(store.error()).toBeTruthy();
  });
});
