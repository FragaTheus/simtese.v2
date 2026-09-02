import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-input-page-layout',
  imports: [CardModule, ButtonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './input-page-layout.html',
})
export class InputPageLayout {
  icon = input.required<string>();
  header = input.required<string>();
  description = input.required<string>();
  info = input.required<string>();
}
