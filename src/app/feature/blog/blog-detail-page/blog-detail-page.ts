import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BlogDetail } from '../../../shared/blog-card/blog.model';

@Component({
  selector: 'app-blog-detail-page',
  imports: [MatCardModule],
  templateUrl: './blog-detail-page.html',
  styleUrl: './blog-detail-page.scss',
})
export class BlogDetailPage {
  /** Route-Parameter `:id`, dank `withComponentInputBinding()` automatisch gebunden. */
  readonly id = input.required<string>();

  /** Vom `blogResolver` vorgeladener Blog-Post, ebenfalls automatisch als Input gebunden. */
  readonly blog = input<BlogDetail>();
}
