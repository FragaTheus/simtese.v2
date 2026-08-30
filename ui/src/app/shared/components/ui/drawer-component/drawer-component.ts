import { Component, model, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { DASH_ROUTE, EXAM_ROUTE } from '../../../routes/routes';
import { CreateExamComponent } from '../../../../feat/exams/create-exam-component/create-exam-component';

interface NavAction {
  title: string;
  icon: string;
  action: () => void;
}

interface NavButton {
  title: string;
  icon: string;
  label: string;
  route: string;
  navAction?: NavAction;
}

@Component({
  selector: 'app-drawer-component',
  imports: [DrawerModule, RouterLink, ButtonModule, CreateExamComponent],
  templateUrl: './drawer-component.html',
})
export class DrawerComponent {
  visible = model<boolean>(true);
  createExamVisible = model<boolean>(false);
  closeable = signal(true);
  isMd = window.matchMedia('(min-width: 768px)').matches;
  navButtons: NavButton[] = [
    { title: 'Painel', icon: 'pi pi-home', label: 'Home', route: DASH_ROUTE },
    {
      title: 'Ver todos os exames',
      icon: 'pi pi-clipboard',
      label: 'Exames',
      route: EXAM_ROUTE,
      navAction: {
        title: 'Cadastrar novo exame',
        icon: 'pi pi-plus',
        action: () => {
          this.createExamVisible.set(true);
        },
      },
    },
  ];

  ngOnInit() {
    this.visible.set(this.isMd);
    this.closeable.set(!this.isMd);
  }
}
