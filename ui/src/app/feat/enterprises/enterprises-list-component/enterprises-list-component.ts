import { Component, effect, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { EnterpriseService, EnterprisesParams, EnterpriseSummary } from '../enterprise-service';
import { DashListPageLayout } from '../../../shared/components/layout/dash/dash-list-page-layout/dash-list-page-layout';
import { ApiErrorResponse, PageableResponse } from '../../../shared/api/type/api.type';
import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';
import { DashPageHeaderLayout } from '../../../shared/components/layout/dash/dash-page-header-layout/dash-page-header-layout';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DataView, DataViewPageEvent } from 'primeng/dataview';
import { CreateEnterpriseComponent } from '../create-enterprise-component/create-enterprise-component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

interface ActiveOption {
  label: string;
  active: boolean | undefined;
}

@Component({
  selector: 'app-enterprises-list-component',
  imports: [
    SkeletonModule,
    DashListPageLayout,
    DashPageLayout,
    DashPageHeaderLayout,
    ErrorComponent,
    RouterLink,
    DataView,
    CreateEnterpriseComponent,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    TooltipModule,
    FormsModule,
    SelectModule,
  ],
  templateUrl: './enterprises-list-component.html',
})
export class EnterprisesListComponent {
  private enterpriseService = inject(EnterpriseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  pageableResponse = signal<PageableResponse<EnterpriseSummary> | null>(null);
  params = signal<EnterprisesParams>(this.paramsFromQuery());
  activeOptions: ActiveOption[] = [
    {
      label: 'Todas',
      active: undefined,
    },
    {
      label: 'Ativas',
      active: true,
    },
    {
      label: 'Inativas',
      active: false,
    },
  ];

  constructor() {
    effect(() => this.syncQueryParams(this.params()));

    this.loadEnterprises();
  }

  private paramsFromQuery(): EnterprisesParams {
    const qp = this.route.snapshot.queryParamMap;

    return {
      search: qp.get('search') ?? undefined,
      active: qp.has('active') ? qp.get('active') === 'true' : undefined,
      page: qp.has('page') ? Number(qp.get('page')) : undefined,
    };
  }

  private syncQueryParams(params: EnterprisesParams) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: params.search || null,
        active: params.active === undefined ? null : params.active,
        page: params.page || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  loadEnterprises() {
    this.loading.set(true);
    this.error.set(null);

    this.enterpriseService.all(this.params()).subscribe({
      next: (enterprises) => {
        this.pageableResponse.set(enterprises);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error);
        this.loading.set(false);
      },
    });
  }

  onSearch() {
    this.params.update((p) => ({
      ...p,
      search: this.params().search,
      page: 0,
    }));

    this.loadEnterprises();
  }

  onActive(active?: boolean) {
    this.params.update((p) => ({ ...p, active, page: 0 }));
    this.loadEnterprises();
  }

  changePage(event: DataViewPageEvent) {
    const page = event.first / event.rows;

    this.params.update((p) => ({
      ...p,
      page,
    }));

    this.loadEnterprises();
  }

  refresh() {
    this.loadEnterprises();
  }
}
