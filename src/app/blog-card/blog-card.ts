import { Component, input } from '@angular/core';
import { Blog } from '../models/blog.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-blog-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.scss',
})
export class BlogCard {
  readonly blog = input.required<Blog>();
}
