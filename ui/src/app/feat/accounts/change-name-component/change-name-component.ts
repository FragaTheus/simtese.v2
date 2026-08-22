import { Component, inject, output, signal } from '@angular/core';
import { AccountService, ChangeNameRequest } from '../account-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../../core/config/api.error.type';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { DialogComponent } from '../../../shared/components/ui/dialog-component/dialog-component';

@Component({
  selector: 'app-change-name-component',
  imports: [InputTextModule, ReactiveFormsModule, FloatLabelModule, ButtonModule, DialogComponent],
  templateUrl: './change-name-component.html',
})
export class ChangeNameComponent {
  visible = signal<boolean>(false);
  changed = output<void>();
  errorMessage = signal<string>('');
  loading = signal<boolean>(false);
  hasError = signal<boolean>(false);
  private readonly accountService = inject(AccountService);

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  closeDialog() {
    this.loading.set(false);
    this.hasError.set(false);
    this.errorMessage.set('');
    this.visible.set(false);
  }

  showDialog() {
    this.visible.set(true);
    this.loading.set(false);
    this.hasError.set(false);
    this.errorMessage.set('');
  }

  changeName(request: ChangeNameRequest) {
    this.loading.set(true);
    this.accountService.changeName(request).subscribe({
      next: () => {
        this.closeDialog();
        this.changed.emit();
      },
      error: (error: HttpErrorResponse) => {
        const apiError = error.error as ApiErrorResponse;
        this.hasError.set(true);
        this.errorMessage.set(apiError.message || 'Erro ao alterar o nome.');
      },
    });
  }
}
