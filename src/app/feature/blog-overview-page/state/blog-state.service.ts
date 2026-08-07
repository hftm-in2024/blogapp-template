import { computed, effect, inject, Service, signal } from '@angular/core';

import { BlogOverviewService } from '../data/blog-overview.service';
import { storeLogger } from '../../../core/dev-tools';
import { Blog } from '../../../shared/blog-card/blog.model';

/** Sentinel-Wert für "kein Filter aktiv". */
export const ALL_AUTHORS = 'all';

const AUTHOR_STORAGE_KEY = 'blog.selectedAuthor';

/** Kompletter Zustand der Blog-Ansicht in einem einzigen Objekt. */
interface BlogState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  selectedAuthor: string;
}

/**
 * Zentraler State Store für die Blog-Daten.
 *
 * Aufbau in vier Bereichen:
 * - **State**: ein privates `signal<BlogState>()`, das nur über Reducer verändert wird.
 * - **Derived State**: öffentliche `computed()`-Selektoren als Lese-API für die Komponenten.
 * - **Actions**: die öffentlichen Methoden. Sie reden mit dem Backend, kennen `async`
 *   und entscheiden, welcher Reducer wann aufgerufen wird. Sie rechnen nie selbst am State.
 * - **Reducer**: private Methoden, die je genau einen Zustandsübergang schreiben.
 *   Kein Backend, kein `await`, kein `localStorage`, keine Verzweigung.
 *
 * Faustregel: Eine Action beschreibt, **was passiert ist**. Ein Reducer bestimmt,
 * **wie der State danach aussieht**.
 *
 * Komponenten kennen weder den `HttpClient` noch die Form des State-Objekts.
 *
 * Hinweis zum Filter: Das Arbeitsblatt spricht von einer Kategorie. Die Blog-API
 * liefert kein Kategorie-Feld, deshalb filtern wir hier nach Autor.
 */
@Service()
export class BlogStateService {
  readonly #blogService = inject(BlogOverviewService);

  // --- State -------------------------------------------------------------

  readonly #state = signal<BlogState>({
    blogs: [],
    loading: false,
    error: null,
    // Der zuletzt gewählte Autor überlebt einen Reload (siehe effect unten).
    selectedAuthor: localStorage.getItem(AUTHOR_STORAGE_KEY) ?? ALL_AUTHORS,
  });

  // --- Derived State -----------------------------------------------------

  readonly blogs = computed(() => this.#state().blogs);
  readonly loading = computed(() => this.#state().loading);
  readonly error = computed(() => this.#state().error);
  readonly selectedAuthor = computed(() => this.#state().selectedAuthor);

  /** Anzahl aller geladenen Blog-Posts (ungefiltert). */
  readonly blogCount = computed(() => this.blogs().length);

  /** Auswahlliste für den Filter: alle Autoren, die aktuell Posts haben. */
  readonly authors = computed(() => [...new Set(this.blogs().map((blog) => blog.author))].sort());

  /**
   * Nach Autor gefilterte Blog-Posts. Wird automatisch neu berechnet, sobald sich
   * `blogs` oder `selectedAuthor` ändert.
   */
  readonly filteredBlogs = computed(() => {
    const author = this.selectedAuthor();

    return author === ALL_AUTHORS
      ? this.blogs()
      : this.blogs().filter((blog) => blog.author === author);
  });

  constructor() {
    // Side-Effect: gewählten Autor persistieren, sobald er sich ändert.
    effect(() => localStorage.setItem(AUTHOR_STORAGE_KEY, this.selectedAuthor()));

    // Jede State-Änderung in der Konsole mitschreiben (Redux-DevTools-Ersatz).
    storeLogger.attachState(this.#state, { name: 'blog' });
  }

  // --- Actions -----------------------------------------------------------

  /** Lädt die Blog-Liste vom Backend und pflegt dabei Loading- und Error-State. */
  async loadBlogs(): Promise<void> {
    this.#loadStarted();

    try {
      const response = await this.#blogService.getAll();
      this.#loadSucceeded(response.data);
    } catch {
      this.#loadFailed('Die Blog-Posts konnten nicht geladen werden.');
    }
  }

  /** Setzt den Autoren-Filter. `ALL_AUTHORS` hebt den Filter auf. */
  setAuthor(author: string): void {
    this.#authorSelected(author);
  }

  /**
   * Togglet den Like-Status eines Posts. Der State wird sofort aktualisiert
   * (optimistic update) und bei einem Fehler auf den alten Stand zurückgesetzt.
   */
  async like(id: number): Promise<void> {
    const previous = this.blogs();
    this.#likeToggled(id);

    try {
      await this.#blogService.like(id);
    } catch {
      this.#likeReverted(previous, 'Der Like konnte nicht gespeichert werden.');
    }
  }

  // --- Reducer -----------------------------------------------------------
  //
  // Ein Reducer pro Zustandsübergang. Jeder liest den bisherigen State und gibt
  // ein neues Objekt zurück, statt das bestehende zu verändern. Hier gibt es
  // kein Backend, kein await und keine Verzweigung: nur "so sieht der State
  // danach aus". Deshalb sind die Namen im Perfekt formuliert.

  /** Ladevorgang beginnt: Spinner an, alte Fehlermeldung weg. */
  #loadStarted(): void {
    this.#state.update((state) => ({ ...state, loading: true, error: null }));
  }

  /** Daten sind da: Liste übernehmen, Spinner aus. */
  #loadSucceeded(blogs: Blog[]): void {
    this.#state.update((state) => ({ ...state, blogs, loading: false }));
  }

  /** Laden fehlgeschlagen: Fehlermeldung setzen, Spinner aus. */
  #loadFailed(message: string): void {
    this.#state.update((state) => ({ ...state, error: message, loading: false }));
  }

  /** Filter gewechselt. */
  #authorSelected(author: string): void {
    this.#state.update((state) => ({ ...state, selectedAuthor: author }));
  }

  /** Like umgeschaltet: betroffenen Post ersetzen, alle anderen unverändert lassen. */
  #likeToggled(id: number): void {
    this.#state.update((state) => ({
      ...state,
      blogs: state.blogs.map((blog) => (blog.id === id ? toggleLike(blog) : blog)),
    }));
  }

  /** Like zurückgenommen: alte Liste wiederherstellen und Fehler anzeigen. */
  #likeReverted(blogs: Blog[], message: string): void {
    this.#state.update((state) => ({ ...state, blogs, error: message }));
  }
}

/** Kehrt den Like-Status eines einzelnen Posts um. */
function toggleLike(blog: Blog): Blog {
  return {
    ...blog,
    likedByMe: !blog.likedByMe,
    likes: blog.likes + (blog.likedByMe ? -1 : 1),
  };
}
