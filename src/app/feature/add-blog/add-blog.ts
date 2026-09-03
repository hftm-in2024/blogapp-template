import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../core/auth/auth-store';

@Component({
  selector: 'app-add-blog',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './add-blog.html',
  styleUrl: './add-blog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddBlogPage {
  protected readonly authStore = inject(AuthStore);
}
