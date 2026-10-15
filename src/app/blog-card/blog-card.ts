import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

/**
 * @title Card overview
 */
@Component({
  selector: 'blog-card',
  templateUrl: 'blog-card.html',
  styleUrl: 'blog-card.scss',
  imports: [MatCardModule, MatButtonModule],
})
export class BlogCard {}
