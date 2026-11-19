import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HomePageLayout } from '../../../shared/components/layout/home/home-page-layout/home-page-layout';
import { ButtonModule } from 'primeng/button';
import { RECEPCAO_E_AGENDAMENTOS } from '../links';

@Component({
  selector: 'app-hero-component',
  imports: [NgOptimizedImage, HomePageLayout, ButtonModule],
  templateUrl: './hero-component.html',
})
export class HeroComponent {
  cta() {
    window.open(RECEPCAO_E_AGENDAMENTOS, '_blank');
  }
}
