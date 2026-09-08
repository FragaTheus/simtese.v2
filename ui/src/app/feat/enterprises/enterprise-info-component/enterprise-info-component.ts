import { Component, signal, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';
import { SkeletonModule } from 'primeng/skeleton';
import { EnterpriseInfo, EnterpriseService } from '../enterprise-service';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';
import { EditEnterpriseComponent } from '../edit-enterprise-component/edit-enterprise-component';
import { AuditInfoComponent } from '../../../shared/components/ui/audit-info-component/audit-info-component';
import { EnterpriseAccountVinculateComponent } from '../enterprise-account-vinculate-component/enterprise-account-vinculate-component';
import { UnlinkAccountComponent } from '../unlink-account-component/unlink-account-component';
import { DocumentFormatPipe } from '../../../shared/pipes/document-format-pipe';
import { AuthService } from '../../auth/auth-service';
import { AccountService } from '../../account/account-service';

@Component({
  selector: 'app-enterprise-info-component',
  imports: [
    CardModule,
    ButtonModule,
    DashPageLayout,
    SkeletonModule,
    ErrorComponent,
    RouterLink,
    EditEnterpriseComponent,
    AuditInfoComponent,
    EnterpriseAccountVinculateComponent,
    UnlinkAccountComponent,
    DocumentFormatPipe,
  ],
  templateUrl: './enterprise-info-component.html',
})
export class EnterpriseInfoComponent {
  private enterpriseService = inject(EnterpriseService);
  private actRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private accountService = inject(AccountService);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  enterprise = signal<EnterpriseInfo | undefined>(undefined);
  canEdit = signal<boolean>(false);
  id = this.actRoute.snapshot.paramMap.get('id');

  constructor() {
    this.loadEnterprise();
    this.loadAccount();
  }

  loadAccount() {
    this.accountService.me().subscribe({
      next: (account) => {
        this.canEdit.set(account.role === 'ADMIN' || account.role === 'RECEPTIONIST');
      },
      error: () => {},
    });
  }

  loadEnterprise() {
    this.loading.set(true);

    this.enterpriseService.info(this.id!).subscribe({
      next: (enterprise) => {
        this.enterprise.set(enterprise);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiErrorResponse;

        if (err.status === 401 || apiError.status === 'UNAUTHORIZED') {
          this.authService.logout();
          this.router.navigate(['/entrar']);
        }

        this.error.set(apiError);
        this.loading.set(false);
      },
    });
  }

  retry() {
    this.loadEnterprise();
  }
}
