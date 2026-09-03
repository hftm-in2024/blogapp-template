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

/** Ein Kommentar, wie ihn der Detail-Endpoint (`/entries/:id`) mitliefert. */
export interface BlogComment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Detail-Sicht eines Blog-Posts (`/entries/:id`). Der Endpoint liefert statt der
 * gekürzten Vorschau den vollen `content` und die Kommentare als Liste.
 */
export interface BlogDetail extends Omit<Blog, 'contentPreview' | 'comments'> {
  content: string;
  comments: BlogComment[];
}

export interface BlogResponse {
  data: Blog[];
  total: number;
  page: number;
  limit: number;
}
