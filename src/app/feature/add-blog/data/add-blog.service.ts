import { inject, Service } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

/** Payload für `POST /entries` gemäss `NewEntry`-Schema des Backends (kein `category`-Feld). */
export interface NewBlog {
  title: string;
  content: string;
}

/**
 * HTTP-Zugriff für die Erstellungs-Seite: nur einen neuen Post anlegen.
 */
@Service()
export class AddBlogService {
  #http = inject(HttpClient);

  async create(blog: NewBlog): Promise<void> {
    await firstValueFrom(this.#http.post(environment.apiUrl + '/entries', blog));
  }
}
