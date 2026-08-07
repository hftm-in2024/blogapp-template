import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogDetailPage } from './blog-detail-page';
import { BlogDetail } from '../../../shared/blog-card/blog.model';

const SAMPLE_BLOG: BlogDetail = {
  id: 1,
  title: 'Test-Titel',
  content: 'Ein Inhalt.',
  author: 'Test Autor',
  likes: 0,
  likedByMe: false,
  createdByMe: false,
  createdAt: '2026-01-01T00:00:00',
  updatedAt: '2026-01-01T00:00:00',
};

describe('BlogDetailPage', () => {
  let component: BlogDetailPage;
  let fixture: ComponentFixture<BlogDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogDetailPage);
    component = fixture.componentInstance;
    // Pflicht-Input setzen, bevor die Komponente stabilisiert wird.
    fixture.componentRef.setInput('id', String(SAMPLE_BLOG.id));
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('zeigt den Titel des übergebenen Blog-Posts an', async () => {
    fixture.componentRef.setInput('blog', SAMPLE_BLOG);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(SAMPLE_BLOG.title);
  });

  it('zeigt einen Hinweis, wenn kein Blog-Post gefunden wurde', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Kein Blog-Post');
  });
});
