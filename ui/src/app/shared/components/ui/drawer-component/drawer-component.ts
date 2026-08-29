import { Component, model, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { DASH_ROUTE, EXAM_ROUTE } from '../../../routes/routes';

interface NavButton {
  title: string;
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-drawer-component',
  imports: [DrawerModule, RouterLink, ButtonModule],
  templateUrl: './drawer-component.html',
})
export class DrawerComponent {
  visible = model<boolean>(true);
  closeable = signal(true);
  isMd = window.matchMedia('(min-width: 768px)').matches;
  navButtons: NavButton[] = [
    { title: 'Painel', icon: 'pi pi-home', label: 'Home', route: DASH_ROUTE },
    {
      title: 'Cadastrar novo exame',
      icon: 'pi pi-plus',
      label: 'Exame',
      route: `${EXAM_ROUTE}/cadastrar`,
    },
    { title: 'Ver todos os exames', icon: 'pi pi-clipboard', label: 'Exames', route: EXAM_ROUTE },
  ];

  ngOnInit() {
    this.visible.set(this.isMd);
    this.closeable.set(!this.isMd);
  }
}
