import { Component } from '@angular/core';
import { HeroComponent } from '../hero-component/hero-component';
import { HeaderComponent } from '../header-component/header-component';

@Component({
  selector: 'app-home-component',
  imports: [HeroComponent, HeaderComponent],
  templateUrl: './home-component.html',
})
export class HomeComponent {}
