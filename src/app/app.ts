import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'HFTM Web Applications (IN353)';
  protected readonly isDarkTheme = signal(false);

  private readonly document = inject(DOCUMENT);

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark =
      typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;

    this.setTheme(savedTheme ? savedTheme === 'dark' : prefersDark);
  }

  protected toggleTheme(): void {
    this.setTheme(!this.isDarkTheme());
  }

  private setTheme(isDark: boolean): void {
    this.isDarkTheme.set(isDark);
    this.document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}
