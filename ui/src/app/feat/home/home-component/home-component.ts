import { Component } from '@angular/core';
import { HeroComponent } from '../hero-component/hero-component';
import { HeaderComponent } from '../header-component/header-component';
import { BulletsComponent } from '../bullets-component/bullets-component';
import { IntroComponent } from '../intro-component/intro-component';
import { MvvComponent } from '../mvv-component/mvv-component';

@Component({
  selector: 'app-home-component',
  imports: [HeroComponent, HeaderComponent, BulletsComponent, IntroComponent, MvvComponent],
  templateUrl: './home-component.html',
})
export class HomeComponent {}
