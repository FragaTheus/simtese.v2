import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { ToolbarModule } from 'primeng/toolbar';
import { RouterLink } from '@angular/router';
import { ApiErrorResponse } from '../../../api/type/api.type';
import { HandlerLayout } from '../handler-layout/handler-layout';

export interface ListPageItem {
  values: string[];
  route: string;
}

@Component({
  selector: 'app-list-page-layout',
  imports: [ToolbarModule, ButtonModule, CardModule, DataViewModule, RouterLink, HandlerLayout],
  templateUrl: './list-page-layout.html',
})
export class ListPageLayout {
  loading = input.required<boolean>();
  error = input.required<ApiErrorResponse | null>();
  route = input.required<string>();
  retry = output<void>();

  items = input.required<ListPageItem[]>();
  createRoute = input.required<string>();
  createLabel = input.required<string>();
}
