import { Component, inject } from '@angular/core';

import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';
import { BlogService } from '../../shared/blog.service';

@Component({
  selector: 'app-blog-overview-page',
  imports: [BlogCardComponent],
  templateUrl: './blog-overview-page.component.html',
  styleUrl: './blog-overview-page.component.scss',
})
export class BlogOverviewPageComponent {
  private readonly blogService = inject(BlogService);

  blogs = this.blogService.getAll();

  onBlogLiked(blogId: number): void {
    this.blogService.toggleLike(blogId);
  }
}
