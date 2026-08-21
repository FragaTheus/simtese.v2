import { Component, computed, inject, signal } from '@angular/core';
import {
  AuditInfo,
  InfoPageLayout,
  LabelField,
} from '../../../shared/layouts/info-page-layout/info-page-layout';
import { ActivatedRoute } from '@angular/router';
import { ExamInfo, ExamService } from '../exam-service';
import { LoadingLayout } from '../../../shared/layouts/loading-layout/loading-layout';
import { ErrorLayout } from '../../../shared/layouts/error-layout/error-layout';
import { ChangeExamNameComponent } from '../change-exam-name-component/change-exam-name-component';

@Component({
  selector: 'app-exam-info-component',
  imports: [InfoPageLayout, LoadingLayout, ErrorLayout, ChangeExamNameComponent],
  templateUrl: './exam-info-component.html',
})
export class ExamInfoComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly examService = inject(ExamService);

  loading = signal(true);
  error = signal(false);

  exam = signal<ExamInfo | null>(null);

  fields = computed<LabelField[]>(() => {
    const exam = this.exam();

    if (!exam) {
      return [];
    }

    return [
      { label: 'Nome:', value: exam.name },
      { label: 'Status:', value: exam.active ? 'Ativo' : 'Inativo' },
    ];
  });

  audit = computed<AuditInfo | null>(() => {
    const exam = this.exam();

    if (!exam) {
      return null;
    }

    return {
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
      createdBy: exam.createdBy,
      updatedBy: exam.updatedBy,
    };
  });

  constructor() {
    this.loadExam();
  }

  loadExam(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(false);

    this.examService.info(id).subscribe({
      next: (exam) => {
        this.exam.set(exam);
        this.loading.set(false);
      },

      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }
}
