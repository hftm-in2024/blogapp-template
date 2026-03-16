# Shared

Wiederverwendbare Bausteine, die in mehreren Features genutzt werden.

## Was gehört hierhin?

- **Components** (z.B. Buttons, Cards, Dialoge)
- **Directives** (z.B. Highlight, Tooltip)
- **Pipes** (z.B. DateFormat, Truncate)

## Regeln

- Alle Komponenten sind **stateless** (Daten via Input/Output, keine eigenen Services)
- Keine Business-Logik
- Darf von jedem Feature importiert werden
- Darf `core/` nicht importieren
