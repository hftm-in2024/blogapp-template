import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SidebarComponent } from './sidebar';
import { AuthStore } from '../auth/auth-store';

describe('SidebarComponent', () => {
  it('rendert Sidenav mit Navigation', async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthStore,
          useValue: {
            ready: Promise.resolve(),
            loading: () => false,
            isAuthenticated: () => false,
            userData: () => null,
            roles: () => [],
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(SidebarComponent);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('mat-sidenav')).toBeTruthy();
  });
});
