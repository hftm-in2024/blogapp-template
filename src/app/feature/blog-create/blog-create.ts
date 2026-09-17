import { Component, signal } from '@angular/core';
import {
  form,
  FormField,
  submit,
  required,
  minLength,
  maxLength,
  validate,
} from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-create',
  standalone: true,
  imports: [FormField, RouterLink],
  templateUrl: './blog-create.html',
  styleUrl: './blog-create.scss',
})
export class BlogCreate {
  blogModel = signal({
    title: '',
    content: '',
    category: 'general',
  });

  blogForm = form(this.blogModel, (s) => {
    // --------------------
    // Title
    // --------------------

    required(s.title, {
      message: 'Titel ist erforderlich',
    });

    minLength(s.title, 3, {
      message: 'Mindestens 3 Zeichen',
    });

    maxLength(s.title, 100, {
      message: 'Maximal 100 Zeichen',
    });

    validate(s.title, ({ value }) => {
      const regex = /^[A-Za-zÀ-ÿ0-9 ]+$/;

      if (!regex.test(value())) {
        return {
          kind: 'invalidCharacters',
          message: 'Der Titel darf nur Buchstaben, Zahlen und Leerzeichen enthalten.',
        };
      }

      return null;
    });

    // --------------------
    // Content
    // --------------------

    required(s.content, {
      message: 'Inhalt ist erforderlich',
    });

    minLength(s.content, 10, {
      message: 'Mindestens 10 Zeichen',
    });

    validate(s.content, ({ value, valueOf }) => {
      const title = valueOf(s.title);

      if (value().length < title.length * 2) {
        return {
          kind: 'contentTooShort',
          message: 'Der Inhalt muss mindestens doppelt so lang sein wie der Titel.',
        };
      }

      return null;
    });

    // --------------------
    // Category
    // --------------------

    required(s.category, {
      message: 'Kategorie ist erforderlich',
    });
  });

  onSubmit(event: Event): void {
    event.preventDefault();

    submit(this.blogForm, async () => {
      console.log(this.blogModel());
    });
  }
}
