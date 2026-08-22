import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { BACKEND_URL, API_V1_PREFIX } from '../core/config/api.config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  meId: string;
  meName: string;
  meEmail: string;
  meRole: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly authUrl = `${BACKEND_URL}${API_V1_PREFIX}/auth`;

  login(request: LoginRequest) {
    return this.http.post<void>(this.authUrl, request, { observe: 'response' }).pipe(
      tap((response) => {
        const token = response.headers.get('Authorization');

        if (token) {
          localStorage.setItem('accessToken', token);
        }
      }),
    );
  }

  me() {
    return this.http.get<AuthResponse>(`${this.authUrl}`);
  }

  logout() {
    localStorage.removeItem('accessToken');
  }
}
