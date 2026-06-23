import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Blog } from '../models/blog';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.scss',
})
export class BlogCardComponent {
  model = input.required<Blog>();

  likedByMe = output<number>();

  onLike(): void {
    this.likedByMe.emit(this.model().id);
  }
}
