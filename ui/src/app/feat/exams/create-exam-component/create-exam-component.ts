import { Component, inject, model, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { ExamService } from '../exam-service';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { DialogModule } from 'primeng/dialog';
import { InputDialogComponent } from '../../../shared/components/ui/input-dialog-component/input-dialog-component';

@Component({
  selector: 'app-create-exam-component',
  imports: [
    CardModule,
    ReactiveFormsModule,
    ButtonModule,
    FloatLabel,
    InputTextModule,
    DialogModule,
    InputDialogComponent,
  ],
  templateUrl: './create-exam-component.html',
})
export class CreateExamComponent {
  private examService = inject(ExamService);
  visible = model<boolean>(false);
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
    this.success.set(false);
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

  closeDialog() {
    this.loading.set(false);
    this.error.set(null);
    this.success.set(false);
    this.responseId.set(null);
    this.visible.set(false);
    this.form.reset();
  }

  seeMore() {
    const id = this.responseId();
    if (id) {
      this.router.navigate([`painel/exames/${id}`]);
    }
    this.closeDialog();
  }
}
