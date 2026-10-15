import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { BlogService } from '../../shared/blog.service';

@Component({
  selector: 'app-blog-detail-page',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './blog-detail-page.component.html',
  styleUrl: './blog-detail-page.component.scss',
})
export class BlogDetailPageComponent {
  id = input.required<string>();

  private readonly blogService = inject(BlogService);

  blog = computed(() => this.blogService.getById(Number(this.id())));

  onLike(): void {
    const blog = this.blog();

    if (blog) {
      this.blogService.toggleLike(blog.id);
    }
  }
}
