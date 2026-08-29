import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashLayout } from '../../components/layout/dash-layout/dash-layout';

@Component({
  selector: 'app-dash-router',
  imports: [RouterOutlet, DashLayout],
  templateUrl: './dash-router.html',
})
export class DashRouter {}
