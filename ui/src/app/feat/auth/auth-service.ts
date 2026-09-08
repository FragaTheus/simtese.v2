import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { API_V1_URL } from '../../shared/api/config/api.config';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  user = signal<AuthResponse | null>(null);

  login(request: LoginRequest): Observable<HttpResponse<AuthResponse>> {
    return this.http
      .post<AuthResponse>(`${API_V1_URL}/auth`, request, { observe: 'response' })
      .pipe(
        tap((response) => {
          const auth = response.headers.get('Authorization');

          if (auth) {
            localStorage.setItem('accessToken', auth);
          }

          this.user.set(response.body);
        }),
      );
  }

  me(): Observable<HttpResponse<AuthResponse>> {
    return this.http
      .get<AuthResponse>(`${API_V1_URL}/auth`, {
        observe: 'response',
      })
      .pipe(
        tap((response) => {
          this.user.set(response.body);
        }),
      );
  }

  serverLogout(): Observable<void> {
    return this.http.delete<void>(`${API_V1_URL}/auth`);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/entrar']);
    this.serverLogout().subscribe();
    this.user.set(null);
  }
}
