import { Component, model, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { DASH_ROUTE } from '../../../routes/routes';

const EXAM_ROUTE = `${DASH_ROUTE}/exames`;

@Component({
  selector: 'app-drawer-component',
  imports: [DrawerModule, RouterLink, ButtonModule, PanelMenuModule],
  templateUrl: './drawer-component.html',
})
export class DrawerComponent {
  visible = model<boolean>(true);
  closeable = signal(true);
  isMd = window.matchMedia('(min-width: 768px)').matches;
  items: MenuItem[] = [
    {
      label: 'Exames',
      icon: 'pi pi-clipboard',
      items: [
        {
          label: 'Cadastrar',
          icon: 'pi pi-plus',
          routerLink: `${EXAM_ROUTE}/cadastrar`,
        },
        {
          label: 'Ver todos',
          icon: 'pi pi-search',
          routerLink: `${EXAM_ROUTE}`,
        },
      ],
    },
  ];

  ngOnInit() {
    this.visible.set(this.isMd);
    this.closeable.set(!this.isMd);
  }
}
