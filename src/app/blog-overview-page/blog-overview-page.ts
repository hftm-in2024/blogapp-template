import { Component, inject } from '@angular/core';
import { BlogCardComponent } from '../blog-card/blog-card';
import { BlogService } from '../shared/blog';
import { Blog } from '../models/blog';

@Component({
  selector: 'app-blog-overview-page',
  standalone: true,
  imports: [BlogCardComponent],
  templateUrl: './blog-overview-page.html',
  styleUrl: './blog-overview-page.scss',
})
export class BlogOverviewPageComponent {
  private blogService = inject(BlogService);

  blogs: Blog[] = this.blogService.getAll();

  toggleLike(blogId: number): void {
    this.blogs = this.blogs.map((blog) => {
      if (blog.id !== blogId) {
        return blog;
      }

      const wasLiked = blog.likedByMe === true;
      const likedByMe = !wasLiked;

      return {
        ...blog,
        likedByMe,
        likes: likedByMe ? blog.likes + 1 : blog.likes - 1,
      };
    });
  }
}
