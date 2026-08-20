import { Component, inject } from '@angular/core';
import { Auth } from '../../auth';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

import { Router, RouterLink } from '@angular/router';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../../core/config/api.error.type';

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

  hasError = false;
  errorMessage = '';
  loading = false;

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  login(): void {
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.hasError = false;
    this.errorMessage = '';

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/painel']);
      },

      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.hasError = true;

        if (error.status === 0 || error == null) {
          this.errorMessage = 'Não foi possível conectar ao servidor.';
          return;
        }

        const apiError = error.error as ApiErrorResponse;

        this.errorMessage = apiError.message;
      },
    });
  }
}
