import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

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
      title: 'Test Blog',
      contentPreview: 'Test Preview',
      author: 'Tester',
      likes: 0,
      comments: 0,
      likedByMe: false,
      createdByMe: false,
      createdAt: '',
      updatedAt: '',
    });

    fixture.detectChanges();
    await fixture.whenStable();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display blog title', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Test Blog');
  });

  it('should emit likeClicked event', () => {
    const emitSpy = vi.spyOn(component.likeClicked, 'emit');

    component.onLikeClick(new MouseEvent('click'));

    expect(emitSpy).toHaveBeenCalledWith(1);
  });
});
