import { Component } from '@angular/core';
import { BlogCardComponent } from '../blog-card/blog-card';
import { Blog } from '../models/blog';
import blogData from '../data/blogs.json';

@Component({
  selector: 'app-blog-overview-page',
  standalone: true,
  imports: [BlogCardComponent],
  templateUrl: './blog-overview-page.html',
  styleUrl: './blog-overview-page.scss',
})
export class BlogOverviewPageComponent {
  blogs: Blog[] = blogData as Blog[];

  toggleLike(blogId: number): void {
    this.blogs = this.blogs.map((blog) => {
      if (blog.id !== blogId) {
        return blog;
      }

      const liked = !blog.likedByMe;

      return {
        ...blog,
        likedByMe: liked,
        likes: liked ? blog.likes + 1 : blog.likes - 1,
      };
    });
  }
}
