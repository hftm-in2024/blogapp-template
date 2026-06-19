import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BlogOverviewPage } from './feature/blog/blog-overview-page/blog-overview-page';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, BlogOverviewPage],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'HFTM Web Applications (IN353)';
}
