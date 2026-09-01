import { Component, input, output } from '@angular/core';
import { ApiErrorResponse } from '../../../api/type/api.type';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-component',
  imports: [ButtonModule, RouterLink],
  templateUrl: './error-component.html',
})
export class ErrorComponent {
  error = input.required<ApiErrorResponse>();
  retry = output<void>();
  route = input.required<string>();

  onRetry() {
    this.retry.emit();
  }
}
