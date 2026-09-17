import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BlogCardComponent } from './blog-card';

describe('BlogCardComponent', () => {
  let component: BlogCardComponent;
  let fixture: ComponentFixture<BlogCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogCardComponent);

    fixture.componentRef.setInput('model', {
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
    });

    fixture.detectChanges();

    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
