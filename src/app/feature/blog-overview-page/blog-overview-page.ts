import { Component, OnInit, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthStore } from '../../core/auth/auth-store';
import { environment } from '../../../environments/environment';
import { BlogCard } from '../../shared/blog-card/blog-card';
import { ALL_AUTHORS, BlogStateService } from './state/blog-state.service';

@Component({
  selector: 'app-blog-overview-page',
  imports: [BlogCard, MatProgressSpinnerModule, MatFormFieldModule, MatIconModule, MatSelectModule],
  templateUrl: './blog-overview-page.html',
  styleUrl: './blog-overview-page.scss',
})
export class BlogOverviewPage implements OnInit {
  /** Einziger Datenzugang der Komponente: der zentrale State Store. */
  protected readonly state = inject(BlogStateService);

  private readonly authStore = inject(AuthStore);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly allAuthors = ALL_AUTHORS;

  ngOnInit(): void {
    void this.state.loadBlogs();
  }

  /** Reagiert auf das `liked`-Event einer BlogCard. */
  onLiked(id: number): void {
    if (environment.authEnabled && !this.authStore.isAuthenticated()) {
      this.snackBar.open('Du kannst nur liken, wenn du eingeloggt bist.', 'OK', { duration: 4000 });
      return;
    }
    void this.state.like(id);
  }
}
