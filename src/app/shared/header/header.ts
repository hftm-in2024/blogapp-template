import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
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
  readonly themeToggle = output<void>();

  protected readonly authEnabled = environment.authEnabled;
  protected readonly authStore = inject(AuthStore);

  protected async logout(): Promise<void> {
    // Navigates away to Keycloak's end-session endpoint, so no router call here.
    await this.authStore.logout();
  }
}
