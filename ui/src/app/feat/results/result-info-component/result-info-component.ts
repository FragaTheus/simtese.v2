import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';

import { DashPageLayout } from '../../../shared/components/layout/dash/dash-page-layout/dash-page-layout';
import { DashPageHeaderLayout } from '../../../shared/components/layout/dash/dash-page-header-layout/dash-page-header-layout';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';

import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { DocumentFormatPipe } from '../../../shared/pipes/document-format-pipe';

import { ResultInfo, ResultService } from '../result-service';

@Component({
  selector: 'app-result-info-component',
  imports: [
    CardModule,
    ButtonModule,
    SkeletonModule,
    TooltipModule,
    RouterLink,
    DashPageLayout,
    DashPageHeaderLayout,
    ErrorComponent,
    DocumentFormatPipe,
  ],
  templateUrl: './result-info-component.html',
})
export class ResultInfoComponent {
  private resultService = inject(ResultService);
  private actRoute = inject(ActivatedRoute);

  loading = signal<boolean>(false);
  fileLoading = signal<boolean>(false);

  error = signal<ApiErrorResponse | null>(null);
  result = signal<ResultInfo | undefined>(undefined);

  copiedField = signal<string | null>(null);

  id = this.actRoute.snapshot.paramMap.get('id');

  constructor() {
    this.loadResult();
  }

  loadResult() {
    this.loading.set(true);
    this.error.set(null);

    this.resultService.info(this.id!).subscribe({
      next: (result) => {
        this.result.set(result);
        this.loading.set(false);
      },

      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiErrorResponse;

        this.error.set(apiError);
        this.loading.set(false);
      },
    });
  }

  openFile() {
    const result = this.result();

    if (!result) {
      return;
    }

    this.fileLoading.set(true);

    this.resultService.file(result.resultId).subscribe({
      next: (file) => {
        const url = URL.createObjectURL(file);

        window.open(url, '_blank');

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);

        this.fileLoading.set(false);
      },

      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiErrorResponse;

        this.error.set(apiError);
        this.fileLoading.set(false);
      },
    });
  }

  retry() {
    this.loadResult();
  }

  copy(field: string, value: string) {
    navigator.clipboard.writeText(value);

    this.copiedField.set(field);

    setTimeout(() => {
      if (this.copiedField() === field) {
        this.copiedField.set(null);
      }
    }, 1500);
  }
}
