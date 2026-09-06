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
        loadComponent: () =>
          import('./feat/appointments/appointment-list-component/appointment-list-component').then(
            (m) => m.AppointmentListComponent,
          ),
      },
      {
        path: 'agendamentos/:id',
        loadComponent: () =>
          import('./feat/appointments/appointment-info-component/appointment-info-component').then(
            (m) => m.AppointmentInfoComponent,
          ),
      },
      {
        path: 'exames',
        loadComponent: () =>
          import('./feat/exams/exams-list-component/exams-list-component').then(
            (m) => m.ExamsListComponent,
          ),
      },
      {
        path: 'exames/:id',
        loadComponent: () =>
          import('./feat/exams/exam-info-component/exam-info-component').then(
            (m) => m.ExamInfoComponent,
          ),
      },
      {
        path: 'contas',
        loadComponent: () =>
          import('./feat/account/account-list-component/account-list-component').then(
            (m) => m.AccountListComponent,
          ),
      },
      {
        path: 'contas/:id',
        loadComponent: () =>
          import('./feat/account/account-info-component/account-info-component').then(
            (m) => m.AccountInfoComponent,
          ),
      },
      {
        path: 'empresas',
        loadComponent: () =>
          import('./feat/enterprises/enterprises-list-component/enterprises-list-component').then(
            (m) => m.EnterprisesListComponent,
          ),
      },
      {
        path: 'empresas/:id',
        loadComponent: () =>
          import('./feat/enterprises/enterprise-info-component/enterprise-info-component').then(
            (m) => m.EnterpriseInfoComponent,
          ),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./feat/account/profile/profile-info-component/profile-info-component').then(
            (m) => m.ProfileInfoComponent,
          ),
      },
    ],
  },
];
