import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  form,
  FormField,
  maxLength,
  minLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthStore } from '../../core/auth/auth-store';
import { AddBlogService } from './data/add-blog.service';

/** Erlaubt Buchstaben (inkl. Umlaute), Ziffern und Leerzeichen. */
const TITLE_PATTERN = /^[\p{L}0-9 ]+$/u;

interface BlogFormValue {
  title: string;
  content: string;
}

@Component({
  selector: 'app-add-blog',
  imports: [
    RouterLink,
    FormField,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './add-blog.html',
  styleUrl: './add-blog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddBlogPage {
  protected readonly authStore = inject(AuthStore);
  readonly #addBlogService = inject(AddBlogService);
  readonly #router = inject(Router);

  protected readonly blogModel = signal<BlogFormValue>({
    title: '',
    content: '',
  });

  protected readonly blogForm = form(this.blogModel, (path) => {
    required(path.title, { message: 'Titel ist erforderlich' });
    minLength(path.title, 3, { message: 'Titel muss mindestens 3 Zeichen lang sein' });
    maxLength(path.title, 100, { message: 'Titel darf höchstens 100 Zeichen lang sein' });
    validate(path.title, ({ value }) => {
      const title = value();
      if (title.length === 0 || TITLE_PATTERN.test(title)) return null;
      return {
        kind: 'titlePattern',
        message: 'Titel darf nur Buchstaben, Zahlen und Leerzeichen enthalten',
      };
    });

    required(path.content, { message: 'Inhalt ist erforderlich' });
    minLength(path.content, 10, { message: 'Inhalt muss mindestens 10 Zeichen lang sein' });
    validate(path.content, ({ value, valueOf }) => {
      const content = value();
      const title = valueOf(path.title);
      if (content.length === 0 || content.length >= title.length * 2) return null;
      return {
        kind: 'contentTooShort',
        message: 'Inhalt muss mindestens doppelt so lang wie der Titel sein',
      };
    });
  });

  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.blogForm, async () => {
      const { title, content } = this.blogModel();
      this.saving.set(true);
      this.error.set(null);

      try {
        await this.#addBlogService.create({ title, content });
        await this.#router.navigateByUrl('/');
      } catch {
        this.error.set('Der Beitrag konnte nicht gespeichert werden.');
      } finally {
        this.saving.set(false);
      }

      return undefined;
    });
  }
}
