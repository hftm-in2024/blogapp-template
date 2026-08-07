import { z } from 'zod';

/**
 * Zod-Schema eines Blog-Posts in der Übersicht (`EntryOverview` der Backend-API).
 * Dient gleichzeitig als Quelle für den TypeScript-Typ `Blog` (`z.infer`),
 * damit Schema und Interface nicht auseinanderlaufen können.
 */
export const blogSchema = z.object({
  id: z.number(),
  title: z.string(),
  contentPreview: z.string(),
  author: z.string(),
  likes: z.number(),
  comments: z.number(),
  likedByMe: z.boolean(),
  createdByMe: z.boolean(),
  /** Optional — nicht jeder Post hat ein Header-Bild. */
  headerImageUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** Paginierte Antwort des `/entries`-Endpoints. */
export const blogResponseSchema = z.object({
  data: z.array(blogSchema),
  pageIndex: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  maxPageSize: z.number(),
});

/**
 * Detail-Ansicht eines Posts (`GET /entries/:id`): voller `content` statt
 * `contentPreview`. Zusatzfelder der API (z. B. `comments`) ignoriert Zod.
 */
export const blogDetailSchema = blogSchema
  .omit({ contentPreview: true, comments: true })
  .extend({ content: z.string() });

/** Payload zum Anlegen/Ändern eines Posts. */
export interface BlogInput {
  title: string;
  content: string;
  headerImageUrl?: string;
}

export type Blog = z.infer<typeof blogSchema>;
export type BlogDetail = z.infer<typeof blogDetailSchema>;
