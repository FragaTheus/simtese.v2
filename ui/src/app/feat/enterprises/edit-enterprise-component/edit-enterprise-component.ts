import { Component, input, inject, signal, effect } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnterpriseInfo, EnterpriseService } from '../enterprise-service';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DialogComponent } from '../../../shared/components/ui/dialog-component/dialog-component';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-enterprise-component',
  imports: [
    MenuModule,
    ButtonModule,
    DialogComponent,
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    TooltipModule,
    ConfirmDialogModule,
  ],
  templateUrl: './edit-enterprise-component.html',
})
export class EditEnterpriseComponent {
  private enterpriseService = inject(EnterpriseService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  enterprise = input.required<EnterpriseInfo>();
  items: MenuItem[] = [];

  changeNameDialogVisible = signal<boolean>(false);
  changeNameForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const enterprise = this.enterprise();

      if (!enterprise) {
        this.items = [];
        return;
      }

      this.items = [
        ...(enterprise.active
          ? [
              {
                label: 'Alterar nome',
                icon: 'pi pi-pencil',
                command: () => this.changeNameDialogVisible.set(true),
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

    this.enterpriseService
      .change(this.enterprise().id, this.changeNameForm.getRawValue())
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

  deactivate() {
    this.confirmationService.confirm({
      key: 'toggle-enterprise-status',
      header: 'Deseja desativar a empresa?',
      message: 'Empresas desativadas não podem ter o nome alterado nem vincular novas contas.',
      acceptLabel: 'Desativar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.enterpriseService.deactivate(this.enterprise().id).subscribe({
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
      key: 'toggle-enterprise-status',
      header: 'Deseja reativar a empresa?',
      message: 'Somente empresas ativas podem ter contas vinculadas.',
      acceptLabel: 'Reativar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.enterpriseService.activate(this.enterprise().id).subscribe({
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
      key: 'toggle-enterprise-status',
      header: 'Deseja excluir a empresa?',
      message: 'Esta ação não pode ser desfeita.',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.enterpriseService.delete(this.enterprise().id).subscribe({
          next: () => this.router.navigate(['/painel/empresas']),
          error: (err: HttpErrorResponse) => {
            this.error.set(err.error);
          },
        });
      },
    });
  }
}
