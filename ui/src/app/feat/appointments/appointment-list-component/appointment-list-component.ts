import { Component, effect, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import {
  AppointmentService,
  AppointmentsParams,
  AppointmentSummary,
  ExamStatus,
  Shift,
} from '../appointment-service';
import { CreateAppointmentComponent } from '../create/create-appointment-component/create-appointment-component';
import { DashListPageLayout } from '../../../shared/components/layout/dash/dash-list-page-layout/dash-list-page-layout';
import { ApiErrorResponse, PageableResponse } from '../../../shared/api/type/api.type';
import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';
import { DashPageHeaderLayout } from '../../../shared/components/layout/dash/dash-page-header-layout/dash-page-header-layout';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DataView, DataViewPageEvent } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../auth/auth-service';

interface ShiftOption {
  label: string;
  shift: Shift | undefined;
}

interface ExamStatusOption {
  label: string;
  examStatus: ExamStatus | undefined;
}

@Component({
  selector: 'app-appointment-list-component',
  imports: [
    SkeletonModule,
    DashListPageLayout,
    DashPageLayout,
    DashPageHeaderLayout,
    ErrorComponent,
    RouterLink,
    DataView,
    CreateAppointmentComponent,
    ButtonModule,
    RouterLink,
    InputTextModule,
    FloatLabelModule,
    TooltipModule,
    FormsModule,
    SelectModule,
  ],
  templateUrl: './appointment-list-component.html',
})
export class AppointmentListComponent {
  private appointmentService = inject(AppointmentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  pageableResponse = signal<PageableResponse<AppointmentSummary> | null>(null);
  params = signal<AppointmentsParams>(this.paramsFromQuery());
  shiftOptions: ShiftOption[] = [
    { label: 'Todos', shift: undefined },
    { label: 'Manhã', shift: 'MORNING' },
    { label: 'Tarde', shift: 'AFTERNOON' },
  ];
  examStatusOptions: ExamStatusOption[] = [
    { label: 'Todos', examStatus: undefined },
    { label: 'Agendado', examStatus: 'SCHEDULED' },
    { label: 'Atendido', examStatus: 'ATTENDED' },
    { label: 'Liberado', examStatus: 'RELEASED' },
  ];

  constructor() {
    effect(() => this.syncQueryParams(this.params()));

    this.loadAppointments();
  }

  private paramsFromQuery(): AppointmentsParams {
    const qp = this.route.snapshot.queryParamMap;

    return {
      search: qp.get('search') ?? undefined,
      shift: (qp.get('shift') as Shift | null) ?? undefined,
      examStatus: (qp.get('examStatus') as ExamStatus | null) ?? undefined,
      page: qp.has('page') ? Number(qp.get('page')) : undefined,
    };
  }

  private syncQueryParams(params: AppointmentsParams) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: params.search || null,
        shift: params.shift || null,
        examStatus: params.examStatus || null,
        page: params.page || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  loadAppointments() {
    this.loading.set(true);
    this.error.set(null);

    this.appointmentService.all(this.params()).subscribe({
      next: (appointments) => {
        this.pageableResponse.set(appointments);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiErrorResponse;
        this.error.set(apiError);
        this.loading.set(false);
      },
    });
  }

  onSearch() {
    this.params.update((p) => ({
      ...p,
      search: this.params().search,
      page: 0,
    }));

    this.loadAppointments();
  }

  onShift(shift?: Shift) {
    this.params.update((p) => ({ ...p, shift, page: 0 }));
    this.loadAppointments();
  }

  onExamStatus(examStatus?: ExamStatus) {
    this.params.update((p) => ({ ...p, examStatus, page: 0 }));
    this.loadAppointments();
  }

  changePage(event: DataViewPageEvent) {
    const page = event.first / event.rows;

    this.params.update((p) => ({
      ...p,
      page,
    }));

    this.loadAppointments();
  }

  refresh() {
    this.loadAppointments();
  }
}
