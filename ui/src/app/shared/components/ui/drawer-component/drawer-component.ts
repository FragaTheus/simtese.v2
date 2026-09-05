import { Component, model, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { DASH_ROUTE } from '../../../routes/routes';

@Component({
  selector: 'app-drawer-component',
  imports: [DrawerModule, ButtonModule, PanelMenuModule],
  templateUrl: './drawer-component.html',
})
export class DrawerComponent {
  visible = model<boolean>(true);
  closeable = signal(true);
  isMd = window.matchMedia('(min-width: 768px)').matches;
  items: MenuItem[] = [
    {
      label: 'Painel',
      icon: 'pi pi-home',
      routerLink: `${DASH_ROUTE}`,
    },
    {
      label: 'Exames',
      icon: 'pi pi-clipboard',
      routerLink: `${DASH_ROUTE}/exames`,
    },
    {
      label: 'Contas',
      icon: 'pi pi-users',
      routerLink: `${DASH_ROUTE}/contas`,
    },
  ];

  ngOnInit() {
    this.visible.set(this.isMd);
    this.closeable.set(!this.isMd);
  }
}
