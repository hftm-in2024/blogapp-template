import {
  getAuth,
  getAuthorizationServer,
  oidcAuthMiddleware,
  processOAuthCallback,
  revokeSession,
  type OidcAuthEnv,
} from '@hono/oidc-auth';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { csrf } from 'hono/csrf';
import { decode } from 'hono/jwt';
import { proxy } from 'hono/proxy';

// Backend for Frontend: der Browser sieht nie ein Token, nur ein HttpOnly-Session-Cookie.
// OIDC-Protokoll (Discovery, PKCE, State, Nonce, Refresh, Revoke): @hono/oidc-auth.

type Bindings = OidcAuthEnv & { BACKEND_API_URL: string };

const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

app.use(csrf());

// Die Lib speichert nur sub/email. Für Proxy und /auth/me braucht die Session
// zusätzlich das Access Token und die Rollen (Keycloak: realm_access im Access Token).
app.use(async (c, next) => {
  c.set('oidcClaimsHook', async (orig, claims, tokens) => ({
    sub: claims?.sub ?? orig?.sub,
    email: (claims?.['email'] as string | undefined) ?? orig?.email,
    name: claims?.['name'] ?? orig?.['name'],
    preferred_username: claims?.['preferred_username'] ?? orig?.['preferred_username'],
    roles:
      (decode(tokens.access_token).payload['realm_access'] as { roles?: string[] })?.roles ?? [],
    atk: tokens.access_token,
  }));
  await next();
});

/** Nur Pfade der eigenen App sind gültige Ziele nach dem Login, alles andere wäre ein Open Redirect. */
export function safeReturnUrl(url: string | undefined): string {
  if (!url?.startsWith('/') || url.startsWith('//') || url.startsWith('/\\')) {
    return '/';
  }
  return url;
}

// 1. Login: ohne Session leitet die Middleware zum Identity Provider um.
//    Nach dem Callback landet der Browser wieder hier und wird zur returnUrl geschickt.
app.get('/auth/login', oidcAuthMiddleware(), (c) =>
  c.redirect(safeReturnUrl(c.req.query('returnUrl'))),
);

// 2. Callback: Authorization Code gegen Tokens tauschen, Session-Cookie setzen.
app.get('/auth/callback', async (c) => {
  try {
    return await processOAuthCallback(c);
  } catch {
    const error = c.req.query('error') === 'access_denied' ? 'access_denied' : 'failed';
    return c.redirect(`/login?error=${error}`);
  }
});

// 3. Wer bin ich? Antwortet auch anonym mit 200, damit die SPA den Zustand abfragen kann.
app.get('/auth/me', async (c) => {
  const auth = await getAuth(c);
  if (!auth) {
    return c.json({ isAuthenticated: false, user: null });
  }
  const { preferred_username, email, name, roles } = auth;
  return c.json({ isAuthenticated: true, user: { preferred_username, email, name, roles } });
});

// 4. Logout: Refresh Token widerrufen, Cookie löschen, Logout-URL des Providers zurückgeben.
app.post('/auth/logout', async (c) => {
  // Das Cookie ist auch dann gelöscht, wenn der Widerruf beim Provider fehlschlägt.
  await revokeSession(c).catch(() => undefined);
  const { end_session_endpoint } = await getAuthorizationServer(c);
  if (!end_session_endpoint) {
    return c.json({ logoutUrl: '/' });
  }
  const logoutUrl = new URL(end_session_endpoint);
  const appUrl = new URL('/', c.env.OIDC_AUTH_EXTERNAL_URL ?? c.req.url);
  logoutUrl.searchParams.set('client_id', c.env.OIDC_CLIENT_ID);
  logoutUrl.searchParams.set('post_logout_redirect_uri', appUrl.href);
  return c.json({ logoutUrl: logoutUrl.href });
});

// 5. Proxy: alle übrigen /api-Aufrufe gehen mit dem Access Token ans Backend.
app.all('/*', async (c) => {
  // Ohne Session-Cookie kein getAuth: anonymes Lesen funktioniert so auch ohne konfigurierte Secrets.
  const auth = getCookie(c, 'oidc-auth') ? await getAuth(c) : null;
  if (!auth && c.req.method !== 'GET') {
    return c.json({ error: 'unauthorized' }, 401);
  }
  const { pathname, search } = new URL(c.req.url);
  const backendResponse = await proxy(
    c.env.BACKEND_API_URL + pathname.replace(/^\/api/, '') + search,
    {
      raw: c.req.raw,
      headers: {
        ...c.req.header(),
        // Session-Cookie bleibt beim BFF, das Backend bekommt nur das Bearer Token.
        cookie: undefined,
        host: undefined,
        authorization: auth ? `Bearer ${auth['atk']}` : undefined,
      },
    },
  );
  // c.newResponse übernimmt ein bei einem Refresh neu gesetztes Session-Cookie.
  return c.newResponse(backendResponse.body, backendResponse);
});

export default app;
