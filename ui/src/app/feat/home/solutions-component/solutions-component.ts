import { Component } from '@angular/core';
import { HomePageLayout } from '../../../shared/components/layout/home/home-page-layout/home-page-layout';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

interface Solution {
  icon: string;
  title: string;
  description: string;
  styleClass?: string;
  href?: string;
}

@Component({
  selector: 'app-solutions-component',
  imports: [HomePageLayout, CardModule, ButtonModule],
  templateUrl: './solutions-component.html',
})
export class SolutionsComponent {
  solutions: Solution[] = [
    {
      icon: 'pi pi-desktop',
      title: 'Exames Clínicos (ASO)',
      description:
        'Avaliação médica completa para admissão, demissão, mudança de função e exames periódicos.',
      styleClass: 'md:col-span-2',
      href: '/agendar',
    },
    {
      icon: 'pi pi-mobile',
      title: 'Exames de Sangue',
      description: 'Análises laboratoriais completas.',
    },
    {
      icon: 'pi pi-cloud',
      title: 'Eletrocardiograma',
      description: 'Avaliação da atividade elétrica do coração.',
    },
    {
      icon: 'pi pi-cog',
      title: 'Eletroencefalograma',
      description: 'Análise da atividade cerebral.',
    },
    {
      icon: 'pi pi-cog',
      title: 'Audiometria',
      description: 'Exame de avaliação auditiva ocupacional.',
    },
  ];
}
