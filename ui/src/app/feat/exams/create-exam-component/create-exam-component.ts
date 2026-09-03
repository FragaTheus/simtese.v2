import { Component, inject, output, signal } from '@angular/core';
import { DialogComponent } from '../../../shared/components/ui/dialog-component/dialog-component';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ExamService } from '../exam-service';
import { HttpErrorResponse } from '@angular/common/http';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-exam-component',
  imports: [
    DialogComponent,
    ButtonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    RouterLink,
  ],
  templateUrl: './create-exam-component.html',
})
export class CreateExamComponent {
  visible = signal<boolean>(false);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<boolean>(false);
  id = signal<string | null>(null);
  private fb = inject(FormBuilder);
  private examService = inject(ExamService);
  refresh = output<void>();
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  createExam() {
    this.error.set(null);
    this.loading.set(true);
    this.success.set(false);

    this.examService.create(this.form.getRawValue()).subscribe({
      next: (id) => {
        this.id.set(id);
        this.loading.set(false);
        this.success.set(true);
        this.refresh.emit();
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiErrorResponse;
        this.error.set(apiError.message);
        this.loading.set(false);
      },
    });
  }

  closeDialog() {
    this.error.set(null);
    this.success.set(false);
    this.id.set(null);
    this.form.reset();
    this.visible.set(false);
  }
}
