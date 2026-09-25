import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { Header } from '../../shared/header/header';
import { AuthStore } from '../auth/auth-store';
import { breakpointSignal } from '../utils';
import { environment } from '../../../environments/environment';

/** Layout-Shell: Sidenav (Hamburger auf Mobile) + Header + Seiteninhalt via ng-content. */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  imports: [MatSidenavModule, MatListModule, MatIconModule, RouterLink, RouterLinkActive, Header],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly title = input('');
  readonly isDarkMode = input(false);
  readonly themeToggle = output<void>();

  protected readonly authEnabled = environment.authEnabled;
  protected readonly authStore = inject(AuthStore);
  /** Aufgabe 6: reaktives Signal, unter 768px true. Cleanup übernimmt der BreakpointObserver. */
  protected readonly isMobile = breakpointSignal('(max-width: 767.98px)');

  private readonly drawer = viewChild.required(MatSidenav);

  constructor() {
    // Beim Wechsel auf Desktop das Menü schliessen, damit kein Overlay hängen bleibt.
    effect(() => {
      if (!this.isMobile()) void this.drawer().close();
    });
  }
}
