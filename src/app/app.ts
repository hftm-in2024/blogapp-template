import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BlogOverviewPageComponent } from './blog-overview-page/blog-overview-page';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, BlogOverviewPageComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'Blog';
}
