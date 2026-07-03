import { inject, Service } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Blog, BlogResponse } from '../../shared/blog-card/blog.model';

/**
 * Zentraler Service für die Blog-Daten. Hält die Posts aus `blogs.json`
 * und stellt sie für alle Komponenten per `inject(BlogService)` bereit.
 */
@Service()
export class BlogService {
  #http = inject(HttpClient);

  async getAll(): Promise<BlogResponse> {
    return firstValueFrom(this.#http.get<BlogResponse>(environment.api + '/entries'));
  }

  async getById(id: number): Promise<Blog | undefined> {
    return firstValueFrom(this.#http.get<Blog>(environment.api + '/entries/' + id));
  }

  async like(id: number): Promise<void> {
    await firstValueFrom(this.#http.post(environment.api + '/entries/' + id + '/like-info', {}));
  }
}
