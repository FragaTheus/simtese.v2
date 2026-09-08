import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EnterpriseService } from '../enterprise-service';
import { DashPageHeaderLayout } from '../../../shared/components/layout/dash/dash-page-header-layout/dash-page-header-layout';
import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';
import { DashListPageLayout } from '../../../shared/components/layout/dash/dash-list-page-layout/dash-list-page-layout';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { EnterpriseSummary } from '../enterprise-service';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-account-linked-enterprises-component',
  imports: [
    DashPageHeaderLayout,
    DashPageLayout,
    ErrorComponent,
    DashListPageLayout,
    ButtonModule,
    DialogModule,
    DataViewModule,
    RouterLink,
  ],
  templateUrl: './account-linked-enterprises-component.html',
})
export class AccountLinkedEnterprisesComponent {
  private enterpriseService = inject(EnterpriseService);
  private actRoute = inject(ActivatedRoute);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  items = signal<EnterpriseSummary[]>([]);
  accountId = this.actRoute.snapshot.paramMap.get('id') ?? '';

  constructor() {
    this.loadEnterprises();
  }

  loadEnterprises() {
    this.loading.set(true);
    this.enterpriseService.linkedAccounts(this.accountId!).subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error);
        this.loading.set(false);
      },
    });
  }
}
