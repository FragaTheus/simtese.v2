import { Routes } from '@angular/router';
import { LoginComponent } from './feat/auth/login/login-component/login-component';
import { AccountInfoComponent } from './feat/account/account-info-component/account-info-component';
import { DashRouter } from './shared/dash/dash-router/dash-router';
import { DashComponent } from './feat/dash/dash-component/dash-component';
import { ExamsListComponent } from './feat/exams/exams-list-component/exams-list-component';
import { ExamInfoComponent } from './feat/exams/exam-info-component/exam-info-component';
import { AccountListComponent } from './feat/account/account-list-component/account-list-component';
import { HomeComponent } from './feat/home/home-component/home-component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'entrar', component: LoginComponent },
  {
    path: 'painel',
    component: DashRouter,
    children: [
      { path: '', component: DashComponent },
      { path: 'exames', component: ExamsListComponent },
      { path: 'exames/:id', component: ExamInfoComponent },
      { path: 'contas', component: AccountListComponent },
      { path: 'contas/:id', component: AccountInfoComponent },
    ],
  },
];
