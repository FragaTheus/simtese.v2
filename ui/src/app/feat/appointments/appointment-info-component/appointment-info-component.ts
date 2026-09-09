import { Component, signal, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';
import { DashPageHeaderLayout } from '../../../shared/components/layout/dash/dash-page-header-layout/dash-page-header-layout';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';
import { AuditInfoComponent } from '../../../shared/components/ui/audit-info-component/audit-info-component';
import {
  AppointmentInfo,
  AppointmentService,
  ExamStatus,
  ExamType,
  Shift,
} from '../appointment-service';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { ManageAppointmentComponent } from '../manage-appointment-component/manage-appointment-component';
import { DocumentFormatPipe } from '../../../shared/pipes/document-format-pipe';
import { AuthService } from '../../auth/auth-service';
import { CreateResultComponent } from '../../results/create-result-component/create-result-component';

const SHIFT_LABELS: Record<Shift, string> = {
  MORNING: 'Manhã',
  AFTERNOON: 'Tarde',
};

const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  PRE_EMPLOYMENT: 'Admissional',
  TERMINATION: 'Demissional',
  PERIODIC: 'Periódico',
  RETURN_TO_WORK: 'Retorno ao Trabalho',
  SPECIFIC_EVALUATION: 'Avaliação Específica',
};

const EXAM_STATUS_LABELS: Record<ExamStatus, string> = {
  SCHEDULED: 'Agendado',
  ATTENDED: 'Atendido',
  RELEASED: 'Liberado',
};

const EXAM_STATUS_STYLES: Record<ExamStatus, string> = {
  SCHEDULED: 'bg-yellow-50 text-yellow-600',
  ATTENDED: 'bg-blue-50 text-blue-600',
  RELEASED: 'bg-green-50 text-green-500',
};

@Component({
  selector: 'app-appointment-info-component',
  imports: [
    CardModule,
    ButtonModule,
    DashPageLayout,
    DashPageHeaderLayout,
    SkeletonModule,
    TooltipModule,
    NgTemplateOutlet,
    ErrorComponent,
    RouterLink,
    AuditInfoComponent,
    ManageAppointmentComponent,
    DocumentFormatPipe,
  ],
  templateUrl: './appointment-info-component.html',
})
export class AppointmentInfoComponent {
  private appointmentService = inject(AppointmentService);
  private actRoute = inject(ActivatedRoute);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  appointment = signal<AppointmentInfo | undefined>(undefined);
  id = this.actRoute.snapshot.paramMap.get('id');
  shiftLabels = SHIFT_LABELS;
  examTypeLabels = EXAM_TYPE_LABELS;
  examStatusLabels = EXAM_STATUS_LABELS;
  examStatusStyles = EXAM_STATUS_STYLES;
  copiedField = signal<string | null>(null);
  exams = signal<string[]>([]);

  constructor() {
    this.loadAppointment();
  }

  loadAppointment() {
    this.loading.set(true);

    this.appointmentService.info(this.id!).subscribe({
      next: (appointment) => {
        this.appointment.set(appointment);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiErrorResponse;
        this.error.set(apiError);
        this.loading.set(false);
      },
    });
  }

  retry() {
    this.loadAppointment();
  }

  copy(field: string, value: string): void {
    navigator.clipboard.writeText(value);
    this.copiedField.set(field);
    setTimeout(() => {
      if (this.copiedField() === field) this.copiedField.set(null);
    }, 1500);
  }

  onExamsLoaded(exams: string[]) {
    this.exams.set(exams);
  }
}
