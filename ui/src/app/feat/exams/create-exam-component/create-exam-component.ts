import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamService } from '../exam-service';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { HttpErrorResponse } from '@angular/common/http';
import { InputPageLayout } from '../../../shared/components/layout/input-page-layout/input-page-layout';
import { ButtonModule } from 'primeng/button';
import { InputPageSuccessMessageComponent } from '../../../shared/components/layout/input-page-layout/input-page-success-message-component/input-page-success-message-component';
import { InputPageErrorMessageComponent } from '../../../shared/components/layout/input-page-layout/input-page-error-message-component/input-page-error-message-component';

@Component({
  selector: 'app-create-exam-component',
  imports: [
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    InputPageLayout,
    ButtonModule,
    InputPageSuccessMessageComponent,
    InputPageErrorMessageComponent,
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

  successRoute = computed(() => `/exames/${this.id()}`);
  errorMessage = computed(() =>
    this.error() ? this.error()!.message || 'Ocorreu um erro ao cadastrar o exame.' : null,
  );

  create = () => {
    console.log('Stack trace:', new Error().stack);

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
  };

  onFormSubmit(event: Event) {
    console.log('Event:', event);
    console.log('Atual target:', event.currentTarget);
    console.log('Target:', event.target);
    return false;
  }
}
