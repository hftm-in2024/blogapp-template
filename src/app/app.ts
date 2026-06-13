import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BlogCard } from './blog-card/blog-card';
import { Blog } from './models/blog.model';
import blogData from './data/blogs.json';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, BlogCard],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  blogs: Blog[] = blogData as Blog[];
  protected readonly title = 'HFTM Web Applications (IN353)';
}
