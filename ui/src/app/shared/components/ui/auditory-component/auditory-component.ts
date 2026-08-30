import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';

export interface AuditInfo {
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-auditory-component',
  imports: [CardModule, DatePipe],
  templateUrl: './auditory-component.html',
})
export class AuditoryComponent {
  auditInfo = input<AuditInfo | undefined>();
}
