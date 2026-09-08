import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./feat/home/home-component/home-component').then((m) => m.HomeComponent),
  },
  {
    path: 'entrar',
    loadComponent: () =>
      import('./feat/auth/login/login-component/login-component').then((m) => m.LoginComponent),
  },
  {
    path: 'atendimento',
    loadComponent: () =>
      import('./feat/appointments/create/atendimento-page-component/atendimento-page-component').then(
        (m) => m.AtendimentoPageComponent,
      ),
  },
  {
    path: '403',
    loadComponent: () =>
      import('./shared/components/ui/forbidden-component/forbidden-component').then(
        (m) => m.ForbiddenComponent,
      ),
  },
  {
    path: '401',
    loadComponent: () =>
      import('./shared/components/ui/session-expired-component/session-expired-component').then(
        (m) => m.SessionExpiredComponent,
      ),
  },
  {
    path: 'painel',
    loadComponent: () => import('./shared/dash/dash-router/dash-router').then((m) => m.DashRouter),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./feat/dash/dash-component/dash-component').then((m) => m.DashComponent),
      },
      {
        path: 'agendamentos',
        data: { breadcrumb: 'Agendamentos' },
        loadComponent: () =>
          import('./feat/appointments/appointment-list-component/appointment-list-component').then(
            (m) => m.AppointmentListComponent,
          ),
      },
      {
        path: 'agendamentos/:id',
        data: { breadcrumb: 'Detalhes do agendamento' },
        loadComponent: () =>
          import('./feat/appointments/appointment-info-component/appointment-info-component').then(
            (m) => m.AppointmentInfoComponent,
          ),
      },
      {
        path: 'exames',
        data: { breadcrumb: 'Exames' },
        loadComponent: () =>
          import('./feat/exams/exams-list-component/exams-list-component').then(
            (m) => m.ExamsListComponent,
          ),
      },
      {
        path: 'exames/:id',
        data: { breadcrumb: 'Detalhes do exame' },
        loadComponent: () =>
          import('./feat/exams/exam-info-component/exam-info-component').then(
            (m) => m.ExamInfoComponent,
          ),
      },
      {
        path: 'contas',
        data: { breadcrumb: 'Contas' },
        loadComponent: () =>
          import('./feat/account/account-list-component/account-list-component').then(
            (m) => m.AccountListComponent,
          ),
      },
      {
        path: 'contas/:id',
        data: { breadcrumb: 'Detalhes da conta' },
        loadComponent: () =>
          import('./feat/account/account-info-component/account-info-component').then(
            (m) => m.AccountInfoComponent,
          ),
      },
      {
        path: 'empresas',
        data: { breadcrumb: 'Empresas' },
        loadComponent: () =>
          import('./feat/enterprises/enterprises-list-component/enterprises-list-component').then(
            (m) => m.EnterprisesListComponent,
          ),
      },
      {
        path: 'empresas/:id',
        data: { breadcrumb: 'Detalhes da empresa' },
        loadComponent: () =>
          import('./feat/enterprises/enterprise-info-component/enterprise-info-component').then(
            (m) => m.EnterpriseInfoComponent,
          ),
      },
      {
        path: 'empresas/vinculadas/:id',
        data: { breadcrumb: 'Empresas Vinculadas' },
        loadComponent: () =>
          import('./feat/enterprises/account-linked-enterprises-component/account-linked-enterprises-component').then(
            (m) => m.AccountLinkedEnterprisesComponent,
          ),
      },
      {
        path: 'perfil',
        data: { breadcrumb: 'Perfil' },
        loadComponent: () =>
          import('./feat/account/profile/profile-info-component/profile-info-component').then(
            (m) => m.ProfileInfoComponent,
          ),
      },
    ],
  },
];
