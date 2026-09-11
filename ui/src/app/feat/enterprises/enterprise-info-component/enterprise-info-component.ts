import { Component, signal, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';
import { SkeletonModule } from 'primeng/skeleton';
import { EnterpriseInfo, EnterpriseService } from '../enterprise-service';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';
import { EditEnterpriseComponent } from '../edit-enterprise-component/edit-enterprise-component';
import { AuditInfoComponent } from '../../../shared/components/ui/audit-info-component/audit-info-component';
import { EnterpriseAccountVinculateComponent } from '../enterprise-account-vinculate-component/enterprise-account-vinculate-component';
import { UnlinkAccountComponent } from '../unlink-account-component/unlink-account-component';
import { DocumentFormatPipe } from '../../../shared/pipes/document-format-pipe';
import { AccountService } from '../../account/account-service';
import { ResultService, ResultSummary } from '../../results/result-service';
import { CreteUnlinkedComponent } from '../../results/crete-unlinked-component/crete-unlinked-component';

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
    CreteUnlinkedComponent,
  ],
  templateUrl: './enterprise-info-component.html',
})
export class EnterpriseInfoComponent {
  private enterpriseService = inject(EnterpriseService);
  private actRoute = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  private resultService = inject(ResultService);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  enterprise = signal<EnterpriseInfo | undefined>(undefined);
  canEdit = signal<boolean>(false);
  id = this.actRoute.snapshot.paramMap.get('id');
  results = signal<ResultSummary[] | null>(null);

  constructor() {
    this.loadEnterprise();
    this.loadAccount();
    this.loadResults();
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
        this.error.set(apiError);
        this.loading.set(false);
      },
    });
  }

  loadResults() {
    this.resultService.findAllByEnterpriseId(this.id!).subscribe({
      next: (results) => {
        this.results.set(results);
      },
      error: () => {
        this.results.set(null);
      },
    });
  }

  retry() {
    this.loadEnterprise();
    this.loadResults();
  }
}
