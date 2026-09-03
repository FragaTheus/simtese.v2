import { Component } from '@angular/core';
import { HomePageLayout } from '../../../shared/components/layout/home/home-page-layout/home-page-layout';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { COMERCIAL } from '../links';

interface Docs {
  title: string;
  description: string;
}

@Component({
  selector: 'app-docs-component',
  imports: [HomePageLayout, ButtonModule, CardModule],
  templateUrl: './docs-component.html',
})
export class DocsComponent {
  docs: Docs[] = [
    {
      title: 'PGR',
      description: 'Programa de Gerenciamento de Riscos',
    },
    {
      title: 'PCMSO',
      description: 'Programa de Controle Médico de Saúde Ocupacional',
    },
    {
      title: 'PPP',
      description: 'Perfil Profissiográfico Previdenciário',
    },
    {
      title: 'NRs',
      description: 'Normas Regulamentadoras',
    },
  ];

  cta() {
    window.open(COMERCIAL, '_blank');
  }
}
