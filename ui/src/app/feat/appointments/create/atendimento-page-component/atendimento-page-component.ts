import { Component, HostListener, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgTemplateOutlet } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';

import { HeaderComponent } from '../../../home/header-component/header-component';
import { FooterComponent } from '../../../home/footer-component/footer-component';

import {
  AppointmentService,
  CreateAppointmentRequest,
  ExamType,
  Shift,
} from '../../appointment-service';

import { ExamService, ExamSummary } from '../../../exams/exam-service';

import { ApiErrorResponse } from '../../../../shared/api/type/api.type';
import { stripDocumentMask } from '../../../../shared/pipes/document-format-pipe';

interface ShiftOption {
  label: string;
  value: Shift;
}

interface ExamTypeOption {
  label: string;
  value: ExamType;
}

@Component({
  selector: 'app-atendimento-page-component',
  imports: [
    ReactiveFormsModule,
    NgTemplateOutlet,
    ButtonModule,
    StepperModule,
    FloatLabelModule,
    InputTextModule,
    InputMaskModule,
    TextareaModule,
    SelectModule,
    MultiSelectModule,
    TooltipModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './atendimento-page-component.html',
})
export class AtendimentoPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly appointmentService = inject(AppointmentService);
  private readonly examService = inject(ExamService);

  private readonly CLINICAL_EXAM_NAME = 'Exame clinico';

  isDesktop = signal(window.innerWidth >= 768);

  activeStep = signal(1);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

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

  employeeForm = this.fb.nonNullable.group({
    employeeName: ['', Validators.required],
    employeeCpf: ['', Validators.required],
  });

  enterpriseForm = this.fb.nonNullable.group({
    enterpriseName: ['', Validators.required],
    enterpriseCnpj: ['', Validators.required],
  });

  appointmentForm = this.fb.group({
    shift: this.fb.control<Shift | null>(null, {
      validators: Validators.required,
    }),

    examType: this.fb.control<ExamType | null>(null, {
      validators: Validators.required,
    }),

    complementaryExamIds: this.fb.nonNullable.control<string[]>([]),

    observation: this.fb.nonNullable.control('', {
      validators: Validators.maxLength(500),
    }),
  });

  constructor() {
    this.loadExams();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isDesktop.set(window.innerWidth >= 768);
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
    const shift = this.appointmentForm.controls.shift.value;

    if (shift === 'MORNING') {
      return this.examTypeOptions.filter(
        (option) => option.value !== 'RETURN_TO_WORK' && option.value !== 'SPECIFIC_EVALUATION',
      );
    }

    return this.examTypeOptions;
  }

  get canSelectComplementaryExams(): boolean {
    return this.appointmentForm.controls.shift.value === 'MORNING';
  }

  onShiftChange(shift: Shift): void {
    const examTypeControl = this.appointmentForm.controls.examType;
    const complementaryExamsControl = this.appointmentForm.controls.complementaryExamIds;

    if (shift === 'MORNING') {
      const examType = examTypeControl.value;

      if (examType === 'RETURN_TO_WORK' || examType === 'SPECIFIC_EVALUATION') {
        examTypeControl.reset();
      }

      return;
    }

    if (shift === 'AFTERNOON') {
      complementaryExamsControl.setValue([]);
    }
  }

  goToEnterprise(activateCallback: (value: number) => void): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    activateCallback(2);
  }

  goToAppointment(activateCallback: (value: number) => void): void {
    if (this.enterpriseForm.invalid) {
      this.enterpriseForm.markAllAsTouched();
      return;
    }

    activateCallback(3);
  }

  schedule(): void {
    if (this.employeeForm.invalid || this.enterpriseForm.invalid || this.appointmentForm.invalid) {
      this.employeeForm.markAllAsTouched();
      this.enterpriseForm.markAllAsTouched();
      this.appointmentForm.markAllAsTouched();

      return;
    }

    const clinicalExam = this.clinicalExam();

    if (!clinicalExam) {
      this.error.set(`O exame obrigatório "${this.CLINICAL_EXAM_NAME}" não foi encontrado.`);

      return;
    }

    const employee = this.employeeForm.getRawValue();
    const enterprise = this.enterpriseForm.getRawValue();

    const { shift, examType, complementaryExamIds, observation } =
      this.appointmentForm.getRawValue();

    if (!shift || !examType) {
      return;
    }

    const examIds =
      shift === 'MORNING'
        ? [clinicalExam.id, ...complementaryExamIds.filter((examId) => examId !== clinicalExam.id)]
        : [clinicalExam.id];

    const request: CreateAppointmentRequest = {
      ...employee,
      ...enterprise,

      employeeCpf: stripDocumentMask(employee.employeeCpf),
      enterpriseCnpj: stripDocumentMask(enterprise.enterpriseCnpj),

      shift,
      examType,
      observation,

      examIds,
    };

    this.error.set(null);
    this.success.set(false);
    this.loading.set(true);

    this.appointmentService.create(request).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },

      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiErrorResponse;

        this.error.set(apiError?.message ?? 'Não foi possível realizar o agendamento.');

        this.loading.set(false);
      },
    });
  }

  newAppointment(): void {
    this.employeeForm.reset();
    this.enterpriseForm.reset();
    this.appointmentForm.reset();

    this.activeStep.set(1);

    this.error.set(null);
    this.success.set(false);
  }
}
