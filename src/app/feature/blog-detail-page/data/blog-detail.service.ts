import { inject, Service } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { BlogDetail } from '../../../shared/blog-card/blog.model';

/**
 * HTTP-Zugriff für die Detail-Seite: nur einen einzelnen Post laden.
 * Die Liste holt der `BlogOverviewService` des Übersichts-Features.
 */
@Service()
export class BlogDetailService {
  #http = inject(HttpClient);

  async getById(id: number): Promise<BlogDetail | undefined> {
    return firstValueFrom(this.#http.get<BlogDetail>(environment.apiUrl + '/entries/' + id));
  }
}
