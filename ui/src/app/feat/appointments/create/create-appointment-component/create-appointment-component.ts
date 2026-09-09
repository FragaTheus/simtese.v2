import { Component, inject, input, output, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';

import { DialogComponent } from '../../../../shared/components/ui/dialog-component/dialog-component';

import { AppointmentService, ExamType, Shift } from '../../appointment-service';

import { ExamService, ExamSummary } from '../../../exams/exam-service';

import { stripDocumentMask } from '../../../../shared/pipes/document-format-pipe';
import { ApiErrorResponse } from '../../../../shared/api/type/api.type';

interface ShiftOption {
  label: string;
  value: Shift;
}

interface ExamTypeOption {
  label: string;
  value: ExamType;
}

@Component({
  selector: 'app-create-appointment-component',
  imports: [
    DialogComponent,
    ButtonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    InputMaskModule,
    TextareaModule,
    TooltipModule,
    RouterLink,
    SelectModule,
    MultiSelectModule,
  ],
  templateUrl: './create-appointment-component.html',
})
export class CreateAppointmentComponent {
  private readonly fb = inject(FormBuilder);
  private readonly appointmentService = inject(AppointmentService);
  private readonly examService = inject(ExamService);

  private readonly CLINICAL_EXAM_NAME = 'Exame clinico';

  showTrigger = input<boolean>(true);

  refresh = output<void>();

  visible = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  id = signal<string | null>(null);

  examOptions = signal<ExamSummary[]>([]);
  complementaryExamOptions = signal<ExamSummary[]>([]);
  clinicalExam = signal<ExamSummary | null>(null);

  shiftOptions: ShiftOption[] = [
    {
      label: 'Manhã',
      value: 'MORNING',
    },
    {
      label: 'Tarde',
      value: 'AFTERNOON',
    },
  ];

  examTypeOptions: ExamTypeOption[] = [
    {
      label: 'Admissional',
      value: 'PRE_EMPLOYMENT',
    },
    {
      label: 'Demissional',
      value: 'TERMINATION',
    },
    {
      label: 'Periódico',
      value: 'PERIODIC',
    },
    {
      label: 'Retorno ao Trabalho',
      value: 'RETURN_TO_WORK',
    },
    {
      label: 'Avaliação Específica',
      value: 'SPECIFIC_EVALUATION',
    },
  ];

  form = this.fb.group({
    employeeName: this.fb.nonNullable.control('', Validators.required),

    employeeCpf: this.fb.nonNullable.control('', Validators.required),

    enterpriseName: this.fb.nonNullable.control('', Validators.required),

    enterpriseCnpj: this.fb.nonNullable.control('', Validators.required),

    shift: this.fb.control<Shift | null>(null, Validators.required),

    examType: this.fb.control<ExamType | null>(null, Validators.required),

    complementaryExamIds: this.fb.nonNullable.control<string[]>([]),

    observation: this.fb.nonNullable.control('', Validators.maxLength(500)),
  });

  constructor() {
    this.loadExams();
  }

  loadExams(): void {
    this.examService.all({ active: true }).subscribe({
      next: (response) => {
        const exams = response.content;

        this.examOptions.set(exams);

        const clinicalExam = exams.find(
          (exam) => exam.name.trim().toLowerCase() === this.CLINICAL_EXAM_NAME.toLowerCase(),
        );

        this.clinicalExam.set(clinicalExam ?? null);

        this.complementaryExamOptions.set(exams.filter((exam) => exam.id !== clinicalExam?.id));
      },

      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiErrorResponse;

        this.error.set(apiError?.message ?? 'Não foi possível carregar os exames.');
      },
    });
  }

  get availableExamTypeOptions(): ExamTypeOption[] {
    const shift = this.form.controls.shift.value;

    if (!shift) {
      return [];
    }

    if (shift === 'MORNING') {
      return this.examTypeOptions.filter(
        (option) => option.value !== 'RETURN_TO_WORK' && option.value !== 'SPECIFIC_EVALUATION',
      );
    }

    return this.examTypeOptions;
  }

  get canSelectComplementaryExams(): boolean {
    return this.form.controls.shift.value === 'MORNING';
  }

  onShiftChange(shift: Shift): void {
    const examTypeControl = this.form.controls.examType;

    const complementaryExamControl = this.form.controls.complementaryExamIds;

    if (shift === 'MORNING') {
      const examType = examTypeControl.value;

      if (examType === 'RETURN_TO_WORK' || examType === 'SPECIFIC_EVALUATION') {
        examTypeControl.reset();
      }

      return;
    }

    if (shift === 'AFTERNOON') {
      complementaryExamControl.setValue([]);
    }
  }

  createAppointment(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const clinicalExam = this.clinicalExam();

    if (!clinicalExam) {
      this.error.set(`O exame obrigatório "${this.CLINICAL_EXAM_NAME}" não foi encontrado.`);

      return;
    }

    const {
      employeeName,
      employeeCpf,
      enterpriseName,
      enterpriseCnpj,
      shift,
      examType,
      complementaryExamIds,
      observation,
    } = this.form.getRawValue();

    if (!shift || !examType) {
      return;
    }

    const examIds =
      shift === 'MORNING'
        ? [clinicalExam.id, ...complementaryExamIds.filter((examId) => examId !== clinicalExam.id)]
        : [clinicalExam.id];

    this.error.set(null);
    this.loading.set(true);
    this.success.set(false);

    this.appointmentService
      .create({
        employeeName,
        employeeCpf: stripDocumentMask(employeeCpf),

        enterpriseName,
        enterpriseCnpj: stripDocumentMask(enterpriseCnpj),

        shift,
        examType,
        observation,

        examIds,
      })
      .subscribe({
        next: (id) => {
          this.id.set(id);
          this.loading.set(false);
          this.success.set(true);

          this.refresh.emit();
        },

        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ApiErrorResponse;

          this.error.set(apiError?.message ?? 'Não foi possível cadastrar o agendamento.');

          this.loading.set(false);
        },
      });
  }

  closeDialog(): void {
    this.error.set(null);
    this.success.set(false);
    this.id.set(null);

    this.form.reset();

    this.visible.set(false);
  }
}
