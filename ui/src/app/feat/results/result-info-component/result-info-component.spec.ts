import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ResultInfo, ResultService } from '../result-service';
import { ResultInfoComponent } from './result-info-component';

describe('ResultInfoComponent', () => {
  let fixture: ComponentFixture<ResultInfoComponent>;
  let component: ResultInfoComponent;
  let previewClosed: boolean;
  let createObjectURL: ReturnType<typeof vi.fn>;
  let revokeObjectURL: ReturnType<typeof vi.fn>;

  const result: ResultInfo = {
    resultId: 'result-1',
    employeeName: 'Maria da Silva',
    employeeCpf: '52998224725',
    enterpriseName: 'Empresa Teste',
    enterpriseDocument: '11222333000181',
    enterpriseDocumentType: 'CNPJ',
    apt: true,
  };

  beforeEach(() => {
    previewClosed = false;
    createObjectURL = vi.fn().mockReturnValue('blob:result-1');
    revokeObjectURL = vi.fn();

    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      imports: [ResultInfoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'result-1' } } },
        },
        {
          provide: ResultService,
          useValue: {
            info: () => of(result),
            file: () => of(new Blob(['%PDF-1.4'], { type: 'application/pdf' })),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(ResultInfoComponent);
    component = fixture.componentInstance;
    vi.spyOn(window, 'open').mockReturnValue({
      get closed() {
        return previewClosed;
      },
    } as Window);
  });

  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('keeps the preview URL valid until its window is closed', () => {
    component.openFile();

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(revokeObjectURL).not.toHaveBeenCalled();

    vi.advanceTimersByTime(5000);
    expect(revokeObjectURL).not.toHaveBeenCalled();

    previewClosed = true;
    vi.advanceTimersByTime(250);

    expect(revokeObjectURL).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:result-1');
  });
});
