import { Component, HostListener, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { RECEPCAO_E_AGENDAMENTOS } from '../links';

@Component({
  selector: 'app-header-component',
  imports: [ButtonModule, MenuModule],
  templateUrl: './header-component.html',
})
export class HeaderComponent {
  protected readonly scrolled = signal(false);

  items: MenuItem[] = [];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 10);
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Portais',
        items: [
          {
            label: 'Portal SIMTESE',
            icon: 'pi pi-desktop',
            routerLink: '/login',
          },
          {
            label: 'Portal Woty',
            icon: 'pi pi-external-link',
            url: 'https://portal-woty.com.br',
            target: '_blank',
          },
        ],
      },
    ];
  }

  private scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  cta(): void {
    window.open(RECEPCAO_E_AGENDAMENTOS, '_blank');
  }
}
