import { Component, inject, input, output, signal } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { DialogComponent } from '../../../../shared/components/ui/dialog-component/dialog-component';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AppointmentService, ExamType, Shift } from '../../appointment-service';
import { ExamService, ExamSummary } from '../../../exams/exam-service';
import { HttpErrorResponse } from '@angular/common/http';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ApiErrorResponse } from '../../../../shared/api/type/api.type';
import { RouterLink } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';

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
    TextareaModule,
    TooltipModule,
    RouterLink,
    SelectModule,
    MultiSelectModule,
  ],
  templateUrl: './create-appointment-component.html',
})
export class CreateAppointmentComponent {
  showTrigger = input<boolean>(true);
  visible = signal<boolean>(false);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<boolean>(false);
  id = signal<string | null>(null);
  examOptions = signal<ExamSummary[]>([]);
  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);
  private examService = inject(ExamService);
  refresh = output<void>();
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
  form = this.fb.nonNullable.group({
    employeeName: ['', Validators.required],
    employeeCpf: ['', Validators.required],
    enterpriseName: ['', Validators.required],
    enterpriseCnpj: ['', Validators.required],
    shift: undefined as Shift | undefined,
    examType: undefined as ExamType | undefined,
    exams: this.fb.nonNullable.control<string[]>([]),
    observation: ['', Validators.maxLength(500)],
  });

  constructor() {
    this.loadExams();
  }

  loadExams() {
    this.examService.all({ active: true }).subscribe({
      next: (exams) => this.examOptions.set(exams.content),
    });
  }

  createAppointment() {
    this.error.set(null);
    this.loading.set(true);
    this.success.set(false);

    const { exams, ...rest } = this.form.getRawValue();

    this.appointmentService.create({ ...rest, examIds: exams }).subscribe({
      next: (id) => {
        this.id.set(id);
        this.loading.set(false);
        this.success.set(true);
        this.refresh.emit();
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiErrorResponse;
        this.error.set(apiError.message);
        this.loading.set(false);
      },
    });
  }

  closeDialog() {
    this.error.set(null);
    this.success.set(false);
    this.id.set(null);
    this.form.reset();
    this.visible.set(false);
  }
}
