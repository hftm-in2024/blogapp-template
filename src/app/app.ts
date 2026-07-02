import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIcon],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'blogapp-theme';
  protected readonly title = "Fabio's Blog";
  protected isDarkMode = false;

  constructor() {
    this.isDarkMode = this.readThemePreference() === 'dark';
    this.applyTheme();
  }

  protected toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    this.persistThemePreference();
  }

  private applyTheme() {
    this.document.documentElement.classList.toggle('dark-theme', this.isDarkMode);
    this.document.documentElement.style.colorScheme = this.isDarkMode ? 'dark' : 'light';
  }

  private readThemePreference(): 'light' | 'dark' | null {
    try {
      const preference = localStorage.getItem(this.storageKey);

      return preference === 'light' || preference === 'dark' ? preference : null;
    } catch {
      return null;
    }
  }

  private persistThemePreference() {
    try {
      localStorage.setItem(this.storageKey, this.isDarkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage failures.
    }
  }
}
