import { Component } from '@angular/core';
import { PageLayout } from '../../../shared/components/layout/page-layout/page-layout';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { RECEPCAO_E_AGENDAMENTOS } from '../links';

@Component({
  selector: 'app-cta-component',
  imports: [PageLayout, CardModule, ButtonModule, RouterLink],
  templateUrl: './cta-component.html',
})
export class CtaComponent {
  cta() {
    window.open(RECEPCAO_E_AGENDAMENTOS, '_blank');
  }
}
