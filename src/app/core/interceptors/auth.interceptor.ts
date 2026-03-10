import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token'); // Simple session management [cite: 44]
  const router = inject(Router);

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        // Handle unauthorized access 
        localStorage.removeItem('auth_token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
