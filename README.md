# BlogappTemplate

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.1.

## Installation

This project uses [pnpm](https://pnpm.io/) as its package manager (the version is pinned via the `packageManager` field in `package.json`). Install pnpm once and then install the dependencies:

```bash
npm install -g pnpm   # or, on Node.js < 25: corepack enable
pnpm install
```

pnpm automatically switches to the version pinned in `packageManager`.

Dependency overrides, allowed build scripts and peer-dependency rules live in `pnpm-workspace.yaml`.

## Development server

To start a local development server, run:

```bash
pnpm start
```

This starts two processes: the Angular dev server on `http://localhost:4200/` and the BFF (`worker/index.ts`, run by `wrangler dev`) on port 8787. The dev server forwards `/api` to the BFF (`proxy.conf.json`), so the browser only ever talks to `http://localhost:4200/`. The application reloads automatically whenever you modify a source file.

The BFF needs two secrets. Copy `.dev.vars.example` to `.dev.vars` once and fill in the values.

## Backend for Frontend (BFF)

`worker/index.ts` is a small [Hono](https://hono.dev/) app that handles the login with [`@hono/oidc-auth`](https://github.com/honojs/middleware/tree/main/packages/oidc-auth). The browser never sees a token, only an HttpOnly session cookie.

| Endpoint                           | Purpose                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `GET /api/auth/login?returnUrl=/x` | Redirects to the identity provider, then back to `returnUrl`            |
| `GET /api/auth/callback`           | Exchanges the authorization code for tokens, sets the session           |
| `GET /api/auth/me`                 | `{ isAuthenticated, user: { preferred_username, email, name, roles } }` |
| `POST /api/auth/logout`            | Ends the session, returns `{ logoutUrl }` to navigate to                |
| `/api/*`                           | Forwarded to the blog backend with the access token attached            |

Run its tests with `pnpm run test:bff`.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/app/browser/` directory (the output path is configured as `dist/app` in `angular.json`). By default, the production build optimizes your application for performance and speed.

## Deployment to Cloudflare Workers

The Angular build and the BFF are deployed together as one Cloudflare Worker (`wrangler.jsonc`). `.github/workflows/deploy.yml` deploys on every push to `main`.

Setup (account, GitHub secrets, BFF secrets, Keycloak redirect URI): see [docs/cloudflare-deployment.md](docs/cloudflare-deployment.md).

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
