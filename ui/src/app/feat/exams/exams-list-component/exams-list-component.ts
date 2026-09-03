import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { ExamService, ExamSummary } from '../exam-service';
import { DashListPageLayout } from '../../../shared/components/layout/dash/dash-list-page-layout/dash-list-page-layout';
import { ApiErrorResponse, PageableResponse } from '../../../shared/api/type/api.type';
import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';
import { DashPageHeaderLayout } from '../../../shared/components/layout/dash/dash-page-header-layout/dash-page-header-layout';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DataView } from 'primeng/dataview';
import { CreateExamComponent } from '../create-exam-component/create-exam-component';

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
  ],
  templateUrl: './exams-list-component.html',
})
export class ExamsListComponent {
  private examService = inject(ExamService);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  pageableResponse = signal<PageableResponse<ExamSummary> | null>(null);

  constructor() {
    this.loadExams();
  }

  loadExams() {
    this.loading.set(true);
    this.error.set(null);

    this.examService.all().subscribe({
      next: (exams) => {
        this.pageableResponse.set(exams);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error);
        this.loading.set(false);
      },
    });
  }

  refresh() {
    window.location.reload();
  }
}
