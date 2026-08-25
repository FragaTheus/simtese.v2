import { Component } from '@angular/core';
import { HeroComponent } from '../hero-component/hero-component';
import { HeaderComponent } from '../header-component/header-component';
import { BulletsComponent } from '../bullets-component/bullets-component';
import { IntroComponent } from '../intro-component/intro-component';
import { MvvComponent } from '../mvv-component/mvv-component';
import { SolutionsComponent } from '../solutions-component/solutions-component';
import { DocsComponent } from '../docs-component/docs-component';
import { FooterComponent } from '../footer-component/footer-component';

@Component({
  selector: 'app-home-component',
  imports: [
    HeroComponent,
    HeaderComponent,
    BulletsComponent,
    IntroComponent,
    MvvComponent,
    SolutionsComponent,
    DocsComponent,
    FooterComponent,
  ],
  templateUrl: './home-component.html',
})
export class HomeComponent {}
