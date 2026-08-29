import { Component } from '@angular/core';
import { DashLayout } from '../../../shared/components/layout/dash-layout/dash-layout';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dash-component',
  imports: [DashLayout, RouterOutlet],
  templateUrl: './dash-component.html',
})
export class DashComponent {}
