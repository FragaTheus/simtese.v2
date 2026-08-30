import { Routes } from '@angular/router';
import { HomeComponent } from './feat/home/home-component/home-component';
import { LoginComponent } from './feat/auth/login/login-component/login-component';
import { DashRouter } from './shared/dash/dash-router/dash-router';
import { DashComponent } from './feat/dash/dash-component/dash-component';
import { ExamInfoComponent } from './feat/exams/exam-info-component/exam-info-component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'entrar', component: LoginComponent },
  {
    path: 'painel',
    component: DashRouter,
    children: [
      { path: '', component: DashComponent },
      { path: 'exames/:id', component: ExamInfoComponent },
    ],
  },
];
