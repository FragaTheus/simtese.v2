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
      icon: 'pi pi-calendar',
      title: 'Desde 2016',
      description: 'Experiência e confiança.',
    },
    {
      icon: 'pi pi-users',
      title: 'Equipe especializada',
      description: 'Cuidado próximo e humano.',
    },
    {
      icon: 'pi pi-bolt',
      title: 'Agilidade',
      description: 'Processos rápidos e eficientes.',
    },
    {
      icon: 'pi pi-building',
      title: 'Estrutura completa',
      description: 'Tecnologia e laboratório próprio.',
    },
  ];
}
