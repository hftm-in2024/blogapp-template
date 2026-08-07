import { inject, Service } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { BlogResponse } from '../../../shared/blog-card/blog.model';

/**
 * HTTP-Zugriff für die Übersichts-Seite: nur Liste laden und Liken.
 * Details holt der `BlogDetailService` des Detail-Features.
 */
@Service()
export class BlogOverviewService {
  #http = inject(HttpClient);

  async getAll(): Promise<BlogResponse> {
    return firstValueFrom(this.#http.get<BlogResponse>(environment.api + '/entries'));
  }

  async like(id: number): Promise<void> {
    await firstValueFrom(this.#http.post(environment.api + '/entries/' + id + '/like-info', {}));
  }
}
