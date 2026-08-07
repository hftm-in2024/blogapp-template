# Feature

Lazy-loaded Feature-Bereiche der Applikation.

## Was gehört hierhin?

- **Feature-Komponenten** (z.B. Blog-Liste, Blog-Detail, Profil)
- **Feature-spezifische Services** (z.B. BlogOverviewService, BlogDetailService)
- **Feature-spezifische Models/Types**
- **Feature-Routes**

## Aufbau eines Features

```
feature/blog-overview-page/
  blog-overview-page.ts|html|scss      Komponente (Darstellung, Interaktion)
  data/                                HTTP-Zugriff: nur die Endpunkte dieses Features
    blog-overview.service.ts
  state/                               Signal-Store: Zustand, Actions, abgeleitete Werte
    blog-state.service.ts

feature/blog-detail-page/
  blog-detail-page.ts|html|scss
  blog-detail-page.routes.ts           Child-Routes, per loadChildren geladen
  blog.resolver.ts                     lädt die Daten vor der Aktivierung
  data/
    blog-detail.service.ts
```

Der `state/`-Ordner entfällt, solange ein Feature keinen eigenen Zustand hält
(wie bei der Detail-Seite, die ihre Daten vom Resolver bekommt).

## Regeln

- Jedes Feature in einem eigenen Unterordner (z.B. `feature/blog-overview-page/`, `feature/blog-detail-page/`)
- Ein Service gehört in den Ordner des Features, das ihn nutzt, und bietet nur die dort benötigten Methoden
- `data/` kennt nur HTTP, `state/` kennt nur `data/`, die Komponente kennt nur `state/`
- Features werden per Lazy Loading in `app.routes.ts` eingebunden
- Feature-Komponenten dürfen `shared/`-Komponenten importieren, aber nicht andere Features

## Beispiel

```bash
ng generate component feature/blog-overview-page
ng generate service feature/blog-overview-page/data/blog-overview
```
