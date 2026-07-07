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
    console.log('GET', this.apiUrl);

    const response = await firstValueFrom(this.http.get<BlogResponse>(this.apiUrl));

    console.log(response);

    return response.data;
  }

  async getById(id: number): Promise<Blog | undefined> {
    const blogs = await this.getAll();
    return blogs.find((blog) => blog.id === id);
  }
}
