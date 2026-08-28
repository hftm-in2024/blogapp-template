import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Blog } from '../../core/utils/blog-model';

@Component({
  selector: 'app-blog-detail-page',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './blog-detail-page.html',
  styleUrl: './blog-detail-page.scss',
})
export class BlogDetailPage {
  private route = inject(ActivatedRoute);

  blog = this.route.snapshot.data['blog'] as Blog;

  toggleLike(): void {
    this.blog.likedByMe = !this.blog.likedByMe;

    if (this.blog.likedByMe) {
      this.blog.likes++;
    } else {
      this.blog.likes--;
    }
  }
}
