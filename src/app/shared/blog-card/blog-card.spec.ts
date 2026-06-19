import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogCard } from './blog-card';
import { Blog } from './blog.model';

const SAMPLE_BLOG: Blog = {
  id: 42,
  title: 'Test-Titel',
  contentPreview: 'Eine kurze Vorschau.',
  author: 'Test Autor',
  likes: 7,
  comments: 1,
  likedByMe: false,
  createdByMe: false,
  headerImageUrl: 'https://example.com/image.jpg',
  createdAt: '2026-01-01T00:00:00',
  updatedAt: '2026-01-01T00:00:00',
};

describe('BlogCard', () => {
  let component: BlogCard;
  let fixture: ComponentFixture<BlogCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCard],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogCard);
    component = fixture.componentInstance;
    // Pflicht-Input setzen, bevor die Komponente stabilisiert wird.
    fixture.componentRef.setInput('model', SAMPLE_BLOG);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emittiert beim Liken die Blog-ID', () => {
    let emittedId: number | undefined;
    component.liked.subscribe((id) => (emittedId = id));

    component.onLike();

    expect(emittedId).toBe(SAMPLE_BLOG.id);
  });
});
