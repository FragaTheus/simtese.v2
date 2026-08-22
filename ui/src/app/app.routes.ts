import { Routes } from '@angular/router';
import { Painel } from './feat/painel/painel';
import { Login } from './shared/auth/login/login';
import { ExamInfoComponent } from './feat/exams/exam-info-component/exam-info-component';
import { CreateExamComponent } from './feat/exams/create-exam-component/create-exam-component';
import { ExamsComponent } from './feat/exams/exams-component/exams-component';
import { ProfileInfoComponent } from './feat/accounts/profile/profile-info-component/profile-info-component';
import { DialogComponent } from './shared/components/ui/dialog-component/dialog-component';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'painel', component: Painel },
  { path: 'painel/exames/cadastrar', component: CreateExamComponent },
  { path: 'painel/exames/:id', component: ExamInfoComponent },
  { path: 'painel/exames', component: ExamsComponent },
  { path: 'painel/me', component: ProfileInfoComponent },
  { path: 'test', component: DialogComponent },
];
