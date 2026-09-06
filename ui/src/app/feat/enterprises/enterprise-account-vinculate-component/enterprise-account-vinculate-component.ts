import { Component, inject, input, signal, viewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {
  AccountService,
  AccountSummary,
  AvailableEnterpriseAccountsParams,
} from '../../account/account-service';
import { EnterpriseService } from '../enterprise-service';
import { Popover, PopoverModule } from 'primeng/popover';
import { DataViewModule, DataViewPageEvent } from 'primeng/dataview';
import { PageableResponse } from '../../../shared/api/type/api.type';
import { HttpErrorResponse } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-enterprise-account-vinculate-component',
  imports: [
    ButtonModule,
    PopoverModule,
    DataViewModule,
    InputTextModule,
    FloatLabelModule,
    TooltipModule,
    FormsModule,
    ConfirmDialogModule,
  ],
  templateUrl: './enterprise-account-vinculate-component.html',
})
export class EnterpriseAccountVinculateComponent {
  private accountService = inject(AccountService);
  private enterpriseService = inject(EnterpriseService);
  private confirmationService = inject(ConfirmationService);
  error = signal<string | null>(null);
  loading = signal<boolean>(false);
  pageableResponse = signal<PageableResponse<AccountSummary> | null>(null);
  selectedAccountId = signal<string | null>(null);
  enterpriseId = input.required<string>();
  op = viewChild<Popover>('op');
  params = signal<AvailableEnterpriseAccountsParams>({
    page: 0,
    search: undefined,
  });

  loadEnterpriseAccounts() {
    this.loading.set(true);
    this.error.set(null);

    this.accountService.availableEnterpriseAccounts(this.params()).subscribe({
      next: (accounts) => {
        this.pageableResponse.set(accounts);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        const apiErrorMessage = err.error?.message ?? 'Erro desconhecido';
        this.error.set(apiErrorMessage);
        this.loading.set(false);
      },
    });
  }

  linkAccount(accountId: string) {
    this.loading.set(true);
    this.error.set(null);

    this.enterpriseService.linkAccount(this.enterpriseId(), accountId).subscribe({
      next: () => {
        this.selectedAccountId.set(accountId);
        this.loading.set(false);
        this.closeList();
      },
      error: (err: HttpErrorResponse) => {
        const apiErrorMessage = err.error?.message ?? 'Erro desconhecido';
        this.error.set(apiErrorMessage);
        this.loading.set(false);
      },
    });
  }

  confirmLinkAccount(event: Event, accountId: string) {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      key: 'link-account',
      icon: 'pi pi-link',
      header: 'Vincular Conta',
      rejectButtonStyleClass: 'bg-red-500 border-none',
      acceptButtonStyleClass: 'bg-green-500 border-none',
      message: 'Tem certeza de que deseja vincular esta conta?',
      acceptLabel: 'Vincular',
      rejectLabel: 'Cancelar',
      accept: () => this.linkAccount(accountId),
    });
  }

  openList(event: Event) {
    this.loadEnterpriseAccounts();
    this.op()?.toggle(event);
  }

  changePage(event: DataViewPageEvent) {
    const page = event.first / event.rows;

    this.params.update((p) => ({
      ...p,
      page,
    }));

    this.loadEnterpriseAccounts();
  }

  onSearch() {
    this.params.update((p) => ({
      ...p,
      search: this.params().search,
      page: 0,
    }));

    this.loadEnterpriseAccounts();
  }

  closeList() {
    window.location.reload();
    this.loading.set(false);
    this.error.set(null);
    this.op()?.hide();
  }
}
