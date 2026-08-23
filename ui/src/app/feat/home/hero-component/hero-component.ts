import { Component } from '@angular/core';
import { PageLayout } from '../../../shared/components/layout/page-layout/page-layout';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-hero-component',
  imports: [PageLayout, ButtonModule],
  templateUrl: './hero-component.html',
})
export class HeroComponent {}
