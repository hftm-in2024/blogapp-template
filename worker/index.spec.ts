import { sign } from 'hono/jwt';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import app, { safeReturnUrl } from './index';

const ISSUER = 'https://idp.test/realms/blog';
const env = {
  OIDC_ISSUER: ISSUER,
  OIDC_CLIENT_ID: 'bff',
  OIDC_CLIENT_SECRET: 'secret',
  OIDC_AUTH_SECRET: 'x'.repeat(32),
  OIDC_SCOPES: 'openid',
  OIDC_REDIRECT_URI: '/api/auth/callback',
  BACKEND_API_URL: 'https://backend.test',
};

const now = () => Math.floor(Date.now() / 1000);
const accessToken = (roles: string[]) => sign({ realm_access: { roles } }, 'idp-key');

async function sessionCookie(session: object): Promise<string> {
  const jwt = await sign(
    { sub: 'u1', rtk: 'rt-old', rtkexp: now() + 60, ssnexp: now() + 3600, ...session },
    env.OIDC_AUTH_SECRET,
    'HS256',
  );
  return `oidc-auth=${jwt}`;
}

const json = (body: object, headers: Record<string, string> = {}): RequestInit => ({
  method: 'POST',
  headers: { 'content-type': 'application/json', ...headers },
  body: JSON.stringify(body),
});

/** Ersetzt fetch durch einen Fake für Identity Provider und Backend. */
function fakeNetwork(tokenResponse: object = {}) {
  const backendCalls: Request[] = [];
  vi.stubGlobal('fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init);
    if (request.url === `${ISSUER}/.well-known/openid-configuration`) {
      return Response.json({
        issuer: ISSUER,
        authorization_endpoint: `${ISSUER}/auth`,
        token_endpoint: `${ISSUER}/token`,
        end_session_endpoint: `${ISSUER}/logout`,
        scopes_supported: ['openid'],
      });
    }
    if (request.url === `${ISSUER}/token`) {
      return Response.json({ token_type: 'bearer', ...tokenResponse });
    }
    backendCalls.push(request);
    return Response.json([{ id: 1 }]);
  });
  return backendCalls;
}

// Unter Node liest @hono/oidc-auth seine Konfiguration aus process.env, auf Workers aus c.env.
beforeEach(() => Object.entries(env).forEach(([key, value]) => vi.stubEnv(key, value)));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('BFF', () => {
  it('reports anonymous users without redirecting', async () => {
    const res = await app.request('/api/auth/me', {}, env);
    expect(await res.json()).toEqual({ isAuthenticated: false, user: null });
  });

  it('starts the authorization code flow with PKCE', async () => {
    fakeNetwork();
    const res = await app.request('https://app.test/api/auth/login?returnUrl=/add-blog', {}, env);
    const location = new URL(res.headers.get('location')!);
    expect(location.origin + location.pathname).toBe(`${ISSUER}/auth`);
    expect(location.searchParams.get('redirect_uri')).toBe('https://app.test/api/auth/callback');
    expect(location.searchParams.get('code_challenge_method')).toBe('S256');
  });

  it('rejects return URLs outside the app', () => {
    expect(safeReturnUrl('/add-blog')).toBe('/add-blog');
    expect(safeReturnUrl('https://evil.example')).toBe('/');
    expect(safeReturnUrl('//evil.example')).toBe('/');
    expect(safeReturnUrl(undefined)).toBe('/');
  });

  it('rejects writes without a session and lets anonymous reads through', async () => {
    const backendCalls = fakeNetwork();
    const write = await app.request('/api/entries', json({ title: 'x' }), env);
    expect(write.status).toBe(401);
    expect(backendCalls).toHaveLength(0);

    vi.unstubAllEnvs(); // anonymes Lesen braucht keine OIDC-Konfiguration
    const read = await app.request('/api/entries?page=2', {}, env);
    expect(read.status).toBe(200);
    expect(backendCalls[0].url).toBe('https://backend.test/entries?page=2');
    expect(backendCalls[0].headers.has('authorization')).toBe(false);
  });

  it('forwards the access token but not the session cookie', async () => {
    const backendCalls = fakeNetwork();
    const cookie = await sessionCookie({ atk: 'at-1', roles: ['user'] });
    await app.request('/api/entries', json({ title: 'x' }, { cookie }), env);
    expect(backendCalls[0].headers.get('authorization')).toBe('Bearer at-1');
    expect(backendCalls[0].headers.has('cookie')).toBe(false);
  });

  it('refreshes an expired access token and stores the new session', async () => {
    const fresh = await accessToken(['user', 'admin']);
    const backendCalls = fakeNetwork({ access_token: fresh, refresh_token: 'rt-new' });
    const cookie = await sessionCookie({ atk: 'at-old', rtkexp: now() - 1 });

    const res = await app.request('/api/entries', { headers: { cookie } }, env);

    expect(backendCalls[0].headers.get('authorization')).toBe(`Bearer ${fresh}`);
    expect(res.headers.get('set-cookie')).toContain('oidc-auth=');
    expect(res.headers.get('set-cookie')).toContain('HttpOnly');
  });

  it('returns the provider logout URL and clears the session', async () => {
    fakeNetwork();
    const cookie = await sessionCookie({ atk: 'at-1', rtk: '' });
    const res = await app.request(
      'https://app.test/api/auth/logout',
      { method: 'POST', headers: { cookie, 'sec-fetch-site': 'same-origin' } },
      env,
    );
    const { logoutUrl } = (await res.json()) as { logoutUrl: string };
    expect(logoutUrl).toBe(
      `${ISSUER}/logout?client_id=bff&post_logout_redirect_uri=https%3A%2F%2Fapp.test%2F`,
    );
    expect(res.headers.get('set-cookie')).toContain('oidc-auth=;');
  });

  it('blocks cross-site form posts', async () => {
    const res = await app.request(
      'https://app.test/api/auth/logout',
      { method: 'POST', headers: { origin: 'https://evil.example' } },
      env,
    );
    expect(res.status).toBe(403);
  });
});
