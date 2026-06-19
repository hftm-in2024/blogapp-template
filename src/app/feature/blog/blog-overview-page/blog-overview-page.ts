import { Component, inject, signal } from '@angular/core';

import { BlogCard } from '../../../shared/blog-card/blog-card';
import { Blog } from '../../../shared/blog-card/blog.model';
import { BlogService } from '../../../shared/blog.service';

@Component({
  selector: 'app-blog-overview-page',
  imports: [BlogCard],
  templateUrl: './blog-overview-page.html',
  styleUrl: './blog-overview-page.scss',
})
export class BlogOverviewPage {
  private readonly blogService = inject(BlogService);

  /** Blog-Daten aus dem BlogService. */
  protected readonly blogs = signal<Blog[]>(this.blogService.getAll());

  /**
   * Reagiert auf das `liked`-Event einer BlogCard und togglet den Like-Status
   * sowie die Like-Anzahl des betroffenen Posts.
   */
  onLiked(id: number): void {
    this.blogs.update((blogs) =>
      blogs.map((blog) =>
        blog.id === id
          ? {
              ...blog,
              likedByMe: !blog.likedByMe,
              likes: blog.likedByMe ? blog.likes - 1 : blog.likes + 1,
            }
          : blog,
      ),
    );
  }
}
