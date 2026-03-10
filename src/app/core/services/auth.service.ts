import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap, of, throwError, BehaviorSubject } from 'rxjs';
import { UserRegistrationDto, AuthResponseDto } from '../../shared/models/user.dto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  get currentUser() {
    if (!this.currentUserSubject.value) {
      const stored = localStorage.getItem('current_user');
      if (stored) {
        this.currentUserSubject.next(JSON.parse(stored));
      }
    }
    return this.currentUserSubject.value;
  }

  register(data: UserRegistrationDto): Observable<any> {
    const newUser = {
      ...data,
      username: data.email.split('@')[0],
      profilePictureUrl: `https://ui-avatars.com/api/?name=${data.firstName}&background=random&color=fff`
    };
    return this.http.post(this.apiUrl, newUser);
  }

  login(credentials: any): Observable<AuthResponseDto> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${credentials.email}`).pipe(
      switchMap(users => {
        if (users.length > 0 && users[0].password === credentials.password) {
          const user = users[0];
          const mockResponse: AuthResponseDto = {
            token: 'mock-jwt-token-for-' + user.id,
            userId: user.id,
            username: user.username
          };
          
          localStorage.setItem('auth_token', mockResponse.token);
          localStorage.setItem('current_user', JSON.stringify(user));
          this.currentUserSubject.next(user);
          
          return of(mockResponse);
        }
        return throwError(() => ({ error: { message: 'Invalid credentials' } }));
      })
    );
  }

  logout(): void {
    localStorage.clear(); 
    this.currentUserSubject.next(null);
  }
}