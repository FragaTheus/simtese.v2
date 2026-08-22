import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

import {
  ListPageItem,
  ListPageLayout,
} from '../../../shared/layouts/list-page-layout/list-page-layout';

import { ExamService } from '../exam-service';
import { Page } from '../../../core/type/page.type';
import { ErrorLayout } from '../../../shared/layouts/error-layout/error-layout';
import { CreateExamComponent } from '../create-exam-component/create-exam-component';
import { ToastComponent } from '../../../shared/components/ui/toast-component/toast-component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

type ExamStatusFilter = 'all' | 'active' | 'inactive';

@Component({
  selector: 'app-exams-component',
  imports: [
    ListPageLayout,
    ErrorLayout,
    CreateExamComponent,
    ToastModule,
    ButtonModule,
    ToastComponent,
    SelectButtonModule,
    FormsModule,
  ],
  templateUrl: './exams-component.html',
})
export class ExamsComponent {
  private readonly examService = inject(ExamService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  protected readonly statusFilter = signal<ExamStatusFilter>('all');

  protected readonly statusOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Ativos', value: 'active' },
    { label: 'Inativos', value: 'inactive' },
  ];

  protected readonly page = signal<Page<ListPageItem>>({
    content: [],
    number: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    numberOfElements: 0,
    first: true,
    last: true,
    empty: true,
  });

  protected readonly loading = signal(false);
  protected readonly error = signal(false);
  protected readonly search = signal('');

  constructor() {
    this.load();
  }

  protected onStatusChange(status: ExamStatusFilter) {
    this.statusFilter.set(status);
    this.load(0);
  }

  protected load(page = 0) {
    this.loading.set(true);
    this.error.set(false);

    const active = this.statusFilter() === 'all' ? undefined : this.statusFilter() === 'active';

    this.examService
      .list({
        page,
        search: this.search(),
        active,
      })
      .subscribe({
        next: (response) => {
          this.page.set({
            ...response,
            content: response.content.map((exam) => ({
              values: [exam.name, exam.active ? 'Ativo' : 'Inativo'],
              href: `/painel/exames/${exam.id}`,
            })),
          });

          this.loading.set(false);
        },

        error: () => {
          this.loading.set(false);
          this.error.set(true);
        },
      });
  }

  protected onPageChange(page: number) {
    this.load(page);
  }

  protected onSearchChange(search: string) {
    this.search.set(search);
    this.load(0);
  }

  protected onExamCreated(id: string) {
    this.messageService.add({
      key: 'exam-created',
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Exame cadastrado com sucesso!',
      life: 5000,
      data: {
        href: `/painel/exames/${id}`,
      },
    });

    this.load(this.page().number);
  }

  protected goToExam(id: string) {
    this.router.navigate(['/painel/exames', id]);
  }
}
