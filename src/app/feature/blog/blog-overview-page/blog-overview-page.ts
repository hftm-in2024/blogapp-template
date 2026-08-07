import { Component, inject, signal } from '@angular/core';

import { BlogCard } from '../../../shared/blog-card/blog-card';
import { BlogService } from '../blog.service';
import { Blog } from '../../../shared/blog-card/blog.model';

@Component({
  selector: 'app-blog-overview-page',
  imports: [BlogCard],
  templateUrl: './blog-overview-page.html',
  styleUrl: './blog-overview-page.scss',
})
export class BlogOverviewPage {
  readonly #blogService = inject(BlogService);

  /** Blog-Daten aus dem BlogService. */
  readonly blogs = signal<Blog[]>([]);

  /** True, solange ein API-Call läuft. */
  readonly loading = signal(false);

  /** Fehlermeldung eines fehlgeschlagenen API-Calls, sonst `null`. */
  readonly error = signal<string | null>(null);

  constructor() {
    this.reload();
  }

  /** Lädt die Blog-Liste und schaltet dabei den Loading-State. */
  async reload(): Promise<void> {
    this.loading.set(true);
    try {
      this.blogs.set(await this.#blogService.getAll());
    } finally {
      this.loading.set(false);
    }
  }

  /** Reagiert auf das `liked`-Event einer BlogCard. */
  async onLiked(id: number): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.#blogService.like(id);
      await this.reload();
    } catch (err) {
      console.error(err);
      this.error.set('Aktion fehlgeschlagen — Backend nicht erreichbar oder nicht angemeldet.');
    } finally {
      this.loading.set(false);
    }
  }
}
