import { Component, inject, input, output, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ExamRequest, ExamService } from '../exam-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../../core/config/api.error.type';
import { RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-create-exam-component',
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    RouterLink,
    ToastModule,
  ],
  templateUrl: './create-exam-component.html',
})
export class CreateExamComponent {
  visible = signal(false);
  private readonly examService = inject(ExamService);
  hasError = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  hasSuccess = signal(false);
  examId = signal<string | null>(null);
  created = output<string>();

  constructor() {
    this.form.controls.name.valueChanges.subscribe(() => {
      this.hasSuccess.set(false);
      this.hasError.set(false);
      this.errorMessage.set('');
    });
  }

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  showDialog() {
    this.visible.set(!this.visible());
  }

  closeDialog() {
    this.hasError.set(false);
    this.isLoading.set(false);
    this.errorMessage.set('');
    this.hasSuccess.set(false);
    this.form.reset(
      {
        name: '',
      },
      {
        emitEvent: false,
      },
    );
    this.visible.set(false);
  }

  create(request: ExamRequest) {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.examService.create(request).subscribe({
      next: (id) => {
        this.closeDialog();
        this.created.emit(id);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.hasError.set(true);

        if (error.status === 0) {
          this.errorMessage.set('Não foi possível conectar ao servidor.');

          return;
        }

        const apiError = error.error as ApiErrorResponse;

        this.errorMessage.set(apiError?.message ?? 'Ocorreu um erro inesperado.');
      },
    });
  }
}
