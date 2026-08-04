import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Blog } from '../blog/blog';
import { BlogService } from '../blog/blog.service';

@Component({
  selector: 'app-blog-detail-page',
  imports: [MatButtonModule, MatCardModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './blog-detail-page.html',
  styleUrl: './blog-detail-page.scss',
})
export class BlogDetailPage implements OnInit {
  private readonly blogService = inject(BlogService);

  id = input.required<string>();
  blog = signal<Blog | undefined>(undefined);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    void this.loadBlog();
  }

  private async loadBlog(): Promise<void> {
    const blogId = Number(this.id());

    if (Number.isNaN(blogId)) {
      this.error.set('Ungueltige Blog-ID.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      this.blog.set(await this.blogService.getById(blogId));
    } catch {
      this.error.set('Blog-Post konnte nicht geladen werden.');
    } finally {
      this.loading.set(false);
    }
  }
}
