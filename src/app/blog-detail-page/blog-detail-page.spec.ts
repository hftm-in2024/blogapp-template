import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogDetailPage } from './blog-detail-page';

describe('BlogDetailPage', () => {
  let component: BlogDetailPage;
  let fixture: ComponentFixture<BlogDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
