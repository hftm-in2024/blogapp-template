import { app, Cookie, HttpRequest, HttpResponseInit } from '@azure/functions';
import {
  parseSessionCookie,
  unsealSession,
  isSessionExpired,
  sealSession,
  sessionCookies,
  sessionFromTokens,
  clearSessionCookies,
} from '../lib/session.js';
import { refreshTokens } from '../lib/keycloak.js';
import { corsHeaders, handlePreflight } from '../lib/cors.js';
import { decodeJwt } from 'jose';

/**
 * Identity claims come from the ID token: Keycloak puts `name` and `email` there
 * by default, while the access token only carries them with extra mappers.
 * Roles stay in the access token, that is where `realm_access` lives.
 */
function userFromTokens(accessToken: string, idToken: string) {
  const identity = decodeJwt(idToken) as Record<string, unknown>;
  const access = decodeJwt(accessToken) as Record<string, unknown>;
  const realmAccess = access.realm_access as { roles: string[] } | undefined;
  const username = identity.preferred_username ?? access.preferred_username;

  return {
    preferred_username: username,
    email: identity.email ?? access.email,
    name: identity.name ?? access.name ?? username,
    roles: realmAccess?.roles ?? [],
  };
}

async function authMe(request: HttpRequest): Promise<HttpResponseInit> {
  const preflight = handlePreflight(request);
  if (preflight) return preflight;

  const cookieHeader = request.headers.get('cookie');
  const sealed = parseSessionCookie(cookieHeader);

  if (!sealed) {
    return {
      status: 200,
      jsonBody: { isAuthenticated: false, user: null },
      headers: corsHeaders,
    };
  }

  let session = await unsealSession(sealed);
  if (!session) {
    return {
      status: 200,
      jsonBody: { isAuthenticated: false, user: null },
      headers: corsHeaders,
      cookies: clearSessionCookies(cookieHeader),
    };
  }

  const extraCookies: Cookie[] = [];

  if (isSessionExpired(session)) {
    try {
      const tokens = await refreshTokens(session.refreshToken);
      session = sessionFromTokens(tokens);
      extraCookies.push(...sessionCookies(await sealSession(session), cookieHeader));
    } catch {
      // Keycloak's SSO Session Idle/Max has run out — the session is genuinely over.
      return {
        status: 200,
        jsonBody: { isAuthenticated: false, user: null },
        headers: corsHeaders,
        cookies: clearSessionCookies(cookieHeader),
      };
    }
  }

  return {
    status: 200,
    jsonBody: { isAuthenticated: true, user: userFromTokens(session.accessToken, session.idToken) },
    headers: corsHeaders,
    cookies: extraCookies.length > 0 ? extraCookies : undefined,
  };
}

app.http('auth-me', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/me',
  handler: authMe,
});
