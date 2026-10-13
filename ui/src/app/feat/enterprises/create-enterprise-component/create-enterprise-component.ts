import { Component, inject, input, output, signal } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { DialogComponent } from '../../../shared/components/ui/dialog-component/dialog-component';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  EnterpriseDocumentType,
  EnterpriseService,
} from '../enterprise-service';
import { HttpErrorResponse } from '@angular/common/http';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { RouterLink } from '@angular/router';
import { stripDocumentMask } from '../../../shared/pipes/document-format-pipe';
import { SelectModule } from 'primeng/select';

interface EnterpriseDocumentTypeOption {
  label: string;
  value: EnterpriseDocumentType;
}

@Component({
  selector: 'app-create-enterprise-component',
  imports: [
    DialogComponent,
    ButtonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    TooltipModule,
    RouterLink,
    SelectModule,
  ],
  templateUrl: './create-enterprise-component.html',
})
export class CreateEnterpriseComponent {
  showTrigger = input<boolean>(true);
  visible = signal<boolean>(false);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<boolean>(false);
  id = signal<string | null>(null);
  private fb = inject(FormBuilder);
  private enterpriseService = inject(EnterpriseService);
  refresh = output<void>();
  documentTypeOptions: EnterpriseDocumentTypeOption[] = [
    { label: 'CNPJ', value: 'CNPJ' },
    { label: 'CAEPF', value: 'CAEPF' },
    { label: 'CPF', value: 'CPF' },
  ];
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    documentType: ['CNPJ' as EnterpriseDocumentType, Validators.required],
    documentValue: ['', [Validators.required, Validators.pattern(/^[0-9./-]+$/)]],
  });

  createEnterprise() {
    this.error.set(null);
    this.loading.set(true);
    this.success.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.loading.set(false);
      return;
    }

    const { name, documentType, documentValue } = this.form.getRawValue();

    this.enterpriseService
      .create({
        name,
        document: {
          type: documentType,
          value: stripDocumentMask(documentValue),
        },
      })
      .subscribe({
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

  get documentLabel(): string {
    return this.form.controls.documentType.value;
  }

  closeDialog() {
    this.error.set(null);
    this.success.set(false);
    this.id.set(null);
    this.form.reset({
      name: '',
      documentType: 'CNPJ',
      documentValue: '',
    });
    this.visible.set(false);
  }
}
