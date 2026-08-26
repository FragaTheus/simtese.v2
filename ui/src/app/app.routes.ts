import { Routes } from '@angular/router';
import { CreateAppointmentComponent } from './feat/appointments/create-appointment-component/create-appointment-component';
import { HomeComponent } from './feat/home/home-component/home-component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'agendar', component: CreateAppointmentComponent },
];
