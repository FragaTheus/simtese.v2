import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { API_V1_URL } from '../../../../shared/api/config/api.config';
import { AtendimentoPageComponent } from './atendimento-page-component';

describe('AtendimentoPageComponent', () => {
  let fixture: ComponentFixture<AtendimentoPageComponent>;
  let component: AtendimentoPageComponent;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AtendimentoPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });

    fixture = TestBed.createComponent(AtendimentoPageComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);

    http
      .expectOne((r) => r.url === `${API_V1_URL}/exams/lookup`)
      .flush([{ id: 'clinical', name: 'Exame clinico' }]);
  });

  afterEach(() => http.verify());

  function fillAll(role: string) {
    component.employeeForm.patchValue({
      employeeName: 'Maria da Silva',
      employeeCpf: '529.982.247-25',
      employeeRole: role,
    });
    component.enterpriseForm.patchValue({
      enterpriseName: 'Empresa Teste',
      enterpriseDocumentValue: '11.222.333/0001-81',
    });
    component.appointmentForm.patchValue({ shift: 'AFTERNOON', examType: 'PERIODIC' });
  }

  it('should keep the employee step valid without a role', () => {
    component.employeeForm.patchValue({
      employeeName: 'Maria da Silva',
      employeeCpf: '529.982.247-25',
    });

    expect(component.employeeForm.valid).toBe(true);
  });

  it('should block moving to the enterprise step when the employee is invalid', () => {
    const activate = vi.fn();

    component.goToEnterprise(activate);

    expect(activate).not.toHaveBeenCalled();
  });

  it('should advance steps when the forms are valid', () => {
    const activate = vi.fn();
    fillAll('');

    component.goToEnterprise(activate);
    component.goToAppointment(activate);

    expect(activate).toHaveBeenNthCalledWith(1, 2);
    expect(activate).toHaveBeenNthCalledWith(2, 3);
  });

  it('should schedule sending the trimmed role', () => {
    fillAll('  Auxiliar de Produção ');

    component.schedule();

    const req = http.expectOne(`${API_V1_URL}/appointments/schedule`);
    expect(req.request.body.employeeRole).toBe('Auxiliar de Produção');
    expect(req.request.body.employeeCpf).toBe('52998224725');
    expect(req.request.body.shift).toBe('AFTERNOON');
    req.flush('id');

    expect(component.success()).toBe(true);
  });

  it('should omit the role when blank', () => {
    fillAll('');

    component.schedule();

    const req = http.expectOne(`${API_V1_URL}/appointments/schedule`);
    expect('employeeRole' in req.request.body).toBe(false);
    req.flush('id');
  });

  it('should reset every form, including the role, for a new appointment', () => {
    fillAll('Soldadora');
    component.activeStep.set(3);

    component.newAppointment();

    expect(component.employeeForm.getRawValue()).toEqual({
      employeeName: '',
      employeeCpf: '',
      employeeRole: '',
    });
    expect(component.activeStep()).toBe(1);
    expect(component.success()).toBe(false);
  });
});
