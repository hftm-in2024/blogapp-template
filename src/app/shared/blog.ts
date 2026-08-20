import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { Blog } from '../core/utils/blog-model';
import { environment } from '../../environments/environment';

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

  private readonly apiUrl = `${environment.bffUrl}/entries`;

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
}
