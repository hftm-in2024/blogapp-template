import { Injectable } from '@angular/core';

import blogsData from '../data/blogs.json';
import { Blog } from '../core/utils/blog-model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private blogs: Blog[] = blogsData as Blog[];

  getAll(): Blog[] {
    return this.blogs;
  }

  getById(id: number): Blog | undefined {
    return this.blogs.find((blog) => blog.id === id);
  }
}
