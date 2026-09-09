import { Component, effect, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { ResultService, ResultsParams, ResultSummary } from '../result-service';
import { DashListPageLayout } from '../../../shared/components/layout/dash/dash-list-page-layout/dash-list-page-layout';
import { ApiErrorResponse, PageableResponse } from '../../../shared/api/type/api.type';
import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';
import { DashPageHeaderLayout } from '../../../shared/components/layout/dash/dash-page-header-layout/dash-page-header-layout';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DataView, DataViewPageEvent } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

interface AptOption {
  label: string;
  apt: boolean | undefined;
}

@Component({
  selector: 'app-list-result-component',
  imports: [
    SkeletonModule,
    DashListPageLayout,
    DashPageLayout,
    DashPageHeaderLayout,
    ErrorComponent,
    RouterLink,
    DataView,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    TooltipModule,
    FormsModule,
    SelectModule,
  ],
  templateUrl: './list-result-component.html',
})
export class ListResultComponent {
  private resultService = inject(ResultService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);

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
      label: 'Inaptos',
      apt: false,
    },
  ];

  constructor() {
    effect(() => this.syncQueryParams(this.params()));

    this.loadResults();
  }

  private paramsFromQuery(): ResultsParams {
    const qp = this.route.snapshot.queryParamMap;

    return {
      search: qp.get('search') ?? undefined,
      apt: qp.has('apt') ? qp.get('apt') === 'true' : undefined,
      page: qp.has('page') ? Number(qp.get('page')) : undefined,
    };
  }

  private syncQueryParams(params: ResultsParams) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: params.search || null,
        apt: params.apt === undefined ? null : params.apt,
        page: params.page || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  loadResults() {
    this.loading.set(true);
    this.error.set(null);

    this.resultService.all(this.params()).subscribe({
      next: (results) => {
        this.pageableResponse.set(results);
        this.loading.set(false);
      },

      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiErrorResponse;

        this.error.set(apiError);
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

  refresh() {
    this.loadResults();
  }
}
