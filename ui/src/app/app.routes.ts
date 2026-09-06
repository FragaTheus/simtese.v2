import { Routes } from '@angular/router';
import { LoginComponent } from './feat/auth/login/login-component/login-component';
import { AccountInfoComponent } from './feat/account/account-info-component/account-info-component';
import { DashRouter } from './shared/dash/dash-router/dash-router';
import { DashComponent } from './feat/dash/dash-component/dash-component';
import { ExamsListComponent } from './feat/exams/exams-list-component/exams-list-component';
import { ExamInfoComponent } from './feat/exams/exam-info-component/exam-info-component';
import { AccountListComponent } from './feat/account/account-list-component/account-list-component';
import { HomeComponent } from './feat/home/home-component/home-component';
import { ProfileInfoComponent } from './feat/account/profile/profile-info-component/profile-info-component';
import { EnterprisesListComponent } from './feat/enterprises/enterprises-list-component/enterprises-list-component';
import { EnterpriseInfoComponent } from './feat/enterprises/enterprise-info-component/enterprise-info-component';
import { EnterpriseAccountVinculateComponent } from './feat/enterprises/enterprise-account-vinculate-component/enterprise-account-vinculate-component';
import { AppointmentListComponent } from './feat/appointments/appointment-list-component/appointment-list-component';
import { AtendimentoPageComponent } from './feat/appointments/create/atendimento-page-component/atendimento-page-component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'entrar', component: LoginComponent },
  { path: 'atendimento', component: AtendimentoPageComponent },
  {
    path: 'painel',
    component: DashRouter,
    children: [
      { path: '', component: DashComponent },
      { path: 'agendamentos', component: AppointmentListComponent },
      { path: 'exames', component: ExamsListComponent },
      { path: 'exames/:id', component: ExamInfoComponent },
      { path: 'contas', component: AccountListComponent },
      { path: 'contas/:id', component: AccountInfoComponent },
      { path: 'empresas', component: EnterprisesListComponent },
      {
        path: 'empresas/:id',
        component: EnterpriseInfoComponent,
      },
      { path: 'perfil', component: ProfileInfoComponent },
    ],
  },
];
