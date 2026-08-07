import { Component, OnInit, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BlogCard } from '../../shared/blog-card/blog-card';
import { ALL_AUTHORS, BlogStateService } from './state/blog-state.service';

@Component({
  selector: 'app-blog-overview-page',
  imports: [BlogCard, MatProgressSpinnerModule],
  templateUrl: './blog-overview-page.html',
  styleUrl: './blog-overview-page.scss',
})
export class BlogOverviewPage implements OnInit {
  /** Einziger Datenzugang der Komponente: der zentrale State Store. */
  protected readonly state = inject(BlogStateService);

  protected readonly allAuthors = ALL_AUTHORS;

  ngOnInit(): void {
    void this.state.loadBlogs();
  }

  /** Reagiert auf das `liked`-Event einer BlogCard. */
  onLiked(id: number): void {
    void this.state.like(id);
  }

  /** Reagiert auf die Auswahl im Autoren-Filter. */
  onAuthorChange(event: Event): void {
    this.state.setAuthor((event.target as HTMLSelectElement).value);
  }
}
