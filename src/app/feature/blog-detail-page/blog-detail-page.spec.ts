import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { BlogDetailPage } from './blog-detail-page';

describe('BlogDetailPage', () => {
  let component: BlogDetailPage;
  let fixture: ComponentFixture<BlogDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogDetailPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                blog: {
                  id: 1,
                  title: 'Test',
                  contentPreview: 'Test',
                  author: 'Tester',
                  likes: 0,
                  comments: 0,
                  likedByMe: false,
                  createdByMe: false,
                  createdAt: '',
                  updatedAt: '',
                },
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
