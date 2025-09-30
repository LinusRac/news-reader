import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('news-reader');

  constructor(private router: Router) {}

  navigateToList(): void {
    this.router.navigate(['/list']);
  }
}
