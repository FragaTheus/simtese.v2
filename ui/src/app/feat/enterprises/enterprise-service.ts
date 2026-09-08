import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_V1_URL } from '../../shared/api/config/api.config';
import { PageableResponse } from '../../shared/api/type/api.type';

interface CreateEnterpriseRequest {
  name: string;
  cnpj: string;
}

interface ChangeEnterpriseNameRequest {
  name: string;
}

export interface EnterpriseSummary {
  id: string;
  name: string;
  cnpj: string;
}

export interface EnterpriseInfo {
  id: string;
  name: string;
  cnpj: string;
  linkedAccountName: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface EnterprisesParams {
  search?: string;
  active?: boolean;
  page?: number;
}

@Injectable({
  providedIn: 'root',
})
export class EnterpriseService {
  private http = inject(HttpClient);

  create(request: CreateEnterpriseRequest): Observable<string> {
    return this.http.post<string>(`${API_V1_URL}/enterprises`, request);
  }

  all(params: EnterprisesParams = {}): Observable<PageableResponse<EnterpriseSummary>> {
    let httpParams = new HttpParams();

    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }

    if (params.active !== undefined) {
      httpParams = httpParams.set('active', params.active.toString());
    }

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<PageableResponse<EnterpriseSummary>>(`${API_V1_URL}/enterprises`, {
      params: httpParams,
    });
  }

  info(targetId: string): Observable<EnterpriseInfo> {
    console.log(targetId);
    return this.http.get<EnterpriseInfo>(`${API_V1_URL}/enterprises/${targetId}`);
  }

  change(targetId: string, request: ChangeEnterpriseNameRequest): Observable<void> {
    return this.http.patch<void>(`${API_V1_URL}/enterprises/${targetId}/name`, request);
  }

  activate(targetId: string): Observable<void> {
    return this.http.patch<void>(`${API_V1_URL}/enterprises/${targetId}/activate`, {});
  }

  deactivate(targetId: string): Observable<void> {
    return this.http.patch<void>(`${API_V1_URL}/enterprises/${targetId}/deactivate`, {});
  }

  linkAccount(targetId: string, accountId: string): Observable<void> {
    return this.http.patch<void>(`${API_V1_URL}/enterprises/${targetId}/link/${accountId}`, {});
  }

  unlinkAccount(targetId: string): Observable<void> {
    return this.http.patch<void>(`${API_V1_URL}/enterprises/${targetId}/unlink`, {});
  }

  delete(targetId: string): Observable<void> {
    return this.http.delete<void>(`${API_V1_URL}/enterprises/${targetId}`);
  }

  linkedAccounts(accountId: string): Observable<EnterpriseSummary[]> {
    return this.http.get<EnterpriseSummary[]>(`${API_V1_URL}/enterprises/account/${accountId}`);
  }
}
