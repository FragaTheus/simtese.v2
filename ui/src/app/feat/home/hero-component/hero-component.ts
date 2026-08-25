import { Component } from '@angular/core';
import { PageLayout } from '../../../shared/components/layout/page-layout/page-layout';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { RECEPCAO_E_AGENDAMENTOS } from '../links';

@Component({
  selector: 'app-hero-component',
  imports: [PageLayout, ButtonModule, RouterLink],
  templateUrl: './hero-component.html',
})
export class HeroComponent {
  cta() {
    window.open(RECEPCAO_E_AGENDAMENTOS, '_blank');
  }
}
