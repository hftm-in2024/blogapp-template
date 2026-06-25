import { Component, inject } from '@angular/core';
import { BlogCard } from '../../blog-card/blog-card';
import { BlogService } from '../../shared/blog';

@Component({
  selector: 'app-blog-overview-page',
  imports: [BlogCard],
  templateUrl: './blog-overview-page.html',
  styleUrl: './blog-overview-page.scss',
})
export class BlogOverviewPage {
  private blogService = inject(BlogService);

  blogs = this.blogService.getAll();

  toggleLike(id: number) {
    const blog = this.blogs.find((blog) => blog.id === id);

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
