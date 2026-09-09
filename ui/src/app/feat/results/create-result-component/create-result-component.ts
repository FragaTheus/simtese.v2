import { Component, inject, input, model, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';

import { DialogComponent } from '../../../shared/components/ui/dialog-component/dialog-component';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { ResultService } from '../result-service';

interface AptOption {
  label: string;
  value: boolean;
}

@Component({
  selector: 'app-create-result-component',
  imports: [
    DialogComponent,
    ButtonModule,
    ReactiveFormsModule,
    SelectModule,
    FileUploadModule,
    TooltipModule,
  ],
  templateUrl: './create-result-component.html',
})
export class CreateResultComponent {
  appointmentId = input.required<string>();
  showTrigger = input<boolean>(true);

  visible = model<boolean>(false);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<boolean>(false);

  selectedFile = signal<File | null>(null);

  refresh = output<void>();

  private fb = inject(FormBuilder);
  private resultService = inject(ResultService);

  aptOptions: AptOption[] = [
    {
      label: 'Apto',
      value: true,
    },
    {
      label: 'Inapto',
      value: false,
    },
  ];

  form = this.fb.nonNullable.group({
    apt: [true, Validators.required],
  });

  onFileSelect(event: any) {
    const file = event.files?.[0] ?? null;

    this.selectedFile.set(file);
    this.error.set(null);
  }

  removeFile() {
    this.selectedFile.set(null);
  }

  createResult() {
    this.error.set(null);
    this.success.set(false);

    const file = this.selectedFile();

    if (file === null) {
      this.error.set('Selecione o arquivo PDF do resultado.');
      return;
    }

    this.loading.set(true);

    this.resultService
      .create(this.appointmentId(), {
        apt: this.form.getRawValue().apt,
        file,
      })
      .subscribe({
        next: () => {
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
    this.selectedFile.set(null);

    this.form.reset({
      apt: true,
    });

    this.visible.set(false);
  }
}
