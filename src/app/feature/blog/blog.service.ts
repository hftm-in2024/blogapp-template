import { inject, Service } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Blog,
  BlogDetail,
  BlogInput,
  blogDetailSchema,
  blogResponseSchema,
} from '../../shared/blog-card/blog.model';

/**
 * Zentraler Service für die Blog-Daten. Kapselt alle HTTP-Aufrufe gegen die
 * Blog-Backend-API und validiert die Antworten mit Zod, damit unerwartete
 * Daten die App nicht zum Absturz bringen.
 */
@Service()
export class BlogService {
  readonly #http = inject(HttpClient);
  readonly #url = `${environment.api}/entries`;

  /**
   * Lädt alle Blog-Posts. Bei Netzwerk- oder Validierungsfehlern wird der
   * Fehler geloggt und eine leere Liste zurückgegeben (graceful degradation).
   */
  async getAll(): Promise<Blog[]> {
    try {
      const response = await firstValueFrom(this.#http.get(this.#url));
      const result = blogResponseSchema.safeParse(response);

      if (!result.success) {
        console.error('Unerwartete API-Antwort für /entries:', result.error.issues);
        return [];
      }

      return result.data.data;
    } catch (error) {
      console.error('Blogs konnten nicht geladen werden:', error);
      return [];
    }
  }

  /** Lädt einen einzelnen Post; `undefined`, wenn er fehlt oder die Antwort nicht passt. */
  async getById(id: number): Promise<BlogDetail | undefined> {
    try {
      const response = await firstValueFrom(this.#http.get(`${this.#url}/${id}`));
      const result = blogDetailSchema.safeParse(response);

      if (!result.success) {
        console.error(`Unerwartete API-Antwort für /entries/${id}:`, result.error.issues);
        return undefined;
      }

      return result.data;
    } catch (error) {
      console.error(`Blog ${id} konnte nicht geladen werden:`, error);
      return undefined;
    }
  }

  /** Legt einen neuen Post an. Fehler werden an den Aufrufer weitergereicht. */
  async create(blog: BlogInput): Promise<BlogDetail> {
    return firstValueFrom(this.#http.post<BlogDetail>(this.#url, blog));
  }

  /** Aktualisiert einen bestehenden Post. */
  async update(id: number, blog: BlogInput): Promise<BlogDetail> {
    return firstValueFrom(this.#http.put<BlogDetail>(`${this.#url}/${id}`, blog));
  }

  /** Löscht einen Post. */
  async delete(id: number): Promise<void> {
    await firstValueFrom(this.#http.delete<void>(`${this.#url}/${id}`));
  }

  /** Setzt bzw. entfernt den Like des aktuellen Users. */
  async like(id: number): Promise<void> {
    await firstValueFrom(this.#http.post(`${this.#url}/${id}/like-info`, {}));
  }
}
