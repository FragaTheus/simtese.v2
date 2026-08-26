import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './feat/home/home-component/home-component';
import { CreateAppointmentComponent } from './feat/appointments/create-appointment-component/create-appointment-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, CreateAppointmentComponent],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ui');
}
