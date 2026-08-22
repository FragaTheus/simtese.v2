import { Component, computed, inject, signal } from '@angular/core';
import {
  AuditInfo,
  InfoPageLayout,
  LabelField,
} from '../../../shared/layouts/info-page-layout/info-page-layout';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamInfo, ExamService } from '../exam-service';
import { LoadingLayout } from '../../../shared/layouts/loading-layout/loading-layout';
import { ErrorLayout } from '../../../shared/layouts/error-layout/error-layout';
import { ChangeExamNameComponent } from '../change-exam-name-component/change-exam-name-component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { ToggleStatusComponent } from '../../../shared/components/ui/toggle-status-component/toggle-status-component';

@Component({
  selector: 'app-exam-info-component',
  imports: [
    InfoPageLayout,
    LoadingLayout,
    ErrorLayout,
    ChangeExamNameComponent,
    ConfirmPopupModule,
    ButtonModule,
    ToggleStatusComponent,
  ],
  templateUrl: './exam-info-component.html',
})
export class ExamInfoComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly examService = inject(ExamService);
  id = this.route.snapshot.paramMap.get('id');
  private readonly router = inject(Router);

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
    if (!this.id) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(false);

    this.examService.info(this.id).subscribe({
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

  deactivateExam = () => {
    if (!this.id) return;

    this.examService.deactivate(this.id).subscribe({
      next: () => {
        this.exam.update((exam) => (exam ? { ...exam, active: false } : exam));
      },
    });
  };

  activateExam = () => {
    if (!this.id) return;

    this.examService.activate(this.id).subscribe({
      next: () => {
        this.exam.update((exam) => (exam ? { ...exam, active: true } : exam));
      },
    });
  };

  removeExam = () => {
    if (!this.id) return;

    this.examService.delete(this.id).subscribe({
      next: () => {
        this.router.navigate(['/exames']);
      },
    });
  };
}
