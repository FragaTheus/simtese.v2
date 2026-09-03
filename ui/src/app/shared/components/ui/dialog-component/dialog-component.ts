import { Component, input, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-dialog-component',
  imports: [DialogModule],
  templateUrl: './dialog-component.html',
})
export class DialogComponent {
  visible = model<boolean>(false);
  icon = input.required<string>();
  title = input.required<string>();
}
