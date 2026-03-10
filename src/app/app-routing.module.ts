import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutComponent } from './features/auth/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { MainLayoutComponent } from './features/layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard'; 

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { 
    path: 'auth', 
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard], 
    children: [
      { 
        path: 'feed', 
        loadComponent: () => import('./features/feed/feed.component').then(m => m.FeedComponent) 
      },
      { 
        path: 'search', 
        loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent) 
      }
    ]
  },
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }