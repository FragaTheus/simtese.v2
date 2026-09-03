import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { HomePageLayout } from '../../../shared/components/layout/home/home-page-layout/home-page-layout';

interface Mvv {
  icon: string;
  title: string;
  description: string;
  styleClass?: string;
}

@Component({
  selector: 'app-mvv-component',
  imports: [CardModule, HomePageLayout],
  templateUrl: './mvv-component.html',
})
export class MvvComponent {
  mvvList: Mvv[] = [
    {
      icon: 'pi pi-globe',
      title: 'Missão',
      description:
        'Fazer um trabalho que resguarde a integridade do funcionário protegendo a empresa.',
      styleClass: 'bg-clinical-teal text-white!',
    },
    {
      icon: 'pi pi-eye',
      title: 'Visão',
      description:
        'Ser referência em qualidade no atendimento, oferecendo conforto e tranquilidade.',
    },
    {
      icon: 'pi pi-heart',
      title: 'Valores',
      description:
        'Trabalhar com honestidade, profissionalismo e ética, valorizando o respeito e o trabalho em equipe.',
    },
  ];
}
