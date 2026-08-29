import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { ExamService } from '../exam-service';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';

@Component({
  selector: 'app-create-exam-component',
  imports: [CardModule, ReactiveFormsModule, ButtonModule, FloatLabel, InputTextModule],
  templateUrl: './create-exam-component.html',
})
export class CreateExamComponent {
  private examService = inject(ExamService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<boolean>(false);
  responseId = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  create() {
    this.loading.set(true);
    this.error.set(null);

    this.examService.create(this.form.getRawValue()).subscribe({
      next: (responseId: string) => {
        this.loading.set(false);
        this.success.set(true);
        this.responseId.set(responseId);
        this.form.reset();
      },
      error: (err: HttpErrorResponse) => {
        const errorMessage = err.error as ApiErrorResponse;
        this.error.set(errorMessage.message);
        this.loading.set(false);
        this.form.reset();
      },
    });
  }

  seeMore() {
    const id = this.responseId();
    if (id) {
      this.router.navigate(['/exams', id]);
    }
  }
}
