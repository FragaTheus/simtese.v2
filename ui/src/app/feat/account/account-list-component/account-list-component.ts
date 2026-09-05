import { Component, effect, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { AccountService, AccountsParams, AccountSummary, Role } from '../account-service';
import { DashListPageLayout } from '../../../shared/components/layout/dash/dash-list-page-layout/dash-list-page-layout';
import { ApiErrorResponse, PageableResponse } from '../../../shared/api/type/api.type';
import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';
import { DashPageHeaderLayout } from '../../../shared/components/layout/dash/dash-page-header-layout/dash-page-header-layout';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DataView, DataViewPageEvent } from 'primeng/dataview';
import { CreateAccountComponent } from '../create-account-component/create-account-component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

interface ActiveOption {
  label: string;
  active: boolean | undefined;
}

interface RoleOption {
  label: string;
  role: Role | undefined;
}

@Component({
  selector: 'app-account-list-component',
  imports: [
    SkeletonModule,
    DashListPageLayout,
    DashPageLayout,
    DashPageHeaderLayout,
    ErrorComponent,
    RouterLink,
    DataView,
    CreateAccountComponent,
    ButtonModule,
    RouterLink,
    InputTextModule,
    FloatLabelModule,
    TooltipModule,
    FormsModule,
    SelectModule,
  ],
  templateUrl: './account-list-component.html',
})
export class AccountListComponent {
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  pageableResponse = signal<PageableResponse<AccountSummary> | null>(null);
  params = signal<AccountsParams>(this.paramsFromQuery());
  activeOptions: ActiveOption[] = [
    {
      label: 'Todos',
      active: undefined,
    },
    {
      label: 'Ativos',
      active: true,
    },
    {
      label: 'Inativos',
      active: false,
    },
  ];
  roleOptions: RoleOption[] = [
    { label: 'Todos', role: undefined },
    { label: 'Administrador', role: 'ADMIN' },
    { label: 'Enfermeiro(a)', role: 'NURSE' },
    { label: 'Recepcionista', role: 'RECEPTIONIST' },
    { label: 'Empresa', role: 'ENTERPRISE' },
  ];

  selectedOption: ActiveOption | undefined;

  constructor() {
    effect(() => this.syncQueryParams(this.params()));

    this.loadAccounts();
  }

  private paramsFromQuery(): AccountsParams {
    const qp = this.route.snapshot.queryParamMap;

    return {
      search: qp.get('search') ?? undefined,
      active: qp.has('active') ? qp.get('active') === 'true' : undefined,
      role: (qp.get('role') as Role | null) ?? undefined,
      page: qp.has('page') ? Number(qp.get('page')) : undefined,
    };
  }

  private syncQueryParams(params: AccountsParams) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: params.search || null,
        active: params.active === undefined ? null : params.active,
        role: params.role || null,
        page: params.page || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  loadAccounts() {
    this.loading.set(true);
    this.error.set(null);

    this.accountService.all(this.params()).subscribe({
      next: (accounts) => {
        this.pageableResponse.set(accounts);
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

    this.loadAccounts();
  }

  onActive(active?: boolean) {
    this.params.update((p) => ({ ...p, active, page: 0 }));
    this.loadAccounts();
  }

  onRole(role?: Role) {
    this.params.update((p) => ({ ...p, role, page: 0 }));
    this.loadAccounts();
  }

  changePage(event: DataViewPageEvent) {
    const page = event.first / event.rows;

    this.params.update((p) => ({
      ...p,
      page,
    }));

    this.loadAccounts();
  }

  refresh() {
    this.loadAccounts();
  }
}
