# Feature

Lazy-loaded Feature-Bereiche der Applikation.

## Was gehört hierhin?

- **Feature-Komponenten** (z.B. Blog-Liste, Blog-Detail, Profil)
- **Feature-spezifische Services** (z.B. BlogService)
- **Feature-spezifische Models/Types**
- **Feature-Routes**

## Regeln

- Jedes Feature in einem eigenen Unterordner (z.B. `feature/blog/`, `feature/profile/`)
- Features werden per Lazy Loading in `app.routes.ts` eingebunden
- Feature-Komponenten dürfen `shared/`-Komponenten importieren, aber nicht andere Features

## Beispiel

```bash
ng generate component feature/blog
```
