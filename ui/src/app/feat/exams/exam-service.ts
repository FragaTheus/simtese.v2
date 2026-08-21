import { inject, Injectable } from '@angular/core';
import { API_V1_PREFIX, BACKEND_URL } from '../../core/config/api.config';
import { HttpClient } from '@angular/common/http';
import { Page } from '../../core/type/page.type';

export interface ExamRequest {
  name: string;
}

export interface ExamSummary {
  id: string;
  active: boolean;
  name: string;
}

export interface ExamInfo {
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ExamListParams {
  search?: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private readonly http = inject(HttpClient);
  private readonly examUrl = `${BACKEND_URL}${API_V1_PREFIX}/exams`;

  info(targetId: string) {
    return this.http.get<ExamInfo>(`${this.examUrl}/${targetId}`);
  }

  list(params: ExamListParams = {}) {
    return this.http.get<Page<ExamSummary>>(this.examUrl, {
      params: {
        ...(params.search ? { search: params.search } : {}),
        ...(params.active !== undefined ? { active: params.active } : {}),
      },
    });
  }

  create(request: ExamRequest) {
    return this.http.post<string>(this.examUrl, request);
  }

  change(request: ExamRequest, targetId: string) {
    return this.http.patch<void>(`${this.examUrl}/${targetId}/name`, request);
  }

  deactivate(targetId: string) {
    return this.http.put<void>(`${this.examUrl}/${targetId}/deactivate`, {});
  }

  activate(targetId: string) {
    return this.http.put<void>(`${this.examUrl}/${targetId}/activate`, {});
  }

  delete(targetId: string) {
    return this.http.delete<void>(`${this.examUrl}/${targetId}`);
  }
}
