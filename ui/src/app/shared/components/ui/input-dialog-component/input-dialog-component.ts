import { Component, input, model, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-input-dialog-component',
  imports: [DialogModule],
  templateUrl: './input-dialog-component.html',
})
export class InputDialogComponent {
  header = input<string>('');
  visible = model<boolean>(false);
  onRefresh = output<void>();
  message = input<string>('');

  refresh() {
    this.onRefresh.emit();
  }
}
