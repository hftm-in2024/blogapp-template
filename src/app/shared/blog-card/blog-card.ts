import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Blog } from './blog.model';

@Component({
  selector: 'app-blog-card',
  imports: [DatePipe, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCard {
  /** Pflicht-Input: das anzuzeigende Blog-Objekt (Signal-basiert). */
  readonly model = input.required<Blog>();

  /**
   * Die API liefert nur bei wenigen Posts ein Header-Bild. Damit das Raster nicht
   * halb leer wirkt, gibt es ein stabiles Platzhalter-Bild pro Blog-ID.
   */
  protected readonly imageUrl = computed(
    () => this.model().headerImageUrl || `https://picsum.photos/seed/${this.model().id}/600/400`,
  );

  /** Wird beim Klick auf den Like-Button emittiert und sendet die Blog-ID. */
  readonly liked = output<number>();

  /** Klick-Handler für den Like-Button: meldet die ID ans Parent. */
  onLike(): void {
    this.liked.emit(this.model().id);
  }
}
