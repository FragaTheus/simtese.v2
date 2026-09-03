import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';

export interface IDashPageHeaderLayout {
  loading: boolean;
  label: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-dash-page-header-layout',
  imports: [SkeletonModule, ButtonModule],
  templateUrl: './dash-page-header-layout.html',
})
export class DashPageHeaderLayout {
  loading = input.required<boolean>();
  label = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
}
