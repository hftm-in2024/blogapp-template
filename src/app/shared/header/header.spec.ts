import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Header } from './header';
import { AuthStore } from '../../core/auth/auth-store';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;

  async function createComponent(user: unknown): Promise<HTMLElement> {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([]),
        {
          provide: AuthStore,
          useValue: {
            ready: Promise.resolve(),
            loading: () => false,
            isAuthenticated: () => true,
            userData: () => user,
            roles: () => ['user'],
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    await fixture.whenStable();

    return fixture.nativeElement as HTMLElement;
  }

  afterEach(() => TestBed.resetTestingModule());

  it('bildet die Initialen aus dem vollen Namen', async () => {
    const compiled = await createComponent({ name: 'John Doe', preferred_username: 'john.doe' });

    expect(compiled.querySelector('.app-header__avatar')?.textContent).toBe('JD');
  });

  it('nutzt den Benutzernamen ohne Domain, wenn kein Name gesetzt ist', async () => {
    const compiled = await createComponent({ name: '', preferred_username: 'student@hftm.ch' });

    const avatar = compiled.querySelector('.app-header__avatar');
    expect(avatar?.textContent).toBe('ST');
    expect(avatar?.getAttribute('aria-label')).toBe('Du bist angemeldet als student@hftm.ch');
  });
});
