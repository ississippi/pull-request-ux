import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container py-4">
      <h1 class="mb-4">Open Pull Requests</h1>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class AppComponent { }
