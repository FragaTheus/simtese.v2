import { Component } from '@angular/core';
import { DashboardLayout } from '../../shared/layouts/dashboard/dashboard-layout';
import { CardModule } from 'primeng/card';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PageLayout } from '../../shared/layouts/page-layout/page-layout';

export interface DashCardItem {
  href: string;
  title: string;
  description: string;
  imgUrl: string;
}

@Component({
  selector: 'app-painel',
  imports: [DashboardLayout, CardModule, RouterLink, ButtonModule, PageLayout],
  templateUrl: './painel.html',
})
export class Painel {
  cards: DashCardItem[] = [
    {
      title: 'Exames',
      description: 'Acompanhe seus exames e resultados.',
      href: '/exames',
      imgUrl: '/dash-exam.png',
    },
  ];
}
