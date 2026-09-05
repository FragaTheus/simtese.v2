import { Component, inject, input, model, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';
import { AccountService } from '../../account-service';
import { ApiErrorResponse } from '../../../../shared/api/type/api.type';
import { DialogComponent } from '../../../../shared/components/ui/dialog-component/dialog-component';

@Component({
  selector: 'app-profile-change-password-component',
  imports: [
    ButtonModule,
    DialogComponent,
    FloatLabelModule,
    ReactiveFormsModule,
    PasswordModule,
    TooltipModule,
  ],
  templateUrl: './profile-change-password-component.html',
})
export class ProfileChangePasswordComponent {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  showTrigger = input<boolean>(true);

  changePasswordDialogVisible = model<boolean>(false);
  changePasswordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  changePassword() {
    this.loading.set(true);

    this.accountService.changeMyPassword(this.changePasswordForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.changePasswordDialogVisible.set(false);
        this.changePasswordForm.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err.error);
      },
    });
  }
}
