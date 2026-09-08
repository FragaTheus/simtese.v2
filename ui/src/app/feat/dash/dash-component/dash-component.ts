import { Component, inject, signal, viewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { AuthResponse, AuthService } from '../../auth/auth-service';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';

import { DashPageHeaderLayout } from '../../../shared/components/layout/dash/dash-page-header-layout/dash-page-header-layout';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';
import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';

import { CreateExamComponent } from '../../exams/create-exam-component/create-exam-component';
import { CreateAccountComponent } from '../../account/create-account-component/create-account-component';
import { CreateEnterpriseComponent } from '../../enterprises/create-enterprise-component/create-enterprise-component';
import { CreateAppointmentComponent } from '../../appointments/create/create-appointment-component/create-appointment-component';

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
    RouterLink,
    DashPageHeaderLayout,
    ErrorComponent,
    DashPageLayout,
    CreateExamComponent,
    CreateAccountComponent,
    CreateEnterpriseComponent,
    CreateAppointmentComponent,
  ],
  templateUrl: './dash-component.html',
})
export class DashComponent {
  private authService = inject(AuthService);

  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);

  user = signal<AuthResponse | null>(null);

  cards = signal<Card[]>([]);

  examCreate = viewChild<CreateExamComponent>('examCreate');
  accountCreate = viewChild<CreateAccountComponent>('accountCreate');
  enterpriseCreate = viewChild<CreateEnterpriseComponent>('enterpriseCreate');
  appointmentCreate = viewChild<CreateAppointmentComponent>('appointmentCreate');

  fastAccess: FastAccessCard[] = [
    {
      icon: 'pi pi-calendar-plus',
      title: 'Novo Agendamento',
      description: 'Cadastrar novo agendamento',
      action: () => this.appointmentCreate()?.visible.set(true),
    },
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
    {
      icon: 'pi pi-building',
      title: 'Nova Empresa',
      description: 'Cadastrar nova empresa',
      action: () => this.enterpriseCreate()?.visible.set(true),
    },
  ];

  constructor() {
    this.authenticate();
  }

  authenticate() {
    this.loading.set(true);
    this.error.set(null);
    this.user.set(null);
    this.cards.set([]);

    this.authService.me().subscribe({
      next: (response) => {
        const user = response.body;

        this.user.set(user);

        if (user?.role === 'ADMIN') {
          this.cards.set([
            {
              icon: 'pi pi-calendar',
              title: 'Agendamentos',
              description: 'Gerencie os agendamentos de exames ocupacionais dos funcionários.',
              href: '/painel/agendamentos',
            },
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
                'As contas de usuários serão acessadas pelos usuários do painel administrativo, seja interno ou externo.',
              href: '/painel/contas',
            },
            {
              icon: 'pi pi-building',
              title: 'Empresas',
              description: 'Gerencie as empresas parceiras vinculadas à plataforma.',
              href: '/painel/empresas',
            },
          ]);
        }

        if (user?.role === 'NURSE') {
          this.cards.set([
            {
              icon: 'pi pi-calendar',
              title: 'Agendamentos',
              description: 'Gerencie os agendamentos de exames ocupacionais dos funcionários.',
              href: '/painel/agendamentos',
            },
            {
              icon: 'pi pi-building',
              title: 'Empresas',
              description: 'Gerencie as empresas parceiras vinculadas à plataforma.',
              href: '/painel/empresas',
            },
          ]);
        }

        this.loading.set(false);
      },

      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiErrorResponse;

        this.error.set(apiError);
        this.user.set(null);
        this.cards.set([]);
        this.loading.set(false);
      },
    });
  }
}
