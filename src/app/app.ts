import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly storageKey = 'blogapp-theme';
  private readonly systemThemeQuery =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null;

  protected readonly title = "Fabio's Blog";
  protected readonly isDarkMode = signal(false);

  private usesStoredPreference = false;

  constructor() {
    const storedTheme = this.readThemePreference();
    this.usesStoredPreference = storedTheme !== null;

    const initialDarkMode =
      storedTheme === 'dark' || (storedTheme === null && this.systemThemeQuery?.matches === true);

    this.isDarkMode.set(initialDarkMode);
    this.applyTheme(initialDarkMode);

    if (!this.usesStoredPreference && this.systemThemeQuery) {
      const onSystemThemeChange = (event: MediaQueryListEvent) => {
        if (this.usesStoredPreference) {
          return;
        }

        this.isDarkMode.set(event.matches);
        this.applyTheme(event.matches);
      };

      this.systemThemeQuery.addEventListener('change', onSystemThemeChange);
      this.destroyRef.onDestroy(() => {
        this.systemThemeQuery?.removeEventListener('change', onSystemThemeChange);
      });
    }
  }

  protected toggleDarkMode() {
    const nextDarkMode = !this.isDarkMode();

    this.usesStoredPreference = true;
    this.isDarkMode.set(nextDarkMode);
    this.applyTheme(nextDarkMode);
    this.persistThemePreference(nextDarkMode ? 'dark' : 'light');
  }

  private applyTheme(isDarkMode: boolean) {
    this.document.documentElement.classList.toggle('dark-theme', isDarkMode);
    this.document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
  }

  private readThemePreference(): 'light' | 'dark' | null {
    try {
      const preference = localStorage.getItem(this.storageKey);

      return preference === 'light' || preference === 'dark' ? preference : null;
    } catch {
      return null;
    }
  }

  private persistThemePreference(preference: 'light' | 'dark') {
    try {
      localStorage.setItem(this.storageKey, preference);
    } catch {
      // Ignore storage failures and keep the in-memory theme state.
    }
  }
}
