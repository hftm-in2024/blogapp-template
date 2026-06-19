/**
 * Datenstruktur eines Blog-Posts.
 *
 * Abgeleitet aus `src/app/data/blogs.json` und der Feld-Tabelle in
 * `src/app/data/README.md`. Entspricht dem `EntryOverview`-Objekt der
 * Blog-Backend-API (`/entries`-Endpoint), das wir ab KT 07 verwenden.
 */
export interface Blog {
  id: number;
  title: string;
  contentPreview: string;
  author: string;
  likes: number;
  comments: number;
  likedByMe: boolean;
  createdByMe: boolean;
  /** Optional — nicht jeder Post hat ein Header-Bild. */
  headerImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
