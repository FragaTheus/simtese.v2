import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../feat/auth/auth-service';

@Component({
  selector: 'app-session-expired-component',
  imports: [ButtonModule],
  templateUrl: './session-expired-component.html',
})
export class SessionExpiredComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
