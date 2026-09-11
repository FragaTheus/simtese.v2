import { Component, inject, input, model, output, signal } from '@angular/core';
import { DialogComponent } from '../../../shared/components/ui/dialog-component/dialog-component';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { ResultService } from '../result-service';
import { HttpErrorResponse } from '@angular/common/http';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';

interface AptOption {
  label: string;
  value: boolean;
}

@Component({
  selector: 'app-crete-unlinked-component',
  imports: [
    DialogComponent,
    ButtonModule,
    ReactiveFormsModule,
    SelectModule,
    FileUploadModule,
    TooltipModule,
    FloatLabelModule,
    InputTextModule,
    RouterLink,
  ],
  templateUrl: './crete-unlinked-component.html',
})
export class CreteUnlinkedComponent {
  enterpriseId = input.required<string>();
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<boolean>(false);
  selectedFile = signal<File | null>(null);
  visible = signal<boolean>(false);
  resultId = signal<string | null>(null);

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
    employeeName: ['', Validators.required],
    employeeCpf: ['', Validators.required],
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

  creteUnlinkedResult() {
    this.error.set(null);
    this.success.set(false);

    const file = this.selectedFile();

    if (file === null) {
      this.error.set('Selecione o arquivo PDF do resultado.');
      return;
    }

    this.loading.set(true);

    this.resultService
      .createUnlinked(this.enterpriseId(), {
        employeeName: this.form.getRawValue().employeeName,
        employeeCpf: this.form.getRawValue().employeeCpf,
        apt: this.form.getRawValue().apt,
        file,
      })
      .subscribe({
        next: (id) => {
          this.resultId.set(id);
          this.success.set(true);
          this.loading.set(false);
        },

        error: (err: HttpErrorResponse) => {
          this.error.set(err.message);
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
