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
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  enterprise = signal<EnterpriseInfo | undefined>(undefined);
  id = this.actRoute.snapshot.paramMap.get('id');

  constructor() {
    this.loadEnterprise();
  }

  loadEnterprise() {
    this.loading.set(true);

    this.enterpriseService.info(this.id!).subscribe({
      next: (enterprise) => {
        this.enterprise.set(enterprise);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error);
        this.loading.set(false);
      },
    });
  }

  retry() {
    this.loadEnterprise();
  }
}
