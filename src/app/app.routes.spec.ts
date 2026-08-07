import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { Blog } from './shared/blog-card/blog.model';

const BLOG: Blog = {
  id: 7,
  title: 'Test-Titel',
  contentPreview: 'Ein Inhalt.',
  author: 'Test Autor',
  likes: 0,
  comments: 0,
  likedByMe: false,
  createdByMe: false,
  createdAt: '2026-01-01T00:00:00',
  updatedAt: '2026-01-01T00:00:00',
};

@Component({ selector: 'app-test-host', imports: [RouterOutlet], template: '<router-outlet />' })
class TestHost {}

describe('app.routes', () => {
  it('lädt das Detail-Feature lazy und vererbt :id an Resolver und Komponente', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    const fixture = TestBed.createComponent(TestHost);
    const httpMock = TestBed.inject(HttpTestingController);

    const navigation = TestBed.inject(Router).navigateByUrl('/blog/7');

    // Warten, bis der lazy geladene Chunk da ist und der Resolver die Anfrage abgesetzt hat.
    // Die URL beweist zugleich, dass die :id der Parent-Route im Child ankommt.
    const url = environment.api + '/entries/7';
    let requests = httpMock.match(url);
    while (requests.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      requests = httpMock.match(url);
    }

    requests[0].flush(BLOG);
    await expect(navigation).resolves.toBe(true);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain(BLOG.title);

    httpMock.verify();
  });
});
