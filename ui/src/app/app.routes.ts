import { Routes } from '@angular/router';
import { Login } from './feat/auth/login/login';
import { Painel } from './feat/painel/painel';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'painel', component: Painel },
];
