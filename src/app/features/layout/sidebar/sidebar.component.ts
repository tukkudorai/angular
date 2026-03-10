import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LayoutService } from '../../../core/services/layout.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styles: [`
    .hover-bg:hover { background-color: rgba(0, 0, 0, 0.08); transition: 0.2s; }
    .cursor-pointer { cursor: pointer; }
    .dropdown-shadow { box-shadow: 0 0 15px rgba(0,0,0,0.1); }
  `]
})
export class SidebarComponent {
  layoutService = inject(LayoutService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isMenuOpen: boolean = false;

  // Fetch the logged-in user dynamically to display in the UI
  get currentUser() {
    return this.authService.currentUser;
  }

  openCompose() {
    this.layoutService.toggleComposer(true);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen = false; // Close menu on logout
    this.router.navigate(['/auth/login']); 
  }
}