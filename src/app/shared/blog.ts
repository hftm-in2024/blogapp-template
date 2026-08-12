import { inject, Injectable } from '@angular/core';
import { Blog } from '../models/blog';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { z } from 'zod';

const blogSchema = z.object({
  id: z.number(),
  title: z.string(),
  contentPreview: z.string(),
  author: z.string(),
  likes: z.number(),
  comments: z.number(),
  likedByMe: z.boolean(),
  createdByMe: z.boolean(),
  headerImageUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const blogResponseSchema = z.object({
  data: z.array(blogSchema),
});

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  #httpClient = inject(HttpClient);
  #apiUrl = environment.apiUrl + '/entries';

  async getAll(): Promise<Blog[]> {
    try {
      const response = await firstValueFrom(this.#httpClient.get<unknown>(this.#apiUrl));

      const result = blogResponseSchema.safeParse(response);

      if (!result.success) {
        console.error('Ungültige Blog-API-Response:', result.error);
        return [];
      }

      return result.data.data;
    } catch (error) {
      console.error('Blogs konnten nicht geladen werden:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Blog | undefined> {
    try {
      const response = await firstValueFrom(this.#httpClient.get<unknown>(`${this.#apiUrl}/${id}`));

      const result = blogSchema.safeParse(response);

      if (!result.success) {
        console.error(`Ungültiger Blog mit ID ${id}:`, result.error);
        return undefined;
      }

      return result.data;
    } catch (error) {
      console.error(`Blog mit ID ${id} konnte nicht geladen werden:`, error);
      return undefined;
    }
  }

  async createBlog(blog: Blog): Promise<Blog | undefined> {
    try {
      return await firstValueFrom(this.#httpClient.post<Blog>(this.#apiUrl, blog));
    } catch (error) {
      console.error('Blog konnte nicht erstellt werden:', error);
      return undefined;
    }
  }

  async updateBlog(id: string, blog: Blog): Promise<Blog | undefined> {
    try {
      return await firstValueFrom(this.#httpClient.put<Blog>(`${this.#apiUrl}/${id}`, blog));
    } catch (error) {
      console.error(`Blog mit ID ${id} konnte nicht aktualisiert werden:`, error);
      return undefined;
    }
  }

  async deleteBlog(id: string): Promise<void> {
    try {
      await firstValueFrom(this.#httpClient.delete<void>(`${this.#apiUrl}/${id}`));
    } catch (error) {
      console.error(`Blog mit ID ${id} konnte nicht gelöscht werden:`, error);
    }
  }
}
