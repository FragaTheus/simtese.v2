import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_V1_URL } from '../../shared/api/config/api.config';
import { Observable, tap } from 'rxjs';

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
export class AuthService {
  private http = inject(HttpClient);

  login(request: LoginRequest): Observable<HttpResponse<void>> {
    return this.http.post<void>(`${API_V1_URL}/auth`, request, { observe: 'response' }).pipe(
      tap((response) => {
        const auth = response.headers.get('Authorization');

        if (auth) {
          localStorage.setItem('accessToken', auth);
        }
      }),
    );
  }

  me(): Observable<HttpResponse<AuthResponse>> {
    return this.http.get<AuthResponse>(`${API_V1_URL}/auth`, { observe: 'response' });
  }
}
