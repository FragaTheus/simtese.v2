import { Component, input, model } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

export type SeverityType =
  'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast';

@Component({
  selector: 'app-dialog-component',
  imports: [DialogModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './dialog-component.html',
})
export class DialogComponent {
  title = input<string>('Title');
  severity = input<SeverityType>('success');
  visible = model<boolean>(false);
  icon = input<string>('pi pi-info-circle');
}
