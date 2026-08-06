import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';
import { Blog } from '../../shared/blog.model';
import { BlogService } from '../blog/blog.service';

@Component({
  selector: 'app-blog-overview',
  imports: [BlogCardComponent, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './blog-overview.component.html',
  styleUrl: './blog-overview.component.scss',
})
export class BlogOverviewComponent implements OnInit {
  private readonly blogService = inject(BlogService);

  readonly blogs = signal<Blog[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  async ngOnInit(): Promise<void> {
    await this.loadBlogs();
  }

  async loadBlogs(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      this.blogs.set(await this.blogService.getBlogs());
    } catch {
      this.errorMessage.set('Die Blog-Beiträge konnten nicht geladen werden.');
    } finally {
      this.loading.set(false);
    }
  }

  async createBlog(): Promise<void> {
    const title = prompt('Titel des neuen Blogs:');
    if (!title) return;

    const contentPreview = prompt('Vorschautext:');
    if (!contentPreview) return;

    const now = new Date().toISOString();
    const blog: Blog = {
      id: 0,
      title,
      contentPreview,
      author: 'Timo Buchser',
      likes: 0,
      comments: 0,
      likedByMe: false,
      createdByMe: true,
      createdAt: now,
      updatedAt: now,
    };

    await this.runMutation(async () => {
      const created = await this.blogService.createBlog(blog);
      this.blogs.update((blogs) => [created, ...blogs]);
    });
  }

  async editBlog(blog: Blog): Promise<void> {
    const title = prompt('Titel bearbeiten:', blog.title);
    if (!title) return;

    const contentPreview = prompt('Vorschautext bearbeiten:', blog.contentPreview);
    if (!contentPreview) return;

    const updatedBlog = { ...blog, title, contentPreview, updatedAt: new Date().toISOString() };

    await this.runMutation(async () => {
      const updated = await this.blogService.updateBlog(String(blog.id), updatedBlog);
      this.blogs.update((blogs) => blogs.map((item) => (item.id === updated.id ? updated : item)));
    });
  }

  async deleteBlog(id: number): Promise<void> {
    if (!confirm('Diesen Blog wirklich löschen?')) return;

    await this.runMutation(async () => {
      await this.blogService.deleteBlog(String(id));
      this.blogs.update((blogs) => blogs.filter((blog) => blog.id !== id));
    });
  }

  async onBlogLiked(blogId: number): Promise<void> {
    const blog = this.blogs().find((item) => item.id === blogId);
    if (!blog) return;

    const updatedBlog = {
      ...blog,
      likedByMe: !blog.likedByMe,
      likes: blog.likes + (blog.likedByMe ? -1 : 1),
      updatedAt: new Date().toISOString(),
    };

    await this.runMutation(async () => {
      const updated = await this.blogService.updateBlog(String(blog.id), updatedBlog);
      this.blogs.update((blogs) => blogs.map((item) => (item.id === updated.id ? updated : item)));
    });
  }

  private async runMutation(action: () => Promise<void>): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      await action();
    } catch {
      this.errorMessage.set('Die Änderung konnte nicht gespeichert werden.');
    } finally {
      this.loading.set(false);
    }
  }
}
