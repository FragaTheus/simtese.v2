import { Component, computed, inject, signal, viewChild } from '@angular/core';
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
import { CreateExamComponent } from '../../exams/create-exam-component/create-exam-component';
import { CreateAccountComponent } from '../../account/create-account-component/create-account-component';

interface Card {
  icon: string;
  title: string;
  description: string;
  href: string;
}

interface FastAccessCard {
  icon: string;
  title: string;
  description: string;
  action: () => void;
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
    CreateExamComponent,
    CreateAccountComponent,
  ],
  templateUrl: './dash-component.html',
})
export class DashComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  examCreate = viewChild<CreateExamComponent>('examCreate');
  accountCreate = viewChild<CreateAccountComponent>('accountCreate');

  cards: Card[] = [
    {
      icon: 'pi pi-clipboard',
      title: 'Exames',
      description: 'Gerencie o catálogo de exames que estarão disponíveis no agendamento.',
      href: '/painel/exames',
    },
    {
      icon: 'pi pi-users',
      title: 'Contas',
      description:
        'As contas de usuarios serão acessadas pelos usuários do painel administrativo, seja interno ou externo.',
      href: '/painel/contas',
    },
  ];

  fastAccess: FastAccessCard[] = [
    {
      icon: 'pi pi-clipboard',
      title: 'Novo Exame',
      description: 'Cadastrar novo exame',
      action: () => this.examCreate()?.visible.set(true),
    },
    {
      icon: 'pi pi-user-plus',
      title: 'Nova Conta',
      description: 'Cadastrar nova conta',
      action: () => this.accountCreate()?.visible.set(true),
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
