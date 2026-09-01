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

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private http = inject(HttpClient);

  create(request: CreateExamRequest): Observable<string> {
    return this.http.post<string>(`${API_V1_URL}/exams`, request);
  }

  all(search?: string, active?: boolean): Observable<PageableResponse<ExamSummary>> {
    let params = new HttpParams().set('page', '0');

    if (search) params = params.set('search', search);
    if (active !== undefined) params = params.set('active', active.toString());

    return this.http.get<PageableResponse<ExamSummary>>(`${API_V1_URL}/exams`, { params });
  }

  info(targetId: string): Observable<ExamInfo> {
    return this.http.get<ExamInfo>(`${API_V1_URL}/exams/${targetId}`);
  }

  change(targetId: string, name: string): Observable<void> {
    return this.http.patch<void>(`${API_V1_URL}/exams/${targetId}/name`, { name });
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
