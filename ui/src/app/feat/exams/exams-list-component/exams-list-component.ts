import { Component, effect, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { ExamService, ExamsParams, ExamSummary } from '../exam-service';
import { DashListPageLayout } from '../../../shared/components/layout/dash/dash-list-page-layout/dash-list-page-layout';
import { ApiErrorResponse, PageableResponse } from '../../../shared/api/type/api.type';
import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';
import { DashPageHeaderLayout } from '../../../shared/components/layout/dash/dash-page-header-layout/dash-page-header-layout';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DataView, DataViewPageEvent } from 'primeng/dataview';
import { CreateExamComponent } from '../create-exam-component/create-exam-component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../auth/auth-service';

interface ActiveOption {
  label: string;
  active: boolean | undefined;
}

@Component({
  selector: 'app-exams-list-component',
  imports: [
    SkeletonModule,
    DashListPageLayout,
    DashPageLayout,
    DashPageHeaderLayout,
    ErrorComponent,
    RouterLink,
    DataView,
    CreateExamComponent,
    ButtonModule,
    RouterLink,
    InputTextModule,
    FloatLabelModule,
    TooltipModule,
    FormsModule,
    SelectModule,
  ],
  templateUrl: './exams-list-component.html',
})
export class ExamsListComponent {
  private examService = inject(ExamService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  pageableResponse = signal<PageableResponse<ExamSummary> | null>(null);
  params = signal<ExamsParams>(this.paramsFromQuery());
  activeOptions: ActiveOption[] = [
    {
      label: 'Todos',
      active: undefined,
    },
    {
      label: 'Ativos',
      active: true,
    },
    {
      label: 'Inativos',
      active: false,
    },
  ];

  selectedOption: ActiveOption | undefined;

  constructor() {
    effect(() => this.syncQueryParams(this.params()));

    this.loadExams();
  }

  private paramsFromQuery(): ExamsParams {
    const qp = this.route.snapshot.queryParamMap;

    return {
      search: qp.get('search') ?? undefined,
      active: qp.has('active') ? qp.get('active') === 'true' : undefined,
      page: qp.has('page') ? Number(qp.get('page')) : undefined,
    };
  }

  private syncQueryParams(params: ExamsParams) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: params.search || null,
        active: params.active === undefined ? null : params.active,
        page: params.page || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  loadExams() {
    const requestParams = this.params();

    console.info('[ExamsList] GET /exams request', requestParams);
    this.loading.set(true);
    this.error.set(null);

    this.examService.all(requestParams).subscribe({
      next: (exams) => {
        console.info('[ExamsList] GET /exams response', {
          requestParams,
          response: exams,
          pageNumber: exams?.number,
          totalPages: exams?.totalPages,
          totalElements: exams?.totalElements,
          size: exams?.size,
          contentCount: Array.isArray(exams?.content) ? exams.content.length : null,
        });
        this.pageableResponse.set(exams);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('[ExamsList] GET /exams error', {
          requestParams,
          status: err.status,
          error: err.error,
        });
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

    this.loadExams();
  }

  onActive(active?: boolean) {
    this.params.update((p) => ({ ...p, active, page: 0 }));
    this.loadExams();
  }

  changePage(event: DataViewPageEvent) {
    const page = event.first / event.rows;

    console.info('[ExamsList] DataView page event', {
      first: event.first,
      rows: event.rows,
      requestedPage: page,
    });

    this.params.update((p) => ({
      ...p,
      page,
    }));

    this.loadExams();
  }

  refresh() {
    this.loadExams();
  }
}
