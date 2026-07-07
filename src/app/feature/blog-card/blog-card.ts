import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Blog } from '../../core/utils/blog-model';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.scss',
})
export class BlogCardComponent {
  model = input.required<Blog>();

  likeClicked = output<number>();

  onLikeClick(event: Event): void {
    event.stopPropagation();
    this.likeClicked.emit(this.model().id);
  }
}
