import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthStore } from '../../core/auth/auth-store';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly title = input('');

  protected readonly authStore = inject(AuthStore);
  readonly #router = inject(Router);

  protected loginHref(): string {
    const returnUrl = encodeURIComponent(this.#router.url);
    return `/login?returnUrl=${returnUrl}`;
  }

  protected async logout(): Promise<void> {
    // Navigates away to Keycloak's end-session endpoint, so no router call here.
    await this.authStore.logout();
  }
}
