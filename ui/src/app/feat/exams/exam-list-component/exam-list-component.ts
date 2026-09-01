import { Component, signal, inject, effect, computed } from '@angular/core';
import { ExamService } from '../exam-service';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { RouterBackComponent } from '../../../shared/components/ui/router-back-component/router-back-component';
import { ExamSummary } from '../exam-service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import {
  ListPageItem,
  ListPageLayout,
} from '../../../shared/components/layout/list-page-layout/list-page-layout';

@Component({
  selector: 'app-exam-list-component',
  imports: [InputTextModule, SelectModule, RouterBackComponent, FormsModule, ListPageLayout],
  templateUrl: './exam-list-component.html',
})
export class ExamListComponent {
  private examService = inject(ExamService);
  private searchSub = new Subject<string | undefined>();
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  statusOptions = [
    { label: 'Status', value: undefined },
    { label: 'Ativo', value: true },
    { label: 'Inativo', value: false },
  ];
  search = signal<string | undefined>(undefined);
  active = signal<boolean | undefined>(undefined);
  exams = signal<ExamSummary[]>([]);
  items = computed<ListPageItem[]>(() =>
    this.exams().map((e) => ({
      values: [e.name, e.active ? 'Ativo' : 'Inativo'],
      route: `/painel/exames/${e.id}`,
    })),
  );

  constructor() {
    this.searchSub.pipe(debounceTime(300)).subscribe((value) => {
      this.search.set(value);
    });

    effect(() => {
      this.search();
      this.active();
      this.loadExams();
    });
  }

  loadExams() {
    this.loading.set(true);
    this.error.set(null);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.search(),
        active: this.active(),
      },
      queryParamsHandling: 'merge',
    });

    this.examService.all(this.search(), this.active()).subscribe({
      next: (response) => {
        this.exams.set(response.content);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error);
        this.loading.set(false);
      },
    });
  }

  onSearch(value: any): void {
    this.searchSub.next(value);
  }

  retry() {
    this.loadExams();
  }
}
