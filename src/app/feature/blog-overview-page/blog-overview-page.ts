import { Component, OnInit, inject } from '@angular/core';

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

  blogs: Blog[] = [];

  async ngOnInit(): Promise<void> {
    this.blogs = await this.blogService.getAll();
  }

  toggleLike(blogId: number): void {
    const blog = this.blogs.find((b) => b.id === blogId);

    if (!blog) {
      return;
    }

    blog.likedByMe = !blog.likedByMe;

    if (blog.likedByMe) {
      blog.likes++;
    } else {
      blog.likes--;
    }
  }
}
