import { Component, HostListener, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header-component',
  imports: [ButtonModule],
  templateUrl: './header-component.html',
})
export class HeaderComponent {
  protected readonly scrolled = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 10);
  }
}
