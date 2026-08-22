import { Component, inject, signal } from '@angular/core';
import { DashboardLayout } from '../../shared/layouts/dashboard/dashboard-layout';
import { CardModule } from 'primeng/card';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PageLayout } from '../../shared/layouts/page-layout/page-layout';
import { Auth, AuthResponse } from '../auth';
import { ErrorLayout } from '../../shared/layouts/error-layout/error-layout';
import { LoadingLayout } from '../../shared/layouts/loading-layout/loading-layout';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../core/config/api.error.type';

export interface DashCardItem {
  href: string;
  title: string;
  description: string;
  imgUrl: string;
}

@Component({
  selector: 'app-painel',
  imports: [
    DashboardLayout,
    CardModule,
    RouterLink,
    ButtonModule,
    PageLayout,
    ErrorLayout,
    LoadingLayout,
  ],
  templateUrl: './painel.html',
})
export class Painel {
  private readonly authService = inject(Auth);
  router = inject(Router);
  user = signal<AuthResponse | null>(null);
  error = signal<boolean>(false);
  loading = signal<boolean>(true);

  cards: DashCardItem[] = [
    {
      title: 'Exames',
      description: 'Acompanhe seus exames e resultados.',
      href: '/painel/exames',
      imgUrl: '/dash-exam.png',
    },
  ];

  constructor() {
    this.authService.me().subscribe({
      next: (response) => {
        this.user.set(response);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        const errorResponse = error.error as ApiErrorResponse;
        console.error('Error fetching user data:', errorResponse);
        if (errorResponse.status === '401 UNAUTHORIZED') {
          this.router.navigate(['/login']);
        } else {
          this.error.set(true);
        }
        this.loading.set(false);
      },
    });
  }
}
