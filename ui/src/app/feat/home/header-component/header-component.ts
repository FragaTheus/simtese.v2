import { Component, HostListener, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-component',
  imports: [ButtonModule, MenuModule, RouterLink],
  templateUrl: './header-component.html',
})
export class HeaderComponent {
  protected readonly scrolled = signal(false);
  items: MenuItem[] | undefined;

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 10);
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Acesso rápido',
        items: [
          {
            label: 'Início',
            icon: 'pi pi-home',
            url: '#inicio',
          },
          {
            label: 'Sobre',
            icon: 'pi pi-info-circle',
            url: '#sobre',
          },
          {
            label: 'Serviços',
            icon: 'pi pi-briefcase',
            url: '#servicos',
          },
        ],
      },

      { separator: true },

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
          },
        ],
      },
    ];
  }
}
