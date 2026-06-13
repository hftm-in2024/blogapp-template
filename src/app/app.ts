import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BlogCard } from './blog-card/blog-card';
import blogsData from './data/blogs.json';
import { Blog } from './models/blog.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, BlogCard],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  blogs: Blog[] = blogsData as Blog[];

  protected readonly title = 'HFTM Web Applications (IN353)';

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
