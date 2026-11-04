import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { API_V1_URL } from '../../../../shared/api/config/api.config';
import { CreateAppointmentComponent } from './create-appointment-component';

describe('CreateAppointmentComponent', () => {
  let fixture: ComponentFixture<CreateAppointmentComponent>;
  let component: CreateAppointmentComponent;
  let http: HttpTestingController;

  const exams = [
    { id: 'clinical', name: 'Exame clinico' },
    { id: 'audio', name: 'Audiometria' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateAppointmentComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });

    fixture = TestBed.createComponent(CreateAppointmentComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);

    http.expectOne((r) => r.url === `${API_V1_URL}/exams/lookup`).flush(exams);
  });

  afterEach(() => http.verify());

  function fillValidForm(role: string) {
    component.form.patchValue({
      employeeName: 'Maria da Silva',
      employeeCpf: '529.982.247-25',
      employeeRole: role,
      enterpriseName: 'Empresa Teste',
      enterpriseDocumentValue: '11.222.333/0001-81',
      shift: 'MORNING',
      examType: 'PERIODIC',
    });
  }

  it('should identify the clinical exam and keep it out of complementary options', () => {
    expect(component.clinicalExam()?.id).toBe('clinical');
    expect(component.complementaryExamOptions().map((e) => e.id)).toEqual(['audio']);
  });

  it('should not require the employee role', () => {
    fillValidForm('');

    expect(component.form.controls.employeeRole.valid).toBe(true);
    expect(component.form.valid).toBe(true);
  });

  it('should limit the employee role to 100 characters', () => {
    component.form.controls.employeeRole.setValue('a'.repeat(101));

    expect(component.form.controls.employeeRole.hasError('maxlength')).toBe(true);
  });

  it('should send the trimmed employee role to the API', () => {
    fillValidForm('  Soldadora  ');

    component.createAppointment();

    const req = http.expectOne(`${API_V1_URL}/appointments/schedule`);
    expect(req.request.body.employeeRole).toBe('Soldadora');
    expect(req.request.body.employeeCpf).toBe('52998224725');
    expect(req.request.body.enterpriseDocument).toEqual({ type: 'CNPJ', value: '11222333000181' });
    expect(req.request.body.examIds).toEqual(['clinical']);
    req.flush('new-id');

    expect(component.success()).toBe(true);
    expect(component.id()).toBe('new-id');
  });

  it('should omit the employee role when it is blank', () => {
    fillValidForm('   ');

    component.createAppointment();

    const req = http.expectOne(`${API_V1_URL}/appointments/schedule`);
    expect('employeeRole' in req.request.body).toBe(false);
    req.flush('new-id');
  });

  it('should not call the API when the form is invalid', () => {
    component.createAppointment();

    http.expectNone(`${API_V1_URL}/appointments/schedule`);
    expect(component.form.touched).toBe(true);
  });

  it('should show the API error message on failure', () => {
    fillValidForm('Soldadora');

    component.createAppointment();

    http
      .expectOne(`${API_V1_URL}/appointments/schedule`)
      .flush({ message: 'CPF inválido' }, { status: 400, statusText: 'Bad Request' });

    expect(component.error()).toBe('CPF inválido');
    expect(component.success()).toBe(false);
  });

  it('should clear the employee role when the dialog is closed', () => {
    fillValidForm('Soldadora');

    component.closeDialog();

    expect(component.form.controls.employeeRole.value).toBe('');
    expect(component.visible()).toBe(false);
  });
});
