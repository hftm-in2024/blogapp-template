# Core

Singleton Services und App-weite Providers.

## Was gehört hierhin?

- **Services** mit `providedIn: 'root'` (Auth, API, Theme, Error Handling)
- **HTTP Interceptors** (z.B. Auth-Token, Error-Interceptor)
- **Guards** (z.B. Auth-Guard, Role-Guard)
- **Layout-Komponenten** (z.B. Header, Footer, Navigation)

## Regeln

- Wird nur in `app.config.ts` importiert/registriert
- Keine Feature-spezifische Logik
- Keine Komponenten, die in mehreren Features wiederverwendet werden (dafür gibt es `shared/`)
