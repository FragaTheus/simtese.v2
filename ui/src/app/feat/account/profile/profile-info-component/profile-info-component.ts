import { Component, inject, signal } from '@angular/core';
import { AccountInfoLayout } from '../../../../shared/components/layout/account-info-layout/account-info-layout';
import { DashPageLayout } from '../../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';
import { AccountInfo, AccountService, Role } from '../../account-service';
import { ApiErrorResponse } from '../../../../shared/api/type/api.type';
import { HttpErrorResponse } from '@angular/common/http';
import { DashPageHeaderLayout } from '../../../../shared/components/layout/dash/dash-page-header-layout/dash-page-header-layout';
import { ProfileChangePasswordComponent } from '../profile-change-password-component/profile-change-password-component';
import { ProfileChangeNameComponent } from '../profile-change-name-component/profile-change-name-component';

@Component({
  selector: 'app-profile-info-component',
  imports: [
    AccountInfoLayout,
    DashPageLayout,
    DashPageHeaderLayout,
    ProfileChangePasswordComponent,
    ProfileChangeNameComponent,
  ],
  templateUrl: './profile-info-component.html',
})
export class ProfileInfoComponent {
  private accountService = inject(AccountService);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  profile = signal<AccountInfo | null>(null);

  constructor() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);
    this.error.set(null);

    this.accountService.me().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error);
        this.loading.set(false);
      },
    });
  }
}
