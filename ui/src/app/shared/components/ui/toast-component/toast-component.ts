import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-toast-component',
  imports: [ToastModule, ButtonModule, RouterLink],
  templateUrl: './toast-component.html',
})
export class ToastComponent {
  key = input.required<string>();
  actionLabel = input<string>('Ver');
}
