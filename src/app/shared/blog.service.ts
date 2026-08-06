import { Injectable } from '@angular/core';

import blogData from '../data/blogs.json';
import { Blog } from './blog.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly blogs: Blog[] = blogData as Blog[];

  getAll(): Blog[] {
    return this.blogs;
  }

  getById(id: number): Blog | undefined {
    return this.blogs.find((blog) => blog.id === id);
  }

  toggleLike(id: number): void {
    const blog = this.getById(id);

    if (!blog) {
      return;
    }

    blog.likedByMe = !blog.likedByMe;
    blog.likes += blog.likedByMe ? 1 : -1;
  }
}
