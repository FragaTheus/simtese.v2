import { Component, inject, input } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { EnterpriseService } from '../enterprise-service';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-unlink-account-component',
  imports: [ButtonModule, ConfirmDialogModule],
  templateUrl: './unlink-account-component.html',
})
export class UnlinkAccountComponent {
  private confirmationService = inject(ConfirmationService);
  private enterpriseService = inject(EnterpriseService);
  enterpriseId = input.required<string>();

  unlink() {
    this.enterpriseService.unlinkAccount(this.enterpriseId()).subscribe({
      next: () => {
        window.location.reload();
      },
    });
  }

  confirm() {
    this.confirmationService.confirm({
      key: 'unlink-account',
      icon: 'pi pi-exclamation-triangle',
      header: 'Desvincular Conta',
      message: 'Tem certeza de que deseja desvincular esta conta?',
      rejectButtonStyleClass: 'bg-red-500 border-none',
      acceptButtonStyleClass: 'bg-green-500 border-none',
      acceptLabel: 'Desvincular',
      rejectLabel: 'Cancelar',
      closable: false,
      accept: () => {
        this.unlink();
      },
    });
  }
}
