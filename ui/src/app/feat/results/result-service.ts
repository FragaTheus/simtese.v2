import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_V1_URL } from '../../shared/api/config/api.config';
import { PageableResponse } from '../../shared/api/type/api.type';

export interface CreateResultRequest {
  apt: boolean;
  file: File;
}

export interface CreateResultUnlinkedRequest {
  employeeName: string;
  employeeCpf: string;
  apt: boolean;
  file: File;
}

export interface ResultSummary {
  id: string;
  employeeName: string;
  enterpriseName: string;
  apt: boolean;
}

export interface ResultInfo {
  resultId: string;
  employeeName: string;
  employeeCpf: string;
  enterpriseName: string;
  enterpriseCnpj: string;
  apt: boolean;
}

export interface ResultsParams {
  search?: string;
  apt?: boolean;
  page?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  private http = inject(HttpClient);

  create(appointmentId: string, request: CreateResultRequest): Observable<string> {
    const formData = new FormData();

    formData.append('apt', request.apt.toString());
    formData.append('file', request.file);

    return this.http.post(`${API_V1_URL}/results/${appointmentId}`, formData, {
      responseType: 'text',
    });
  }

  createUnlinked(enterpriseId: string, request: CreateResultUnlinkedRequest): Observable<string> {
    console.log('Creating unlinked result for enterpriseId:', enterpriseId);
    console.log('Request data:', request);
    const formData = new FormData();

    formData.append('employeeName', request.employeeName);
    formData.append('employeeCpf', request.employeeCpf);
    formData.append('apt', request.apt.toString());
    formData.append('file', request.file);

    return this.http.post(`${API_V1_URL}/results/unlinked/${enterpriseId}`, formData, {
      responseType: 'text',
    });
  }

  all(params: ResultsParams = {}): Observable<PageableResponse<ResultSummary>> {
    let httpParams = new HttpParams();

    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }

    if (params.apt !== undefined) {
      httpParams = httpParams.set('apt', params.apt.toString());
    }

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<PageableResponse<ResultSummary>>(`${API_V1_URL}/results`, {
      params: httpParams,
    });
  }

  info(resultId: string): Observable<ResultInfo> {
    return this.http.get<ResultInfo>(`${API_V1_URL}/results/${resultId}`);
  }

  file(resultId: string): Observable<Blob> {
    return this.http.get(`${API_V1_URL}/results/${resultId}/file`, {
      responseType: 'blob',
    });
  }

  delete(resultId: string): Observable<void> {
    return this.http.delete<void>(`${API_V1_URL}/results/${resultId}`);
  }

  findAllByEnterpriseId(
    enterpriseId: string,
    params: ResultsParams = {},
  ): Observable<PageableResponse<ResultSummary>> {
    let httpParams = new HttpParams();

    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }

    if (params.apt !== undefined) {
      httpParams = httpParams.set('apt', params.apt.toString());
    }

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<PageableResponse<ResultSummary>>(
      `${API_V1_URL}/results/enterprise/${enterpriseId}`,
      {
        params: httpParams,
      },
    );
  }
}
