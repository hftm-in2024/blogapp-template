import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthStore } from './core/auth.store';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'HFTM Web Applications (IN353)';

  readonly authStore = inject(AuthStore);

  readonly authEnabled = environment.authEnabled;

  isDarkMode = localStorage.getItem('theme') === 'dark';

  constructor() {
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;

    document.body.classList.toggle('dark-theme', this.isDarkMode);

    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  async logout(): Promise<void> {
    await this.authStore.logout();
  }
}
