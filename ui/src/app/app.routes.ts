import { Routes } from '@angular/router';
import { Painel } from './feat/painel/painel';
import { Login } from './shared/auth/login/login';
import { ExamInfoComponent } from './feat/exams/exam-info-component/exam-info-component';
import { CreateExamComponent } from './feat/exams/create-exam-component/create-exam-component';
import { ExamsComponent } from './feat/exams/exams-component/exams-component';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'painel', component: Painel },
  { path: 'exames/cadastrar', component: CreateExamComponent },
  { path: 'exames/:id', component: ExamInfoComponent },
  { path: 'exames', component: ExamsComponent },
];
