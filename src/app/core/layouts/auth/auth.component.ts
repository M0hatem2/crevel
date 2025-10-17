import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div>
      <div class="auth-container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class AuthComponent {}
