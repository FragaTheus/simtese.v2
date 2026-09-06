import { Component, input } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-audit-info-component',
  imports: [SkeletonModule, DatePipe],
  templateUrl: './audit-info-component.html',
})
export class AuditInfoComponent {
  loading = input<boolean>(false);
  createdBy = input<string | undefined>(undefined);
  createdByFallback = input<string>('N/A');
  createdAt = input<string | undefined>(undefined);
  updatedBy = input<string | undefined>(undefined);
  updatedAt = input<string | undefined>(undefined);
}
