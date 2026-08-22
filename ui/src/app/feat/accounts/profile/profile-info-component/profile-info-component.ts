import { Component, computed, inject, signal } from '@angular/core';
import {
  AuditInfo,
  InfoPageLayout,
  LabelField,
} from '../../../../shared/layouts/info-page-layout/info-page-layout';
import { LoadingLayout } from '../../../../shared/layouts/loading-layout/loading-layout';
import { ErrorLayout } from '../../../../shared/layouts/error-layout/error-layout';
import { AccountInfo, AccountService } from '../../account-service';
import { Router } from '@angular/router';
import { Auth } from '../../../auth';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ChangeNameComponent } from '../../change-name-component/change-name-component';

@Component({
  selector: 'app-profile-info-component',
  imports: [
    InfoPageLayout,
    LoadingLayout,
    ErrorLayout,
    ButtonModule,
    ConfirmPopupModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    FloatLabelModule,
    ChangeNameComponent,
  ],
  templateUrl: './profile-info-component.html',
})
export class ProfileInfoComponent {
  private readonly accountService = inject(AccountService);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  loading = signal<boolean>(true);
  error = signal<boolean>(false);
  account = signal<AccountInfo | null>(null);

  constructor() {
    this.loadAccount();
  }

  fields = computed<LabelField[]>(() => {
    const account = this.account();
    if (!account) {
      return [];
    }

    return [
      {
        label: 'id:',
        value: account.id,
      },
      {
        label: 'Nome:',
        value: account.name,
      },
      { label: 'Email:', value: account.email },
      { label: 'Permissão:', value: account.role },
      { label: 'Ativo:', value: account.active ? 'Sim' : 'Não' },
    ];
  });

  audit = computed<AuditInfo | null>(() => {
    const account = this.account();
    if (!account) {
      return null;
    }

    return {
      createdAt: account.createdAt,
      createdBy: account.createdBy,
      updatedAt: account.updatedAt,
      updatedBy: account.updatedBy,
    };
  });

  loadAccount() {
    this.loading.set(true);
    this.error.set(false);

    this.accountService.profileInfo().subscribe({
      next: (account) => {
        this.account.set(account);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  confirmLogout(event: Event) {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Deseja realmente sair do sistema?',
      icon: 'pi pi-exclamation-triangle',

      acceptLabel: 'Sair',
      rejectLabel: 'Cancelar',

      accept: () => {
        this.authService.logout();
        this.router.navigate(['/login']);
      },
    });
  }
}
