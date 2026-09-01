import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamService } from '../exam-service';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterBackComponent } from '../../../shared/components/ui/router-back-component/router-back-component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-exam-component',
  imports: [
    CardModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    RouterBackComponent,
    RouterLink,
  ],
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
