import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BlogDetailPage } from './blog-detail-page';

describe('BlogDetailPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogDetailPage, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                blog: {
                  id: 1,
                  title: 'Test Blog',
                  contentPreview: 'Test Inhalt',
                  author: 'Fabio',
                  likes: 0,
                  comments: 0,
                  likedByMe: false,
                  createdByMe: false,
                  createdAt: '2026-01-01T00:00:00Z',
                  updatedAt: '2026-01-01T00:00:00Z',
                },
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(BlogDetailPage);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
