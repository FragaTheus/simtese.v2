import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-error-layout',
  imports: [CardModule, ButtonModule],
  templateUrl: './error-layout.html',
})
export class ErrorLayout {
  private readonly router = inject(Router);

  back(): void {
    this.router.navigate(['/']);
  }

  reload(): void {
    window.location.reload();
  }
}
