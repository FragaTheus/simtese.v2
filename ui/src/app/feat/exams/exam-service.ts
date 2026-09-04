import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_V1_URL } from '../../shared/api/config/api.config';
import { PageableResponse } from '../../shared/api/type/api.type';

interface CreateExamRequest {
  name: string;
}

export interface ExamSummary {
  id: string;
  name: string;
  active: boolean;
}

export interface ExamInfo {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ExamsParams {
  search?: string;
  active?: boolean;
  page?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private http = inject(HttpClient);

  create(request: CreateExamRequest): Observable<string> {
    return this.http.post<string>(`${API_V1_URL}/exams`, request);
  }

  all(params: ExamsParams = {}): Observable<PageableResponse<ExamSummary>> {
    let httpParams = new HttpParams();

    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }

    if (params?.active !== undefined) {
      httpParams = httpParams.set('active', params.active.toString());
    }

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<PageableResponse<ExamSummary>>(`${API_V1_URL}/exams`, {
      params: httpParams,
    });
  }

  info(targetId: string): Observable<ExamInfo> {
    return this.http.get<ExamInfo>(`${API_V1_URL}/exams/${targetId}`);
  }

  change(targetId: string, request: CreateExamRequest): Observable<void> {
    return this.http.patch<void>(`${API_V1_URL}/exams/${targetId}/name`, request);
  }

  activate(targetId: string): Observable<void> {
    return this.http.put<void>(`${API_V1_URL}/exams/${targetId}/activate`, {});
  }

  deactivate(targetId: string): Observable<void> {
    return this.http.put<void>(`${API_V1_URL}/exams/${targetId}/deactivate`, {});
  }

  delete(targetId: string): Observable<void> {
    return this.http.delete<void>(`${API_V1_URL}/exams/${targetId}`);
  }
}
