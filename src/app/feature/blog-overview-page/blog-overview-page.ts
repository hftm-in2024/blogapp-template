import { Component, OnInit, inject, signal } from '@angular/core';

import { Blog } from '../../core/utils/blog-model';
import { BlogCardComponent } from '../blog-card/blog-card';
import { BlogService } from '../../shared/blog';

@Component({
  selector: 'app-blog-overview-page',
  standalone: true,
  imports: [BlogCardComponent],
  templateUrl: './blog-overview-page.html',
  styleUrl: './blog-overview-page.scss',
})
export class BlogOverviewPage implements OnInit {
  private blogService = inject(BlogService);

  blogs = signal<Blog[]>([]);

  async ngOnInit(): Promise<void> {
    const blogs = await this.blogService.getAll();
    this.blogs.set(blogs);
  }

  toggleLike(blogId: number): void {
    this.blogs.update((blogs) =>
      blogs.map((blog) => {
        if (blog.id !== blogId) {
          return blog;
        }

        return {
          ...blog,
          likedByMe: !blog.likedByMe,
          likes: blog.likedByMe ? blog.likes - 1 : blog.likes + 1,
        };
      }),
    );
  }
}
