import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthStore } from '../../core/auth/auth-store';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconButton,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly title = input('');
  readonly isDarkMode = input(false);
  /** true unter 768px: Hamburger statt Navigationslinks. */
  readonly isMobile = input(false);
  readonly themeToggle = output<void>();
  readonly menuToggle = output<void>();

  protected readonly authEnabled = environment.authEnabled;
  protected readonly authStore = inject(AuthStore);

  /**
   * Anzeigename: `name` ist optional, dann muss der Benutzername reichen. Bei
   * einer E-Mail als Benutzername zeigen wir nur den Teil vor dem @.
   */
  protected readonly displayName = computed(() => {
    const user = this.authStore.userData();
    return user?.name || user?.preferred_username?.split('@')[0] || '';
  });

  /** Tooltip des Avatars, zeigt den vollen Benutzernamen inklusive Domain. */
  protected readonly loggedInHint = computed(() => {
    const user = this.authStore.userData();
    return `Du bist angemeldet als ${user?.preferred_username || this.displayName()}`;
  });

  /**
   * Initialen für das Avatar-Badge: „John Doe" ergibt „JD", „student" ergibt „ST".
   * Getrennt wird an Leerzeichen, Punkt, Unterstrich und Bindestrich.
   */
  protected readonly initials = computed(() => {
    const parts = this.displayName()
      .split(/[\s._-]+/)
      .filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return parts
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  });

  protected async logout(): Promise<void> {
    // Navigates away to Keycloak's end-session endpoint, so no router call here.
    await this.authStore.logout();
  }
}
