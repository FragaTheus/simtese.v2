import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-info-page-layout',
  imports: [FieldsetModule, CardModule],
  templateUrl: './info-page-layout.html',
})
export class InfoPageLayout {}
