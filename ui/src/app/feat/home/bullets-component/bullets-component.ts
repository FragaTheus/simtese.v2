import { Component } from '@angular/core';
import { HomePageLayout } from '../../../shared/components/layout/home/home-page-layout/home-page-layout';

interface Bullet {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-bullets-component',
  imports: [HomePageLayout],
  templateUrl: './bullets-component.html',
})
export class BulletsComponent {
  bullets: Bullet[] = [
    {
      icon: 'pi pi-sitemap',
      title: 'Atendimento integrado',
      description: 'Mais soluções reunidas em um só lugar.',
    },
    {
      icon: 'pi pi-check-circle',
      title: 'Processos próprios',
      description: 'Conferência e triagem em cada etapa.',
    },
    {
      icon: 'pi pi-chart-line',
      title: 'Evolução constante',
      description: 'Novos serviços, tecnologia e estrutura.',
    },
    {
      icon: 'pi pi-heart',
      title: 'Relações de confiança',
      description: 'Proximidade que acompanha cada atendimento.',
    },
  ];
}
