import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_V1_URL } from '../../shared/api/config/api.config';

interface CreateExamRequest {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private http = inject(HttpClient);

  create(request: CreateExamRequest): Observable<string> {
    return this.http.post<string>(`${API_V1_URL}/exams`, request);
  }
}
