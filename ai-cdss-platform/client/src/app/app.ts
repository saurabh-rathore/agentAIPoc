import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <a routerLink="/diagnosis">Diagnosis Screen</a>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class App {
}
