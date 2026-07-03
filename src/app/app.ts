import { Component, signal, effect, inject, DOCUMENT } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatIconButton,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'HFTM Web Applications (IN353)';
  private readonly doc = inject(DOCUMENT);

  protected isDarkMode = signal(this.getInitialTheme());

  constructor() {
    effect(() => {
      const dark = this.isDarkMode();
      this.doc.documentElement.classList.toggle('dark-theme', dark);
      // Aufgabe 5: light-theme class verhindert, dass prefers-color-scheme den manuellen Light-Toggle überschreibt
      this.doc.documentElement.classList.toggle('light-theme', !dark);
      // Aufgabe 5: Theme-Persistierung
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    });
  }

  protected toggleTheme(): void {
    this.isDarkMode.update((v) => !v);
  }

  // Aufgabe 5: Init-Logik — localStorage hat Vorrang, sonst OS-Einstellung
  private getInitialTheme(): boolean {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
