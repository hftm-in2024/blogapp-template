# Deployment auf Cloudflare Workers

Die App läuft als **ein** Cloudflare Worker: Er liefert den Angular-Build aus und beantwortet
unter `/api/*` die Aufrufe des BFF (`worker/index.ts`). Frontend und BFF haben dadurch
dieselbe Origin, CORS ist nicht nötig. Die Konfiguration steht in `wrangler.jsonc`.

Der Free-Plan von Cloudflare genügt.

## 1. Cloudflare-Konto und Zugangsdaten

1. Konto erstellen: <https://dash.cloudflare.com/sign-up>
2. **Account ID** notieren: Dashboard, Bereich _Workers & Pages_, rechte Spalte.
3. **API-Token** erstellen: _My Profile_, _API Tokens_, _Create Token_, Vorlage
   **Edit Cloudflare Workers**. Das Token wird nur einmal angezeigt.

## 2. Name des Workers

Trage in `wrangler.jsonc` unter `name` einen eigenen Namen ein, z.B. `blogapp-<dein-kuerzel>`.
Die App ist danach unter `https://<name>.<deine-subdomain>.workers.dev` erreichbar.

## 3. GitHub Secrets

Im eigenen Repository unter _Settings_, _Secrets and variables_, _Actions_:

| Secret                  | Wert                     |
| ----------------------- | ------------------------ |
| `CLOUDFLARE_API_TOKEN`  | Token aus Schritt 1      |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID aus Schritt 1 |

Ab jetzt deployt `.github/workflows/deploy.yml` bei jedem Push auf `main`.

## 4. Secrets des BFF

Zwei Werte dürfen nicht im Repository stehen und werden einmalig direkt bei Cloudflare
hinterlegt (vorher `pnpm exec wrangler login`):

```bash
pnpm exec wrangler secret put OIDC_CLIENT_SECRET   # Client-Secret, gibt der Dozent bekannt
pnpm exec wrangler secret put OIDC_AUTH_SECRET     # openssl rand -base64 32
```

Lokal stehen dieselben zwei Werte in `.dev.vars` (Vorlage: `.dev.vars.example`).

## 5. Redirect-URI in Keycloak

Der Login funktioniert nur von Origins, die im Keycloak-Client eingetragen sind.
Keycloak akzeptiert keine Wildcards im Hostnamen. Melde dem Dozenten deshalb deine URL:

- Valid redirect URI: `https://<name>.<deine-subdomain>.workers.dev/api/auth/callback`
- Valid post logout redirect URI: `https://<name>.<deine-subdomain>.workers.dev/`

Für `http://localhost:4200` ist der Client bereits eingerichtet.

## Manuell deployen

```bash
pnpm run deploy
```

## Fehlersuche

| Symptom                                              | Ursache                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| Keycloak: `Invalid parameter: redirect_uri`          | Deine URL ist im Keycloak-Client noch nicht registriert (Schritt 5).           |
| `500 Session secret is not provided`                 | `OIDC_AUTH_SECRET` fehlt (Schritt 4) oder ist kürzer als 32 Zeichen.           |
| `/api/auth/callback` leitet zu `/login?error=failed` | `OIDC_CLIENT_SECRET` fehlt oder ist falsch.                                    |
| Schreibzugriffe liefern nach einigen Minuten 401     | `OIDC_AUTH_REFRESH_INTERVAL` ist länger als die Lebensdauer des Access Tokens. |
| Logs ansehen                                         | `pnpm exec wrangler tail`                                                      |
