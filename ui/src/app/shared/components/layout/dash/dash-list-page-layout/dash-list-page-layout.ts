import { Component, input } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { DataViewModule } from 'primeng/dataview';

@Component({
  selector: 'app-dash-list-page-layout',
  imports: [ToolbarModule, CardModule, SkeletonModule, DataViewModule],
  templateUrl: './dash-list-page-layout.html',
})
export class DashListPageLayout {
  loading = input.required<boolean>();
  skeletons = Array.from({ length: 10 }, (_, i) => i);
}
