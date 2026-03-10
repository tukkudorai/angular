import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterModule], // Required for nested routing
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent {}