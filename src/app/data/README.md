# Blog-Daten (`blogs.json`)

Diese Datei enthält Beispiel-Blogposts für die Entwicklung deiner Blog-App. Die Datenstruktur entspricht der API des Blog-Backends (`/entries`-Endpoint).

## Felder

| Feld             | Typ                 | Beschreibung                                         |
| ---------------- | ------------------- | ---------------------------------------------------- |
| `id`             | `number`            | Eindeutige ID des Blog-Posts                         |
| `title`          | `string`            | Titel des Posts                                      |
| `contentPreview` | `string`            | Vorschautext (gekürzt)                               |
| `author`         | `string`            | Name des Autors                                      |
| `likes`          | `number`            | Anzahl Likes                                         |
| `comments`       | `number`            | Anzahl Kommentare                                    |
| `likedByMe`      | `boolean`           | Ob der aktuelle User geliked hat                     |
| `createdByMe`    | `boolean`           | Ob der aktuelle User der Autor ist                   |
| `headerImageUrl` | `string` (optional) | URL zum Header-Bild — nicht bei jedem Post vorhanden |
| `createdAt`      | `string`            | Erstellungsdatum (ISO 8601)                          |
| `updatedAt`      | `string`            | Letztes Update (ISO 8601)                            |

## JSON importieren und typisieren

### 1. Interface definieren

Erstelle ein Interface, das zur JSON-Struktur passt. Achte darauf, dass `headerImageUrl` optional ist (`?`), weil nicht jeder Post ein Bild hat.

### 2. JSON importieren

```typescript
import blogData from './blogs.json';
```

Damit das funktioniert, muss in `tsconfig.json` folgende Option gesetzt sein (ist im Projekttemplate bereits aktiv):

```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

### 3. Typisieren

TypeScript inferiert den Typ aus der JSON-Datei automatisch, aber du solltest ihn explizit auf dein Interface casten:

```typescript
const blogs: Blog[] = blogData as Blog[];
```

## API-Referenz

Im späteren Verlauf des Kurses (ab KT 07) werden die Blog-Daten nicht mehr aus der JSON-Datei geladen, sondern live von der REST-API:

```
GET https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io/entries
```

Die API gibt ein paginiertes Objekt zurück:

```json
{
  "data": [ ... ],
  "pageIndex": 0,
  "pageSize": 20,
  "totalCount": 42,
  "maxPageSize": 50
}
```

Die Einträge im `data`-Array (`EntryOverview`) haben dieselbe Struktur wie `blogs.json`. Die API liefert zusätzlich Paging-Informationen (`pageIndex`, `pageSize`, `totalCount`, `maxPageSize`).
