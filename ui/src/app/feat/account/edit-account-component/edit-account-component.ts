import { Component, input, inject, signal, effect } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountInfo, AccountService } from '../account-service';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DialogComponent } from '../../../shared/components/ui/dialog-component/dialog-component';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-account-component',
  imports: [
    MenuModule,
    ButtonModule,
    DialogComponent,
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    TooltipModule,
    ConfirmDialogModule,
  ],
  templateUrl: './edit-account-component.html',
})
export class EditAccountComponent {
  private accountService = inject(AccountService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  account = input.required<AccountInfo>();
  items: MenuItem[] = [];

  changeNameDialogVisible = signal<boolean>(false);
  changeNameForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  changePasswordDialogVisible = signal<boolean>(false);
  changePasswordForm = this.fb.nonNullable.group({
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const account = this.account();

      if (!account) {
        this.items = [];
        return;
      }

      this.items = [
        ...(account.active
          ? [
              {
                label: 'Alterar nome',
                icon: 'pi pi-pencil',
                command: () => this.changeNameDialogVisible.set(true),
              },
              {
                label: 'Alterar senha',
                icon: 'pi pi-key',
                command: () => this.changePasswordDialogVisible.set(true),
              },
              { label: 'Desativar', icon: 'pi pi-ban', command: () => this.deactivate() },
            ]
          : [
              { label: 'Reativar', icon: 'pi pi-refresh', command: () => this.activate() },
              { label: 'Excluir', icon: 'pi pi-trash', command: () => this.delete() },
            ]),
      ];
    });
  }

  changeName() {
    this.loading.set(true);

    this.accountService
      .changeName(this.account().id, this.changeNameForm.getRawValue().name)
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.changeNameDialogVisible.set(false);
          window.location.reload();
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(err.error);
        },
      });
  }

  changePassword() {
    this.loading.set(true);

    this.accountService
      .changePassword(this.account().id, this.changePasswordForm.getRawValue())
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.changePasswordDialogVisible.set(false);
          this.changePasswordForm.reset();
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(err.error);
        },
      });
  }

  deactivate() {
    this.confirmationService.confirm({
      key: 'toggle-account-status',
      header: 'Deseja desativar a conta?',
      message: 'Contas desativadas não podem acessar o sistema nem ter seus dados alterados.',
      acceptLabel: 'Desativar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.accountService.deactivate(this.account().id).subscribe({
          next: () => window.location.reload(),
          error: (err: HttpErrorResponse) => {
            this.error.set(err.error);
          },
        });
      },
    });
  }

  activate() {
    this.confirmationService.confirm({
      key: 'toggle-account-status',
      header: 'Deseja reativar a conta?',
      message: 'Somente contas ativas podem acessar o sistema.',
      acceptLabel: 'Reativar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.accountService.activate(this.account().id).subscribe({
          next: () => window.location.reload(),
          error: (err: HttpErrorResponse) => {
            this.error.set(err.error);
          },
        });
      },
    });
  }

  delete() {
    this.confirmationService.confirm({
      key: 'toggle-account-status',
      header: 'Deseja excluir a conta?',
      message: 'Esta ação não pode ser desfeita.',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.accountService.delete(this.account().id).subscribe({
          next: () => this.router.navigate(['/painel/contas']),
          error: (err: HttpErrorResponse) => {
            this.error.set(err.error);
          },
        });
      },
    });
  }
}
