import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-add-blog',
  template: `<p>Neuer Blog-Beitrag (nur für eingeloggte User mit Rolle "user").</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddBlogPage {}
