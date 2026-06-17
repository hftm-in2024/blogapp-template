import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, NoopAnimationsModule],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    fixture.detectChanges();

    expect(app).toBeTruthy();
  });

  it('should render title in toolbar', async () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('mat-toolbar')?.textContent).toContain(
      'HFTM Web Applications (IN353)',
    );
  });

  it('should toggle likedByMe and increase likes', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    const blog = app.blogs[0];
    blog.likedByMe = false;
    const initialLikes = blog.likes;

    app.toggleLike(blog.id);

    expect(blog.likedByMe).toBe(true);
    expect(blog.likes).toBe(initialLikes + 1);
  });

  it('should toggle likedByMe and decrease likes when already liked', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    const blog = app.blogs[0];
    blog.likedByMe = true;
    blog.likes = 10;

    app.toggleLike(blog.id);

    expect(blog.likedByMe).toBe(false);
    expect(blog.likes).toBe(9);
  });

  it('should do nothing when blog id does not exist', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(() => app.toggleLike(999999)).not.toThrow();
  });
});
