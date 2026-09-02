import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-input-page-success-message-component',
  imports: [RouterLink],
  templateUrl: './input-page-success-message-component.html',
})
export class InputPageSuccessMessageComponent {
  route = input.required<string>();
  successMessage = input.required<string>();
}
