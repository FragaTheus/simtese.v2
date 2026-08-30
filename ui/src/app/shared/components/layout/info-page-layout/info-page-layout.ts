import { Component, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { LoadingComponent } from '../../ui/loading-component/loading-component';
import { ApiErrorResponse } from '../../../api/type/api.type';
import { ErrorComponent } from '../../ui/error-component/error-component';

@Component({
  selector: 'app-info-page-layout',
  imports: [CardModule, LoadingComponent, ErrorComponent],
  templateUrl: './info-page-layout.html',
})
export class InfoPageLayout {
  loading = input<boolean>(false);
  error = input<ApiErrorResponse | null>(null);
  retry = output<void>();
  cancel = output<void>();
}
