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
  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);
  private examService = inject(ExamService);

  isDesktop = signal(window.innerWidth >= 768);
  activeStep = signal(1);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  examOptions = signal<ExamSummary[]>([]);

  shiftOptions: ShiftOption[] = [
    { label: 'Manhã', value: 'MORNING' },
    { label: 'Tarde', value: 'AFTERNOON' },
  ];
  examTypeOptions: ExamTypeOption[] = [
    { label: 'Admissional', value: 'PRE_EMPLOYMENT' },
    { label: 'Demissional', value: 'TERMINATION' },
    { label: 'Periódico', value: 'PERIODIC' },
    { label: 'Retorno ao Trabalho', value: 'RETURN_TO_WORK' },
    { label: 'Avaliação Específica', value: 'SPECIFIC_EVALUATION' },
  ];

  employeeForm = this.fb.nonNullable.group({
    employeeName: ['', Validators.required],
    employeeCpf: ['', Validators.required],
  });

  enterpriseForm = this.fb.nonNullable.group({
    enterpriseName: ['', Validators.required],
    enterpriseCnpj: ['', Validators.required],
  });

  appointmentForm = this.fb.nonNullable.group({
    shift: undefined as Shift | undefined,
    examType: undefined as ExamType | undefined,
    exams: this.fb.nonNullable.control<string[]>([]),
    observation: ['', Validators.maxLength(500)],
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
      next: (exams) => this.examOptions.set(exams.content),
    });
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
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    this.error.set(null);
    this.loading.set(true);
    this.success.set(false);

    const { exams, ...appointmentRest } = this.appointmentForm.getRawValue();
    const employee = this.employeeForm.getRawValue();
    const enterprise = this.enterpriseForm.getRawValue();

    // Os 3 formulários são combinados num único payload apenas no frontend
    const request: CreateAppointmentRequest = {
      ...employee,
      ...enterprise,
      ...appointmentRest,
      employeeCpf: stripDocumentMask(employee.employeeCpf),
      enterpriseCnpj: stripDocumentMask(enterprise.enterpriseCnpj),
      examIds: exams,
    };

    this.appointmentService.create(request).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiErrorResponse;
        this.error.set(apiError.message);
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
