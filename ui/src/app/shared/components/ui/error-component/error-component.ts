import { Component, effect, inject, input, output } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ApiErrorResponse } from '../../../api/type/api.type';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-error-component',
  imports: [ConfirmDialogModule],
  templateUrl: './error-component.html',
})
export class ErrorComponent {
  private confirmationService = inject(ConfirmationService);
  error = input<ApiErrorResponse | null>(null);
  retry = output<void>();
  cancel = output<void>();

  constructor() {
    effect(() => {
      const error = this.error();

      if (!error) {
        return;
      }

      this.confirmationService.confirm({
        key: 'api-error',
        header: error.status,
        message: error.message,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Tentar novamente',
        rejectLabel: 'Cancelar',
        closable: false,
        dismissableMask: false,
        blockScroll: true,

        accept: () => {
          this.retry.emit();
        },
        reject: () => {
          this.cancel.emit();
        },
      });
    });
  }
}
