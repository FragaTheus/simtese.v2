import { Component, effect, signal, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';
import { SkeletonModule } from 'primeng/skeleton';
import { EnterpriseInfo, EnterpriseService } from '../enterprise-service';
import { ApiErrorResponse, PageableResponse } from '../../../shared/api/type/api.type';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';
import { EditEnterpriseComponent } from '../edit-enterprise-component/edit-enterprise-component';
import { AuditInfoComponent } from '../../../shared/components/ui/audit-info-component/audit-info-component';
import { EnterpriseAccountVinculateComponent } from '../enterprise-account-vinculate-component/enterprise-account-vinculate-component';
import { UnlinkAccountComponent } from '../unlink-account-component/unlink-account-component';
import { DocumentFormatPipe } from '../../../shared/pipes/document-format-pipe';
import { AccountService } from '../../account/account-service';
import { ResultService, ResultsParams, ResultSummary } from '../../results/result-service';
import { CreteUnlinkedComponent } from '../../results/crete-unlinked-component/crete-unlinked-component';

import { DataView, DataViewPageEvent } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

interface AptOption {
  label: string;
  apt: boolean | undefined;
}

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
    DataView,
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    SelectModule,
  ],
  templateUrl: './enterprise-info-component.html',
})
export class EnterpriseInfoComponent {
  private enterpriseService = inject(EnterpriseService);
  private actRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private accountService = inject(AccountService);
  private resultService = inject(ResultService);

  loading = signal<boolean>(false);
  resultsLoading = signal<boolean>(false);

  error = signal<ApiErrorResponse | null>(null);

  enterprise = signal<EnterpriseInfo | undefined>(undefined);

  canEdit = signal<boolean>(false);

  id = this.actRoute.snapshot.paramMap.get('id');

  pageableResponse = signal<PageableResponse<ResultSummary> | null>(null);

  params = signal<ResultsParams>(this.paramsFromQuery());

  aptOptions: AptOption[] = [
    {
      label: 'Todos',
      apt: undefined,
    },
    {
      label: 'Aptos',
      apt: true,
    },
    {
      label: 'Não aptos',
      apt: false,
    },
  ];

  constructor() {
    effect(() => this.syncQueryParams(this.params()));

    this.loadEnterprise();
    this.loadAccount();
    this.loadResults();
  }

  private paramsFromQuery(): ResultsParams {
    const qp = this.actRoute.snapshot.queryParamMap;

    return {
      search: qp.get('search') ?? undefined,
      apt: qp.has('apt') ? qp.get('apt') === 'true' : undefined,
      page: qp.has('page') ? Number(qp.get('page')) : undefined,
    };
  }

  private syncQueryParams(params: ResultsParams) {
    this.router.navigate([], {
      relativeTo: this.actRoute,
      queryParams: {
        search: params.search || null,
        apt: params.apt === undefined ? null : params.apt,
        page: params.page || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
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
    this.error.set(null);

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
    this.resultsLoading.set(true);

    this.resultService.findAllByEnterpriseId(this.id!, this.params()).subscribe({
      next: (results) => {
        this.pageableResponse.set(results);
        this.resultsLoading.set(false);
      },
      error: () => {
        this.pageableResponse.set(null);
        this.resultsLoading.set(false);
      },
    });
  }

  onSearch() {
    this.params.update((p) => ({
      ...p,
      search: p.search,
      page: 0,
    }));

    this.loadResults();
  }

  onApt(apt?: boolean) {
    this.params.update((p) => ({
      ...p,
      apt,
      page: 0,
    }));

    this.loadResults();
  }

  changePage(event: DataViewPageEvent) {
    const page = event.first / event.rows;

    this.params.update((p) => ({
      ...p,
      page,
    }));

    this.loadResults();
  }

  retry() {
    this.loadEnterprise();
    this.loadResults();
  }
}
