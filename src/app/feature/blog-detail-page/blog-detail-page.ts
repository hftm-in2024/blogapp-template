import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BlogDetail } from '../../shared/blog-card/blog.model';

@Component({
  selector: 'app-blog-detail-page',
  imports: [DatePipe, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './blog-detail-page.html',
  styleUrl: './blog-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailPage {
  /** Route-Parameter `:id`, dank `withComponentInputBinding()` automatisch gebunden. */
  readonly id = input.required<string>();

  /** Vom `blogResolver` vorgeladener Blog-Post, ebenfalls automatisch als Input gebunden. */
  readonly blog = input<BlogDetail>();
}
