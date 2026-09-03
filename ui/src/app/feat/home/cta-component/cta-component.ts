import { Component } from '@angular/core';
import { HomePageLayout } from '../../../shared/components/layout/home/home-page-layout/home-page-layout';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { RECEPCAO_E_AGENDAMENTOS } from '../links';

@Component({
  selector: 'app-cta-component',
  imports: [HomePageLayout, CardModule, ButtonModule, RouterLink],
  templateUrl: './cta-component.html',
})
export class CtaComponent {
  cta() {
    window.open(RECEPCAO_E_AGENDAMENTOS, '_blank');
  }
}
