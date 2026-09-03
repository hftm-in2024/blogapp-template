import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about-page',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage {
  protected readonly topics = [
    {
      icon: 'widgets',
      title: 'Komponenten und Signals',
      text: 'Standalone Components, Signal-basierte Inputs und Outputs sowie ein zentraler State Store statt verstreuter Variablen.',
    },
    {
      icon: 'alt_route',
      title: 'Routing und Lazy Loading',
      text: 'Jedes Feature liegt in einem eigenen Chunk und wird erst geladen, wenn die Route wirklich aufgerufen wird.',
    },
    {
      icon: 'shield',
      title: 'Auth mit BFF-Pattern',
      text: 'Der Login läuft über Keycloak, das Token bleibt serverseitig. Im Browser liegt nur ein HTTP-Only-Cookie.',
    },
  ];

  protected readonly stack = [
    'Angular 22 mit Standalone Components und Signals',
    'Angular Material 22 mit eigenem Theme und Dark Mode',
    'Azure Functions als Backend for Frontend',
    'Keycloak als Identity Provider',
    'Vitest für die Unit-Tests',
  ];
}
