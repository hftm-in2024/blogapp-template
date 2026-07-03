import { Component, inject, input } from '@angular/core';

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
  blogs = input.required<Blog[]>();

  /**
   * Reagiert auf das `liked`-Event einer BlogCard und togglet den Like-Status
   * sowie die Like-Anzahl des betroffenen Posts.
   */
  onLiked(id: number): void {
    this.#blogService.like(id);
  }
}
