import { Component, inject, input, output, signal } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { DialogComponent } from '../../../shared/components/ui/dialog-component/dialog-component';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AccountService, Role } from '../account-service';
import { HttpErrorResponse } from '@angular/common/http';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { RouterLink } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';

interface RoleOption {
  label: string;
  value: Role;
}

@Component({
  selector: 'app-create-account-component',
  imports: [
    DialogComponent,
    ButtonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    TooltipModule,
    RouterLink,
    SelectModule,
    PasswordModule,
  ],
  templateUrl: './create-account-component.html',
})
export class CreateAccountComponent {
  showTrigger = input<boolean>(true);
  visible = signal<boolean>(false);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<boolean>(false);
  id = signal<string | null>(null);
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  refresh = output<void>();
  roleOptions: RoleOption[] = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Enfermeiro(a)', value: 'NURSE' },
    { label: 'Recepcionista', value: 'RECEPTIONIST' },
    { label: 'Empresa', value: 'ENTERPRISE' },
  ];
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    role: undefined as Role | undefined,
  });

  createAccount() {
    this.error.set(null);
    this.loading.set(true);
    this.success.set(false);

    console.log(this.form.getRawValue());

    this.accountService.create(this.form.getRawValue()).subscribe({
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
