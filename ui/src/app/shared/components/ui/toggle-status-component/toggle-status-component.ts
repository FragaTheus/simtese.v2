import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-toggle-status-component',
  imports: [ButtonModule, ConfirmPopupModule],
  templateUrl: './toggle-status-component.html',
})
export class ToggleStatusComponent {
  private readonly confirmationService = inject(ConfirmationService);
  status = input.required<boolean>();
  deactivate = input.required<() => void>();
  activate = input.required<() => void>();
  remove = input.required<() => void>();

  confirmDeactivate(event: Event) {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Deseja realmente desativar este recurso?',
      icon: 'pi pi-exclamation-triangle',

      acceptLabel: 'Desativar',
      rejectLabel: 'Cancelar',

      accept: () => {
        this.deactivate()();
      },
    });
  }

  confirmActivate(event: Event) {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Deseja realmente ativar este recurso?',
      icon: 'pi pi-exclamation-triangle',

      acceptLabel: 'Ativar',
      rejectLabel: 'Cancelar',

      accept: () => {
        this.activate()();
      },
    });
  }

  confirmRemove(event: Event) {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Deseja realmente excluir este recurso?',
      icon: 'pi pi-exclamation-triangle',

      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',

      accept: () => {
        this.remove()();
      },
    });
  }
}
