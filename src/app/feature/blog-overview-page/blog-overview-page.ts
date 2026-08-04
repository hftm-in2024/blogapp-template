import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Blog } from '../blog/blog';
import { BlogService } from '../blog/blog.service';
import { BlogCard } from '../blog/components/blog-card/blog-card';

@Component({
  selector: 'app-blog-overview-page',
  imports: [
    BlogCard,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './blog-overview-page.html',
  styleUrl: './blog-overview-page.scss',
})
export class BlogOverviewPage implements OnInit {
  private readonly blogService = inject(BlogService);

  blogs = signal<Blog[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  editingBlogId = signal<number | null>(null);

  protected title = '';
  protected author = 'student@hftm.ch';
  protected content = '';
  protected headerImageUrl = '';

  ngOnInit(): void {
    void this.loadBlogs();
  }

  async loadBlogs(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      this.blogs.set(await this.blogService.getBlogs());
    } catch {
      this.error.set('Blog-Daten konnten nicht geladen werden.');
      this.blogs.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  async saveBlog(): Promise<void> {
    if (!this.canSave()) {
      return;
    }

    const blog = this.createBlogFromForm();
    const editingBlogId = this.editingBlogId();

    this.loading.set(true);
    this.error.set(null);

    try {
      if (editingBlogId === null) {
        await this.blogService.createBlog(blog);
      } else {
        await this.blogService.updateBlog(String(editingBlogId), blog);
      }

      this.resetForm();
      await this.loadBlogs();
    } catch {
      this.error.set('Blog konnte nicht gespeichert werden.');
    } finally {
      this.loading.set(false);
    }
  }

  editBlog(blog: Blog): void {
    this.editingBlogId.set(blog.id);
    this.title = blog.title;
    this.author = blog.author;
    this.content = blog.content ?? blog.contentPreview;
    this.headerImageUrl = blog.headerImageUrl ?? '';
  }

  async deleteBlog(blogId: number): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      await this.blogService.deleteBlog(String(blogId));
      await this.loadBlogs();
    } catch {
      this.error.set('Blog konnte nicht geloescht werden.');
    } finally {
      this.loading.set(false);
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  toggleLike(blogId: number): void {
    this.blogs.update((blogs) =>
      blogs.map((blog) => {
        if (blog.id !== blogId) {
          return blog;
        }

        return {
          ...blog,
          likedByMe: !blog.likedByMe,
          likes: blog.likedByMe ? blog.likes - 1 : blog.likes + 1,
        };
      }),
    );
  }

  protected canSave(): boolean {
    return this.title.trim().length > 0 && this.content.trim().length > 0;
  }

  private createBlogFromForm(): Blog {
    const now = new Date().toISOString();
    const editingBlogId = this.editingBlogId();
    const existingBlog = this.blogs().find((blog) => blog.id === editingBlogId);
    const content = this.content.trim();

    return {
      id: editingBlogId ?? 0,
      title: this.title.trim(),
      contentPreview: content,
      content,
      author: this.author.trim() || 'student@hftm.ch',
      likes: existingBlog?.likes ?? 0,
      comments: existingBlog?.comments ?? 0,
      likedByMe: existingBlog?.likedByMe ?? false,
      createdByMe: existingBlog?.createdByMe ?? true,
      headerImageUrl: this.headerImageUrl.trim() || undefined,
      createdAt: existingBlog?.createdAt ?? now,
      updatedAt: now,
    };
  }

  private resetForm(): void {
    this.editingBlogId.set(null);
    this.title = '';
    this.author = 'student@hftm.ch';
    this.content = '';
    this.headerImageUrl = '';
  }
}
