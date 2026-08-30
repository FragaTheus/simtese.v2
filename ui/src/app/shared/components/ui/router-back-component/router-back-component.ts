import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-router-back-component',
  imports: [ButtonModule, RouterModule],
  templateUrl: './router-back-component.html',
})
export class RouterBackComponent {
  route = input<string>();
}
