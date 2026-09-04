import { Component, input, inject, signal, effect } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamInfo, ExamService } from '../exam-service';
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
  selector: 'app-edit-exam-component',
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
  templateUrl: './edit-exam-component.html',
})
export class EditExamComponent {
  private examService = inject(ExamService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  exam = input.required<ExamInfo>();
  items: MenuItem[] = [];

  changeNameDialogVisible = signal<boolean>(false);
  changeNameForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const exam = this.exam();

      if (!exam) {
        this.items = [];
        return;
      }

      this.items = [
        ...(exam.active
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

    this.examService.change(this.exam().id, this.changeNameForm.getRawValue()).subscribe({
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
      key: 'toggle-exam-status',
      header: 'Deseja desativar o exame?',
      message:
        'Exames desativados não aparecem na lista de exames do agendamento e não podem ter o nome alterado.',
      acceptLabel: 'Desativar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.examService.deactivate(this.exam().id).subscribe({
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
      key: 'toggle-exam-status',
      header: 'Deseja reativar o exame?',
      message: 'Somente exames ativos aparecem na lista de exames do agendamento.',
      acceptLabel: 'Reativar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.examService.activate(this.exam().id).subscribe({
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
      key: 'toggle-exam-status',
      header: 'Deseja excluir o exame?',
      message: 'Esta ação não pode ser desfeita.',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.examService.delete(this.exam().id).subscribe({
          next: () => this.router.navigate(['/painel/exames']),
          error: (err: HttpErrorResponse) => {
            this.error.set(err.error);
          },
        });
      },
    });
  }
}
