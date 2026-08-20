import { Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { AuthStore } from '../../core/auth.store';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  readonly returnUrl = input('/');
  readonly error = input<string | undefined>();

  readonly username = signal('');
  readonly password = signal('');
  readonly loginError = signal('');

  setUsername(value: string): void {
    this.username.set(value);
  }

  setPassword(value: string): void {
    this.password.set(value);
  }

  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  readonly errorMessage = computed(() => {
    switch (this.error()) {
      case 'access_denied':
        return 'Access denied.';
      case 'expired':
        return 'Your session has expired.';
      case 'failed':
        return 'Login failed.';
      default:
        return this.loginError();
    }
  });

  async login(): Promise<void> {
    this.loginError.set('');

    try {
      const response = await fetch(`${environment.bffUrl}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          username: this.username(),
          password: this.password(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        this.loginError.set(data.error ?? 'Login failed.');
        return;
      }

      await this.authStore.checkSession();

      await this.router.navigateByUrl(this.returnUrl());
    } catch {
      this.loginError.set('Could not connect to the server.');
    }
  }
}
