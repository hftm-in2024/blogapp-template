import { Service } from '@angular/core';

import { Blog } from './blog-card/blog.model';
import blogData from '../data/blogs.json';

/**
 * Zentraler Service für die Blog-Daten. Hält die Posts aus `blogs.json`
 * und stellt sie für alle Komponenten per `inject(BlogService)` bereit.
 */
@Service()
export class BlogService {
  private readonly blogs: Blog[] = blogData as Blog[];

  getAll(): Blog[] {
    return this.blogs;
  }

  getById(id: number): Blog | undefined {
    return this.blogs.find((blog) => blog.id === id);
  }
}
