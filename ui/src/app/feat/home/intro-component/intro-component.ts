import { Component } from '@angular/core';
import { PageLayout } from '../../../shared/components/layout/page-layout/page-layout';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { COMERCIAL } from '../links';

interface ICardBulletItem {
  icon: string;
  title: string;
  bullet: string;
  image: string;
}

@Component({
  selector: 'app-intro-component',
  imports: [PageLayout, CardModule, ButtonModule],
  templateUrl: './intro-component.html',
})
export class IntroComponent {
  bullets: ICardBulletItem[] = [
    {
      icon: 'pi pi-cog',
      title: 'Um jeito próprio de trabalhar',
      bullet:
        'Desenvolvemos protocolos próprios de conferência e triagem para tornar os atendimentos mais ágeis, organizados e seguros.',
      image: '/attend-img.jpeg',
    },
    {
      icon: 'pi pi-building',
      title: 'Crescemos junto com nossos serviços',
      bullet:
        'Mudamos de endereço três vezes, ampliamos nossa estrutura, incorporamos novos exames e hoje contamos também com laboratório próprio.',
      image: '/reception-img.jpeg',
    },
    {
      icon: 'pi pi-users',
      title: 'Pessoas fazem parte dessa história',
      bullet:
        'Nosso crescimento foi construído por profissionais fixos e comprometidos que cresceram conosco e compartilham o mesmo cuidado com cada empresa.',
      image: '/intro-img.webp',
    },
  ];

  cta() {
    window.open(COMERCIAL, '_blank');
  }
}
