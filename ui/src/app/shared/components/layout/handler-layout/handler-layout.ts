import { Component, input, output } from '@angular/core';
import { ApiErrorResponse } from '../../../api/type/api.type';
import { LoadingComponent } from '../../ui/loading-component/loading-component';
import { ErrorComponent } from '../../ui/error-component/error-component';

@Component({
  selector: 'app-handler-layout',
  imports: [LoadingComponent, ErrorComponent],
  templateUrl: './handler-layout.html',
})
export class HandlerLayout {
  loading = input.required<boolean>();
  error = input.required<ApiErrorResponse | null>();
  route = input.required<string>();
  retry = output<void>();
}
