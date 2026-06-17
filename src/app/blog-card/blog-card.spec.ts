import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { BlogCard } from './blog-card';
import { Blog } from '../models/blog.model';

describe('BlogCard', () => {
  let component: BlogCard;
  let fixture: ComponentFixture<BlogCard>;

  const mockBlog: Blog = {
    id: 1,
    title: 'Test Blog',
    contentPreview: 'Kurzer Testinhalt',
    author: 'Fabio',
    likes: 0,
    comments: 0,
    likedByMe: false,
    createdByMe: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCard],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogCard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('blog', mockBlog);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit blog id when onLike is called', () => {
    const emitSpy = vi.spyOn(component.liked, 'emit');

    component.onLike();

    expect(emitSpy).toHaveBeenCalledWith(mockBlog.id);
  });

  it('should display title', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain(mockBlog.title);
  });

  it('should display author', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain(mockBlog.author);
  });

  it('should display likes count', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain(mockBlog.likes.toString());
  });
});
