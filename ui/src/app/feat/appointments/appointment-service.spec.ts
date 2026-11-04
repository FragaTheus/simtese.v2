import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { API_V1_URL } from '../../shared/api/config/api.config';
import { AppointmentService, CreateAppointmentRequest } from './appointment-service';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AppointmentService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should send the employee role when creating an appointment', () => {
    const request: CreateAppointmentRequest = {
      employeeName: 'Maria da Silva',
      employeeCpf: '52998224725',
      employeeRole: 'Soldadora',
      enterpriseName: 'Empresa Teste',
      enterpriseDocument: { type: 'CNPJ', value: '11222333000181' },
      shift: 'MORNING',
      examType: 'PERIODIC',
      examIds: ['exam-1'],
    };

    let created: string | undefined;
    service.create(request).subscribe((id) => (created = id));

    const req = http.expectOne(`${API_V1_URL}/appointments/schedule`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.employeeRole).toBe('Soldadora');

    req.flush('appointment-id');
    expect(created).toBe('appointment-id');
  });

  it('should allow creating an appointment without role', () => {
    service
      .create({
        employeeName: 'Maria da Silva',
        employeeCpf: '52998224725',
        enterpriseName: 'Empresa Teste',
        enterpriseDocument: { type: 'CNPJ', value: '11222333000181' },
      })
      .subscribe();

    const req = http.expectOne(`${API_V1_URL}/appointments/schedule`);
    expect('employeeRole' in req.request.body).toBe(false);
    req.flush('id');
  });

  it('should load appointment info including the employee role', () => {
    let role: string | undefined;
    service.info('abc').subscribe((info) => (role = info.employeeRole));

    const req = http.expectOne(`${API_V1_URL}/appointments/abc`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 'abc', employeeRole: 'N/A' });

    expect(role).toBe('N/A');
  });

  it('should build list query params skipping empty filters', () => {
    service.all({ page: 2, shift: 'AFTERNOON', search: '' }).subscribe();

    const req = http.expectOne((r) => r.url === `${API_V1_URL}/appointments`);
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('shift')).toBe('AFTERNOON');
    expect(req.request.params.has('search')).toBe(false);
    expect(req.request.params.has('examStatus')).toBe(false);
    req.flush({ content: [] });
  });

  it('should call attend, release and delete endpoints', () => {
    service.attend('1').subscribe();
    expect(http.expectOne(`${API_V1_URL}/appointments/1/attend`).request.method).toBe('PATCH');

    service.release('1').subscribe();
    expect(http.expectOne(`${API_V1_URL}/appointments/1/release`).request.method).toBe('PATCH');

    service.delete('1').subscribe();
    expect(http.expectOne(`${API_V1_URL}/appointments/1`).request.method).toBe('DELETE');
  });
});
