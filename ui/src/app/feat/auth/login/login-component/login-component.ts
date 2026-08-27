import { Component, signal } from '@angular/core';
import { AuthService, LoginRequest } from '../../auth-service';
import { inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../../../shared/api/type/api.type';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-login-component',
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    FloatLabelModule,
    ButtonModule,
  ],
  templateUrl: './login-component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  loading = signal<boolean>(false);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');
  router = inject(Router);
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    this.getSession();
  }

  getSession() {
    this.loading.set(true);
    this.authService.me().subscribe({
      next: (response) => {
        this.router.navigate(['/painel']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
      },
    });
  }

  login() {
    this.loading.set(true);
    this.hasError.set(false);
    this.errorMessage.set('');

    const request = this.form.getRawValue() as LoginRequest;

    this.authService.login(request).subscribe({
      next: (response) => {
        const authHeader = response.headers.get('Authorization');
        localStorage.setItem('accessToken', authHeader || '');
        this.loading.set(false);
        this.router.navigate(['/painel']);
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiErrorResponse;
        this.loading.set(false);
        this.hasError.set(true);
        this.errorMessage.set(apiError.message || 'Ocorreu um erro inesperado!');
      },
    });
  }
}
