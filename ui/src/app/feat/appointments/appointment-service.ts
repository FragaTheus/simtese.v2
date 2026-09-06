import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_V1_URL } from '../../shared/api/config/api.config';
import { PageableResponse } from '../../shared/api/type/api.type';

export type Shift = 'MORNING' | 'AFTERNOON';

export type ExamStatus = 'SCHEDULED' | 'ATTENDED' | 'RELEASED';

export type ExamType =
  'PRE_EMPLOYMENT' | 'TERMINATION' | 'PERIODIC' | 'RETURN_TO_WORK' | 'SPECIFIC_EVALUATION';

export interface CreateAppointmentRequest {
  employeeName: string;
  employeeCpf: string;
  enterpriseName: string;
  enterpriseCnpj: string;
  shift?: Shift;
  examType?: ExamType;
  examIds?: string[];
  observation?: string;
}

export interface AppointmentSummary {
  id: string;
  employeeName: string;
  enterpriseName: string;
}

export interface AppointmentInfo {
  id: string;
  employeeName: string;
  employeeCpf: string;
  enterpriseName: string;
  enterpriseCnpj: string;
  shift: Shift;
  examStatus: ExamStatus;
  examType: ExamType;
  obs: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface AppointmentsParams {
  search?: string;
  shift?: Shift;
  examStatus?: ExamStatus;
  page?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private http = inject(HttpClient);

  all(params: AppointmentsParams = {}): Observable<PageableResponse<AppointmentSummary>> {
    let httpParams = new HttpParams();

    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }

    if (params.shift !== undefined) {
      httpParams = httpParams.set('shift', params.shift);
    }

    if (params.examStatus !== undefined) {
      httpParams = httpParams.set('examStatus', params.examStatus);
    }

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<PageableResponse<AppointmentSummary>>(`${API_V1_URL}/appointments`, {
      params: httpParams,
    });
  }

  info(targetId: string): Observable<AppointmentInfo> {
    return this.http.get<AppointmentInfo>(`${API_V1_URL}/appointments/${targetId}`);
  }

  create(request: CreateAppointmentRequest): Observable<string> {
    return this.http.post<string>(`${API_V1_URL}/appointments/schedule`, request);
  }

  attend(targetId: string): Observable<void> {
    return this.http.patch<void>(`${API_V1_URL}/appointments/${targetId}/attend`, {});
  }

  release(targetId: string): Observable<void> {
    return this.http.patch<void>(`${API_V1_URL}/appointments/${targetId}/release`, {});
  }

  delete(targetId: string): Observable<void> {
    return this.http.delete<void>(`${API_V1_URL}/appointments/${targetId}`);
  }
}
