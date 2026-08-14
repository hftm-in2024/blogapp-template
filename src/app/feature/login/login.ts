import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { environment } from '../../../environments/environment';

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: 'Sign-in was cancelled.',
  expired: 'The sign-in attempt expired. Please try again.',
  failed: 'Sign-in failed. Please try again.',
};

@Component({
  selector: 'app-login',
  template: `
    @if (errorMessage(); as message) {
      <div class="error-message" data-testid="login-error">{{ message }}</div>
    }
    <button type="button" data-testid="login-submit" (click)="signIn()">Sign in</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPage {
  // Bound from the query string via withComponentInputBinding().
  readonly returnUrl = input('/');
  readonly error = input<string | undefined>();

  protected readonly errorMessage = computed(() => {
    const error = this.error();
    if (!error) return null;
    return ERROR_MESSAGES[error] ?? ERROR_MESSAGES['failed'];
  });

  /**
   * Full navigation, not a fetch — the browser has to follow the BFF's redirect
   * to Keycloak and carry the `__pkce` cookie back to the callback.
   */
  signIn(): void {
    const returnUrl = encodeURIComponent(this.returnUrl());
    window.location.href = `${environment.bffUrl}/auth/login?returnUrl=${returnUrl}`;
  }
}
