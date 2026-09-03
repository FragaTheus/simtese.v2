import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { Router, RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DashPageHeaderLayout } from '../../../shared/components/layout/dash/dash-page-header-layout/dash-page-header-layout';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';
import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';

interface Card {
  icon: string;
  title: string;
  description: string;
  href: string;
}

@Component({
  selector: 'app-dash-component',
  imports: [
    SkeletonModule,
    CardModule,
    ButtonModule,
    SkeletonModule,
    RouterLink,
    DashPageHeaderLayout,
    ErrorComponent,
    DashPageLayout,
  ],
  templateUrl: './dash-component.html',
})
export class DashComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);

  cards: Card[] = [
    {
      icon: 'pi pi-clipboard',
      title: 'Exames',
      description: 'Gerencie o catálogo de exames que estarão disponíveis no agendamento.',
      href: '/painel/exames',
    },
    {
      icon: 'pi pi-clipboard',
      title: 'Exames',
      description: 'Gerencie o catálogo de exames que estarão disponíveis no agendamento.',
      href: '/painel/exames',
    },
    {
      icon: 'pi pi-clipboard',
      title: 'Exames',
      description: 'Gerencie o catálogo de exames que estarão disponíveis no agendamento.',
      href: '/painel/exames',
    },
    {
      icon: 'pi pi-clipboard',
      title: 'Exames',
      description: 'Gerencie o catálogo de exames que estarão disponíveis no agendamento.',
      href: '/painel/exames',
    },
    {
      icon: 'pi pi-clipboard',
      title: 'Exames',
      description: 'Gerencie o catálogo de exames que estarão disponíveis no agendamento.',
      href: '/painel/exames',
    },
    {
      icon: 'pi pi-clipboard',
      title: 'Exames',
      description: 'Gerencie o catálogo de exames que estarão disponíveis no agendamento.',
      href: '/painel/exames',
    },
  ];

  fastAccess: Card[] = [
    {
      icon: 'pi pi-clipboard',
      title: 'Novo',
      description: 'Cadastrar novo exame',
      href: '/acesso-rapido',
    },
  ];

  constructor() {
    this.authenticate();
  }

  authenticate() {
    this.loading.set(true);
    this.error.set(null);

    this.authService.me().subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiErrorResponse;

        if (err.status == 401 || apiError.status == 'UNAUTHORIZED') {
          this.authService.logout();
          this.router.navigate(['/entrar']);
        }

        this.error.set(apiError);
      },
    });
  }

  protected retry() {
    this.authenticate();
  }
}
