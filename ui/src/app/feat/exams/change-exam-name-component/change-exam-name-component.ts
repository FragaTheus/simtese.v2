import { Component, inject, output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

import { ExamRequest, ExamService } from '../exam-service';
import { ApiErrorResponse } from '../../../core/config/api.error.type';

@Component({
  selector: 'app-change-exam-name-component',
  imports: [ButtonModule, DialogModule, InputTextModule, ReactiveFormsModule, FloatLabelModule],
  templateUrl: './change-exam-name-component.html',
})
export class ChangeExamNameComponent {
  private readonly examService = inject(ExamService);
  private readonly route = inject(ActivatedRoute);

  private readonly examId = this.route.snapshot.paramMap.get('id');

  changed = output<void>();

  visible = signal(false);
  isLoading = signal(false);
  hasError = signal(false);
  errorMessage = signal('');

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  setVisible(): void {
    this.visible.set(true);
  }

  closeDialog(): void {
    this.visible.set(false);
    this.isLoading.set(false);
    this.hasError.set(false);
    this.errorMessage.set('');
    this.form.reset();
  }

  changeName(request: ExamRequest): void {
    if (!this.examId) {
      this.hasError.set(true);
      this.errorMessage.set('ID do exame não encontrado.');
      return;
    }

    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMessage.set('');

    this.examService.change(request, this.examId).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.changed.emit();
      },

      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.hasError.set(true);

        if (error.status === 0) {
          this.errorMessage.set('Não foi possível conectar ao servidor.');
          return;
        }

        const apiError = error.error as ApiErrorResponse;

        this.errorMessage.set(apiError?.message ?? 'Ocorreu um erro ao alterar o nome do exame.');
      },
    });
  }
}
