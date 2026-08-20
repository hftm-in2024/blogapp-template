import { Injectable, computed, signal } from '@angular/core';

import { environment } from '../../environments/environment';

export interface UserInfo {
  preferred_username: string;
  email: string;
  name: string;
  roles: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
};

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  readonly #state = signal<AuthState>(initialState);

  readonly ready: Promise<void>;

  readonly isAuthenticated = computed(() => this.#state().isAuthenticated);
  readonly user = computed(() => this.#state().user);
  readonly loading = computed(() => this.#state().loading);
  readonly roles = computed(() => this.#state().user?.roles ?? []);

  constructor() {
    this.ready = this.checkSession();
  }

  async checkSession(): Promise<void> {
    if (!environment.authEnabled) {
      this.#state.set({
        ...initialState,
        loading: false,
      });
      return;
    }

    try {
      const response = await fetch(`${environment.bffUrl}/auth/me`, {
        credentials: 'include',
      });

      const data = await response.json();

      this.#state.set({
        isAuthenticated: data.isAuthenticated,
        user: data.user,
        loading: false,
      });
    } catch {
      this.#state.set({
        ...initialState,
        loading: false,
      });
    }
  }

  async logout(): Promise<void> {
    try {
      const response = await fetch(`${environment.bffUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const { logoutUrl } = await response.json();

      window.location.href = logoutUrl;
    } catch {
      window.location.href = '/';
    }
  }
}
