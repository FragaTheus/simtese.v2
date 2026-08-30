import { Component, inject, signal } from '@angular/core';
import { InfoPageLayout } from '../../../shared/components/layout/info-page-layout/info-page-layout';
import { RouterBackComponent } from '../../../shared/components/ui/router-back-component/router-back-component';
import { ExamInfo, ExamService } from '../exam-service';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import {
  AuditInfo,
  AuditoryComponent,
} from '../../../shared/components/ui/auditory-component/auditory-component';

interface Field {
  label: string;
  value: string;
}

@Component({
  selector: 'app-exam-info-component',
  imports: [InfoPageLayout, RouterBackComponent, CardModule, AuditoryComponent],
  templateUrl: './exam-info-component.html',
})
export class ExamInfoComponent {
  private examService = inject(ExamService);
  private router = inject(Router);
  private actRouter = inject(ActivatedRoute);
  exam = signal<ExamInfo | null>(null);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  targetId = this.actRouter.snapshot.paramMap.get('id') ?? '';
  fields: Field[] = [];
  auditInfo = signal<AuditInfo | undefined>(undefined);

  constructor() {
    this.loadExam();
  }

  loadExam() {
    this.loading.set(true);
    this.error.set(null);
    this.exam.set(null);
    this.auditInfo.set(undefined);

    this.examService.info(this.targetId).subscribe({
      next: (exam) => {
        this.exam.set(exam);
        this.loading.set(false);
        this.fields = [
          { label: 'Nome', value: exam.name },
          { label: 'Status', value: exam.active ? 'Ativo' : 'Inativo' },
        ];
        this.auditInfo.set({
          createdAt: exam.createdAt,
          updatedAt: exam.updatedAt,
          createdBy: exam.createdBy,
          updatedBy: exam.updatedBy,
        });
      },
      error: (err: ApiErrorResponse) => {
        this.error.set(err);
        this.loading.set(false);
      },
    });
  }

  retry() {
    this.loadExam();
  }

  cancel() {
    this.router.navigate(['/painel']);
  }

  back() {
    this.router.navigate(['/painel/exames']);
  }
}
