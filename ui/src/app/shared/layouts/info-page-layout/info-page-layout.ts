import { Component, input } from '@angular/core';
import { PageLayout } from '../page-layout/page-layout';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';

export interface LabelField {
  label: string;
  value: string | null;
}

export interface AuditInfo {
  createdAt: string | null;
  createdBy: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
}

@Component({
  selector: 'app-info-page-layout',
  imports: [DashboardLayout, PageLayout, ButtonModule, RouterLink, CardModule, DatePipe],
  templateUrl: './info-page-layout.html',
})
export class InfoPageLayout {
  title = input.required<string>();
  fields = input.required<LabelField[]>();
  audit = input<AuditInfo | null>(null);
}
