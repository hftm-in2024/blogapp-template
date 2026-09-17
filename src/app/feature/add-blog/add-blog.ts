import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
import { MatSelectModule } from '@angular/material/select';
import { AuthStore } from '../../core/auth/auth-store';

/** Erlaubt Buchstaben (inkl. Umlaute), Ziffern und Leerzeichen. */
const TITLE_PATTERN = /^[\p{L}0-9 ]+$/u;

interface BlogFormValue {
  title: string;
  content: string;
  category: string;
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
    MatSelectModule,
  ],
  templateUrl: './add-blog.html',
  styleUrl: './add-blog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddBlogPage {
  protected readonly authStore = inject(AuthStore);

  protected readonly blogModel = signal<BlogFormValue>({
    title: '',
    content: '',
    category: 'general',
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

    required(path.category, { message: 'Kategorie ist erforderlich' });
  });

  protected readonly submitted = signal(false);

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.blogForm, async () => {
      console.log(this.blogModel());
      this.submitted.set(true);
      return undefined;
    });
  }
}
