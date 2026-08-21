import { Component, inject, signal } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

import { Router, RouterLink } from '@angular/router';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../../core/config/api.error.type';
import { Auth } from '../../../feat/auth';

@Component({
  selector: 'app-login',
  imports: [
    CardModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  readonly hasError = signal(false);
  readonly errorMessage = signal('');
  readonly loading = signal(false);
  readonly checkingSession = signal(true);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      this.checkingSession.set(false);
      return;
    }

    this.authService.me().subscribe({
      next: () => {
        this.router.navigate(['/painel']);
      },

      error: (error: HttpErrorResponse) => {
        this.checkingSession.set(false);

        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('accessToken');
          return;
        }

        if (error.status === 0) {
          this.hasError.set(true);
          this.errorMessage.set('Não foi possível conectar ao servidor.');

          return;
        }

        this.hasError.set(true);
        this.errorMessage.set('Ocorreu um erro inesperado.');
      },
    });
  }

  login(): void {
    if (this.form.invalid || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.hasError.set(false);
    this.errorMessage.set('');

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);

        this.router.navigate(['/painel']);
      },

      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.hasError.set(true);

        if (error.status === 0) {
          this.errorMessage.set('Não foi possível conectar ao servidor.');

          return;
        }

        const apiError = error.error as ApiErrorResponse;

        this.errorMessage.set(apiError?.message ?? 'Ocorreu um erro inesperado.');
      },
    });
  }
}
