import { inject, Injectable } from '@angular/core';
import { API_V1_PREFIX, BACKEND_URL } from '../../core/config/api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChangeNameRequest {
  name: string;
}

export interface ProfileChangePasswordRequest {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export interface AccountInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  profileUrl = `${BACKEND_URL}${API_V1_PREFIX}/me`;
  accountUrl = `${BACKEND_URL}${API_V1_PREFIX}/accounts`;
  http = inject(HttpClient);

  //Profile
  profileChangePassword(request: ProfileChangePasswordRequest): void {
    this.http.patch<void>(`${this.profileUrl}/password`, request).subscribe();
  }

  profileInfo(): Observable<AccountInfo> {
    return this.http.get<AccountInfo>(this.profileUrl);
  }

  //Accounts

  //Global
  changeName(request: ChangeNameRequest): Observable<void> {
    return this.http.patch<void>(`${this.profileUrl}/name`, request);
  }

  accountInfo(targetId: string): Observable<AccountInfo> {
    return this.http.get<AccountInfo>(`${this.accountUrl}/${targetId}`);
  }
}
