import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_V1_URL } from '../../shared/api/config/api.config';
import { PageableResponse } from '../../shared/api/type/api.type';

export type Role = 'ADMIN' | 'NURSE' | 'RECEPTIONIST' | 'ENTERPRISE';

interface CreateAccountRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: Role;
}

interface ChangePasswordRequest {
  password: string;
  confirmPassword: string;
}

interface ProfileChangePasswordRequest {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export interface AccountSummary {
  id: string;
  name: string;
  email: string;
}

export interface AccountInfo {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface AccountsParams {
  search?: string;
  role?: Role;
  active?: boolean;
  page?: number;
}

export interface AvailableEnterpriseAccountsParams {
  search?: string;
  page?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);

  all(params: AccountsParams = {}): Observable<PageableResponse<AccountSummary>> {
    let httpParams = new HttpParams();

    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }

    if (params.active !== undefined) {
      httpParams = httpParams.set('active', params.active.toString());
    }

    if (params.role !== undefined) {
      httpParams = httpParams.set('role', params.role);
    }

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<PageableResponse<AccountSummary>>(`${API_V1_URL}/accounts`, {
      params: httpParams,
    });
  }

  info(targetId: string): Observable<AccountInfo> {
    return this.http.get<AccountInfo>(`${API_V1_URL}/accounts/${targetId}`);
  }

  availableEnterpriseAccounts(
    params: AvailableEnterpriseAccountsParams = {},
  ): Observable<PageableResponse<AccountSummary>> {
    let httpParams = new HttpParams();

    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<PageableResponse<AccountSummary>>(
      `${API_V1_URL}/accounts/enterprise/available`,
      { params: httpParams },
    );
  }

  create(request: CreateAccountRequest): Observable<string> {
    return this.http.post<string>(`${API_V1_URL}/accounts`, request);
  }

  changeName(targetId: string, name: string): Observable<void> {
    return this.http.patch<void>(`${API_V1_URL}/accounts/${targetId}/name`, { name });
  }

  changePassword(targetId: string, request: ChangePasswordRequest): Observable<void> {
    return this.http.patch<void>(`${API_V1_URL}/accounts/${targetId}/password`, request);
  }

  activate(targetId: string): Observable<void> {
    return this.http.patch<void>(`${API_V1_URL}/accounts/${targetId}/activate`, {});
  }

  deactivate(targetId: string): Observable<void> {
    return this.http.patch<void>(`${API_V1_URL}/accounts/${targetId}/deactivate`, {});
  }

  delete(targetId: string): Observable<void> {
    return this.http.delete<void>(`${API_V1_URL}/accounts/${targetId}`);
  }

  me(): Observable<AccountInfo> {
    return this.http.get<AccountInfo>(`${API_V1_URL}/me`);
  }

  changeMyName(name: string): Observable<void> {
    return this.http.patch<void>(`${API_V1_URL}/me/name`, { name });
  }

  changeMyPassword(request: ProfileChangePasswordRequest): Observable<void> {
    return this.http.patch<void>(`${API_V1_URL}/me/password`, request);
  }
}
