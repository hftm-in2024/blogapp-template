import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { Blog } from '../core/utils/blog-model';

interface BlogResponse {
  data: Blog[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  maxPageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private http = inject(HttpClient);

  private readonly apiUrl =
    'https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io/entries';

  async getAll(): Promise<Blog[]> {
    try {
      const response = await firstValueFrom(this.http.get<BlogResponse>(this.apiUrl));

      return response.data;
    } catch (error) {
      console.error('Fehler beim Laden der Blogs', error);
      return [];
    }
  }

  async getById(id: number): Promise<Blog | undefined> {
    const blogs = await this.getAll();
    return blogs.find((blog) => blog.id === id);
  }

  async createBlog(blog: Blog): Promise<Blog> {
    try {
      return await firstValueFrom(this.http.post<Blog>(this.apiUrl, blog));
    } catch (error) {
      console.error('Fehler beim Erstellen des Blogs', error);
      throw error;
    }
  }

  async updateBlog(id: string, blog: Blog): Promise<Blog> {
    try {
      return await firstValueFrom(this.http.put<Blog>(`${this.apiUrl}/${id}`, blog));
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Blogs', error);
      throw error;
    }
  }

  async deleteBlog(id: string): Promise<void> {
    try {
      await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
    } catch (error) {
      console.error('Fehler beim Löschen des Blogs', error);
      throw error;
    }
  }
}
