import { Component, computed, input } from '@angular/core';
import { ApiErrorResponse } from '../../../api/type/api.type';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-error-component',
  imports: [CardModule, ButtonModule],
  templateUrl: './error-component.html',
})
export class ErrorComponent {
  error = input.required<ApiErrorResponse | null>();
  // 403 means the user can't access this resource, so retrying won't help
  isForbidden = computed(() => this.error()?.status === 'FORBIDDEN');
}
