import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden-component',
  imports: [CardModule, ButtonModule, RouterLink],
  templateUrl: './forbidden-component.html',
})
export class ForbiddenComponent {}
