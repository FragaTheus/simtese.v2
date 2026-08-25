import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PageLayout } from '../../../shared/components/layout/page-layout/page-layout';

interface Mvv {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-mvv-component',
  imports: [CardModule, PageLayout],
  templateUrl: './mvv-component.html',
})
export class MvvComponent {
  mvvList: Mvv[] = [
    {
      icon: 'pi pi-globe',
      title: 'Missão',
      description:
        'Fazer um trabalho que resguarde a integridade do funcionário protegendo a empresa.',
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
