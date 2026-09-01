import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamService } from '../exam-service';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { HttpErrorResponse } from '@angular/common/http';
import { InputPageLayout } from '../../../shared/components/layout/input-page-layout/input-page-layout';

@Component({
  selector: 'app-create-exam-component',
  imports: [FloatLabelModule, InputTextModule, ReactiveFormsModule, InputPageLayout],
  templateUrl: './create-exam-component.html',
})
export class CreateExamComponent {
  private examService = inject(ExamService);
  private fb = inject(FormBuilder);
  loading = signal<boolean>(false);
  success = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  id = signal<string>('');
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  successRoute = computed(() => `/exames/${this.id()}`);
  errorMessage = computed(() =>
    this.error() ? this.error()!.message || 'Ocorreu um erro ao cadastrar o exame.' : null,
  );

  create() {
    this.loading.set(true);
    this.success.set(false);
    this.error.set(null);

    this.examService.create(this.form.getRawValue()).subscribe({
      next: (id) => {
        this.success.set(true);
        this.loading.set(false);
        this.id.set(id);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error);
        this.loading.set(false);
      },
    });
  }
}
