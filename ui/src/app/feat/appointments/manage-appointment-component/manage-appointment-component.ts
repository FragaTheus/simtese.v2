import { Component, effect, inject, input, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AppointmentInfo, AppointmentService } from '../appointment-service';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';

@Component({
  selector: 'app-manage-appointment-component',
  imports: [ButtonModule, MenuModule, ConfirmDialogModule],
  templateUrl: './manage-appointment-component.html',
})
export class ManageAppointmentComponent {
  private appointmentService = inject(AppointmentService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  appointment = input.required<AppointmentInfo>();
  items: MenuItem[] = [];
  exams = signal<string[]>([]);
  examsLoaded = output<string[]>();

  constructor() {
    effect(() => {
      const appointment = this.appointment();

      if (!appointment) {
        this.items = [];
        return;
      }

      this.items = [
        ...(appointment.examStatus === 'SCHEDULED'
          ? [{ label: 'Atender', icon: 'pi pi-check', command: () => this.attend() }]
          : []),
        ...(appointment.examStatus === 'ATTENDED'
          ? [{ label: 'Liberar', icon: 'pi pi-unlock', command: () => this.release() }]
          : []),
        { label: 'Excluir', icon: 'pi pi-trash', command: () => this.delete() },
      ];
    });
  }

  attend() {
    this.confirmationService.confirm({
      key: 'toggle-appointment-status',
      header: 'Deseja marcar o agendamento como atendido?',
      message: 'O agendamento passará para o status "Atendido".',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.appointmentService.attend(this.appointment().id).subscribe({
          next: (exams: string[]) => {
            this.exams.set(exams);
            this.examsLoaded.emit(exams);
          },
          error: (err: HttpErrorResponse) => {
            this.error.set(err.error);
          },
        });
      },
    });
  }

  release() {
    this.confirmationService.confirm({
      key: 'toggle-appointment-status',
      header: 'Deseja liberar o agendamento?',
      message: 'O agendamento passará para o status "Liberado".',
      acceptLabel: 'Liberar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.appointmentService.release(this.appointment().id).subscribe({
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
      key: 'toggle-appointment-status',
      header: 'Deseja excluir o agendamento?',
      message: 'Esta ação não pode ser desfeita.',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.appointmentService.delete(this.appointment().id).subscribe({
          next: () => this.router.navigate(['/painel/agendamentos']),
          error: (err: HttpErrorResponse) => {
            this.error.set(err.error);
          },
        });
      },
    });
  }
}
