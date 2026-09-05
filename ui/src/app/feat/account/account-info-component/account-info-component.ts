import { Component, signal } from '@angular/core';
import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';
import { AccountInfoLayout } from '../../../shared/components/layout/account-info-layout/account-info-layout';
import { DashPageHeaderLayout } from '../../../shared/components/layout/dash/dash-page-header-layout/dash-page-header-layout';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-account-info-component',
  imports: [DashPageLayout, AccountInfoLayout, DashPageHeaderLayout, ButtonModule, RouterLink],
  templateUrl: './account-info-component.html',
})
export class AccountInfoComponent {
  loading = signal<boolean>(false);
}
