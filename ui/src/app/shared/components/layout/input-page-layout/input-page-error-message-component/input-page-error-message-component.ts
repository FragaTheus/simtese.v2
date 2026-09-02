import { Component, input } from '@angular/core';

@Component({
  selector: 'app-input-page-error-message-component',
  imports: [],
  templateUrl: './input-page-error-message-component.html',
})
export class InputPageErrorMessageComponent {
  error = input.required<string>();
}
