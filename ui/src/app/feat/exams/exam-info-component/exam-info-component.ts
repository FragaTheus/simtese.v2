import { Component, signal, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';
import { SkeletonModule } from 'primeng/skeleton';
import { ExamInfo, ExamService } from '../exam-service';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';
import { DatePipe } from '@angular/common';
import { EditExamComponent } from '../edit-exam-component/edit-exam-component';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-exam-info-component',
  imports: [
    CardModule,
    ButtonModule,
    DashPageLayout,
    SkeletonModule,
    ErrorComponent,
    RouterLink,
    DatePipe,
    EditExamComponent,
  ],
  templateUrl: './exam-info-component.html',
})
export class ExamInfoComponent {
  private examService = inject(ExamService);
  private actRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  exam = signal<ExamInfo | undefined>(undefined);
  id = this.actRoute.snapshot.paramMap.get('id');

  constructor() {
    this.loadExam();
  }

  loadExam() {
    this.loading.set(true);

    this.examService.info(this.id!).subscribe({
      next: (exam) => {
        this.exam.set(exam);
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
    this.loadExam();
  }
}
