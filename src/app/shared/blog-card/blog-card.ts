import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Blog } from './blog.model';

@Component({
  selector: 'app-blog-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.scss',
})
export class BlogCard {
  /** Pflicht-Input: das anzuzeigende Blog-Objekt (Signal-basiert). */
  readonly model = input.required<Blog>();

  /** Wird beim Klick auf den Like-Button emittiert und sendet die Blog-ID. */
  readonly liked = output<number>();

  /** Klick-Handler für den Like-Button: meldet die ID ans Parent. */
  onLike(): void {
    this.liked.emit(this.model().id);
  }
}
