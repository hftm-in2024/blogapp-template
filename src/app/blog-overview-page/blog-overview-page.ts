import { Component, inject, OnInit } from '@angular/core';
import { BlogCardComponent } from '../blog-card/blog-card';
import { BlogStateService } from '../services/blog-state';

@Component({
  selector: 'app-blog-overview-page',
  standalone: true,
  imports: [BlogCardComponent],
  templateUrl: './blog-overview-page.html',
  styleUrl: './blog-overview-page.scss',
})
export class BlogOverviewPageComponent implements OnInit {
  readonly state = inject(BlogStateService);

  ngOnInit(): void {
    void this.state.loadBlogs();
  }

  onAuthorChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.state.setAuthor(select.value);
  }
}
