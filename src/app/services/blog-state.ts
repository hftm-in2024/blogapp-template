import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Blog } from '../models/blog';
import { BlogService } from '../shared/blog';

interface BlogState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  selectedAuthor: string;
}

@Injectable({
  providedIn: 'root',
})
export class BlogStateService {
  private blogService = inject(BlogService);

  // STATE
  readonly #state = signal<BlogState>({
    blogs: [],
    loading: false,
    error: null,
    selectedAuthor: localStorage.getItem('selectedAuthor') ?? 'all',
  });

  // DERIVED STATE
  readonly blogs = computed(() => this.#state().blogs);

  readonly loading = computed(() => this.#state().loading);

  readonly error = computed(() => this.#state().error);

  readonly selectedAuthor = computed(() => this.#state().selectedAuthor);

  readonly blogCount = computed(() => this.blogs().length);

  readonly authors = computed(() => {
    return [...new Set(this.blogs().map((blog) => blog.author))];
  });

  readonly filteredBlogs = computed(() => {
    const selectedAuthor = this.selectedAuthor();

    if (selectedAuthor === 'all') {
      return this.blogs();
    }

    return this.blogs().filter((blog) => blog.author === selectedAuthor);
  });

  // EFFECT
  private readonly saveAuthorEffect = effect(() => {
    localStorage.setItem('selectedAuthor', this.selectedAuthor());
  });

  // ACTIONS
  async loadBlogs(): Promise<void> {
    this.#loadStarted();

    try {
      const blogs = await this.blogService.getAll();
      this.#loadSucceeded(blogs);
    } catch (error) {
      console.error('Blogs konnten nicht geladen werden:', error);
      this.#loadFailed('Blogs konnten nicht geladen werden.');
    }
  }

  setAuthor(author: string): void {
    this.#authorSelected(author);
  }

  toggleLike(blogId: number): void {
    this.#likeToggled(blogId);
  }

  // REDUCERS
  #loadStarted(): void {
    this.#state.update((state) => ({
      ...state,
      loading: true,
      error: null,
    }));
  }

  #loadSucceeded(blogs: Blog[]): void {
    this.#state.update((state) => ({
      ...state,
      blogs,
      loading: false,
    }));
  }

  #loadFailed(message: string): void {
    this.#state.update((state) => ({
      ...state,
      error: message,
      loading: false,
    }));
  }

  #authorSelected(author: string): void {
    this.#state.update((state) => ({
      ...state,
      selectedAuthor: author,
    }));
  }

  #likeToggled(blogId: number): void {
    this.#state.update((state) => ({
      ...state,
      blogs: state.blogs.map((blog) => {
        if (blog.id !== blogId) {
          return blog;
        }

        const likedByMe = !blog.likedByMe;

        return {
          ...blog,
          likedByMe,
          likes: likedByMe ? blog.likes + 1 : blog.likes - 1,
        };
      }),
    }));
  }
}
