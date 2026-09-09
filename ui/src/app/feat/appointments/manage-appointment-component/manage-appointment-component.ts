import { Component, effect, inject, input, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AppointmentInfo, AppointmentService } from '../appointment-service';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { AuthService } from '../../auth/auth-service';
import { ExamService } from '../../exams/exam-service';
import { CreateResultComponent } from '../../results/create-result-component/create-result-component';

@Component({
  selector: 'app-manage-appointment-component',
  imports: [ButtonModule, MenuModule, ConfirmDialogModule, CreateResultComponent],
  templateUrl: './manage-appointment-component.html',
})
export class ManageAppointmentComponent {
  private appointmentService = inject(AppointmentService);
  private confirmationService = inject(ConfirmationService);
  private examService = inject(ExamService);
  private router = inject(Router);
  private authService = inject(AuthService);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  appointment = input.required<AppointmentInfo>();
  items: MenuItem[] = [];
  exams = signal<string[]>([]);
  examsLoaded = output<string[]>();
  statusChanged = output<void>();
  resultDialogVisible = signal<boolean>(false);

  constructor() {
    effect(() => {
      const appointment = this.appointment();

      if (!appointment) {
        this.items = [];
        return;
      }

      this.authService.me().subscribe({
        next: (response) => {
          const user = response.body;

          if (user!.role === 'ADMIN') {
            this.items = [
              ...(appointment.examStatus === 'SCHEDULED'
                ? [{ label: 'Atender', icon: 'pi pi-check', command: () => this.attend() }]
                : []),
              ...(appointment.examStatus === 'ATTENDED'
                ? [{ label: 'Liberar', icon: 'pi pi-unlock', command: () => this.release() }]
                : []),
              { label: 'Excluir', icon: 'pi pi-trash', command: () => this.delete() },
            ];
          } else if (user!.role === 'RECEPTIONIST') {
            this.items = [
              ...(appointment.examStatus === 'SCHEDULED'
                ? [{ label: 'Atender', icon: 'pi pi-check', command: () => this.attend() }]
                : []),
            ];
          } else if (user!.role === 'NURSE') {
            this.items = [
              ...(appointment.examStatus === 'ATTENDED'
                ? [{ label: 'Liberar', icon: 'pi pi-unlock', command: () => this.release() }]
                : []),
            ];
          }

          if (appointment.examStatus === 'ATTENDED') {
            this.loadAppointmentExams();
          }
        },
      });
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
          next: () => {
            this.loadAppointmentExams();
            this.statusChanged.emit();
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
          next: () => {
            this.resultDialogVisible.set(true);
          },
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

  loadAppointmentExams() {
    this.examService.listByAppointment(this.appointment().id).subscribe({
      next: (exams: string[]) => {
        this.exams.set(exams);
        this.examsLoaded.emit(exams);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error);
      },
    });
  }
}
