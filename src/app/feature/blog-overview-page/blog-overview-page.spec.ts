import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogService } from '../blog/blog';
import { BlogOverviewPage } from './blog-overview-page';

describe('BlogOverviewPage', () => {
  let component: BlogOverviewPage;
  let fixture: ComponentFixture<BlogOverviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogOverviewPage],
      providers: [
        {
          provide: BlogService,
          useValue: {
            getBlogs: vi.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogOverviewPage);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
