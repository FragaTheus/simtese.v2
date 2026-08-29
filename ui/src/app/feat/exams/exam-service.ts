import { inject, Injectable } from '@angular/core';
import { API_V1_URL } from '../../shared/api/config/api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateExamRequest {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  apiUrl = `${API_V1_URL}/exams`;
  private http = inject(HttpClient);

  create(request: CreateExamRequest): Observable<string> {
    return this.http.post<string>(this.apiUrl, request);
  }
}
