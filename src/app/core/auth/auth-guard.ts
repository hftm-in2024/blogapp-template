import { CanMatchFn, Router, UrlSegment } from '@angular/router';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthStore } from './auth-store';

export const authGuard: CanMatchFn = async (_route, segments: UrlSegment[]) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!environment.authEnabled) {
    return router.createUrlTree(['/']);
  }

  await authStore.ready;

  if (authStore.isAuthenticated() && authStore.roles()?.includes('user')) {
    return true;
  }

  const returnUrl = '/' + segments.map((s) => s.path).join('/');
  return router.createUrlTree(['/login'], { queryParams: { returnUrl } });
};
