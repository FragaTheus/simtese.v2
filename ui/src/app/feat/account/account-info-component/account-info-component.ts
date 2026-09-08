import { Component, signal, inject } from '@angular/core';
import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';
import { AccountInfoLayout } from '../../../shared/components/layout/account-info-layout/account-info-layout';
import { DashPageHeaderLayout } from '../../../shared/components/layout/dash/dash-page-header-layout/dash-page-header-layout';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountInfo, AccountService } from '../account-service';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';
import { EditAccountComponent } from '../edit-account-component/edit-account-component';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-account-info-component',
  imports: [
    DashPageLayout,
    AccountInfoLayout,
    DashPageHeaderLayout,
    ButtonModule,
    RouterLink,
    ErrorComponent,
    EditAccountComponent,
    CardModule,
    SkeletonModule,
    DatePipe,
  ],
  templateUrl: './account-info-component.html',
})
export class AccountInfoComponent {
  private accountService = inject(AccountService);
  private actRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  account = signal<AccountInfo | undefined>(undefined);
  id = this.actRoute.snapshot.paramMap.get('id');

  constructor() {
    this.loadAccount();
  }

  loadAccount() {
    this.loading.set(true);

    this.accountService.info(this.id!).subscribe({
      next: (account) => {
        this.account.set(account);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiErrorResponse;
        this.error.set(apiError);
        this.loading.set(false);
      },
    });
  }
}
