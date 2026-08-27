import { Routes } from '@angular/router';
import { HomeComponent } from './feat/home/home-component/home-component';
import { LoginComponent } from './feat/auth/login/login-component/login-component';
import { DashComponent } from './feat/dash/dash-component/dash-component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'entrar', component: LoginComponent },
  { path: 'painel', component: DashComponent },
];
