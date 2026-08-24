import { Component } from '@angular/core';
import { PageLayout } from '../../../shared/components/layout/page-layout/page-layout';

interface Bullet {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-bullets-component',
  imports: [PageLayout],
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
