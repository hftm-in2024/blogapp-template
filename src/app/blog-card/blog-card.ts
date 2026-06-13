import { Component, input, output } from '@angular/core';
import { Blog } from '../models/blog.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-blog-card',
  imports: [MatCardModule, MatButtonModule, MatIcon],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.scss',
})
export class BlogCard {
  readonly blog = input.required<Blog>();
  liked = output<number>();

  onLike() {
    this.liked.emit(this.blog().id);
  }
}
