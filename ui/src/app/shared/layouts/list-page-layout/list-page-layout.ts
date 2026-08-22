import { Component, input, output, TemplateRef } from '@angular/core';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { PageLayout } from '../page-layout/page-layout';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CreateExamComponent } from '../../../feat/exams/create-exam-component/create-exam-component';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DataViewModule, DataViewPageEvent } from 'primeng/dataview';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { Page } from '../../../core/type/page.type';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

type ItemTemplate<T> = {
  $implicit: T;
};

export interface ListPageItem {
  values: string[];
  href: string;
}

@Component({
  selector: 'app-list-page-layout',
  imports: [
    DashboardLayout,
    PageLayout,
    ToolbarModule,
    ButtonModule,
    CreateExamComponent,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    DataViewModule,
    RouterLink,
    DataViewModule,
    NgTemplateOutlet,
    ReactiveFormsModule,
  ],
  templateUrl: './list-page-layout.html',
})
export class ListPageLayout {
  page = input.required<Page<ListPageItem>>();
  loading = input(false);

  pageChange = output<number>();
  searchChange = output<string>();

  protected readonly search = new FormControl('', {
    nonNullable: true,
  });

  constructor() {
    this.search.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => {
      this.searchChange.emit(value.trim());
    });
  }

  protected onPage(event: DataViewPageEvent) {
    const page = event.first / event.rows;

    this.pageChange.emit(page);
  }
}
