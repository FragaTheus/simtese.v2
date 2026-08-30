import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../../shared/api/type/api.type';
import { Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ErrorComponent } from '../../../shared/components/ui/error-component/error-component';
import { LoadingComponent } from '../../../shared/components/ui/loading-component/loading-component';

interface Card {
  imgSrc: string;
  title: string;
  subtitle: string;
  routerLink: string;
}

@Component({
  selector: 'app-dash-component',
  imports: [SkeletonModule, CardModule, ButtonModule, ErrorComponent, LoadingComponent],
  templateUrl: './dash-component.html',
})
export class DashComponent {
  nickname = signal<string | undefined>(undefined);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);
  private router = inject(Router);
  private authService = inject(AuthService);
  cards: Card[] = [
    {
      imgSrc: '/',
      title: 'Exames',
      subtitle: 'Gerencie os exames que irão aparecer no agendamento',
      routerLink: '/exames',
    },
  ];

  ngOnInit() {
    this.authenticate();
  }

  retry() {
    this.authenticate();
  }

  cancel() {
    this.router.navigate(['/']);
  }

  authenticate() {
    this.loading.set(true);
    this.error.set(null);

    this.authService.me().subscribe({
      next: (user) => {
        this.nickname.set(user.body?.name);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiErrorResponse;

        if (err.status == 401 || apiError.status == 'UNAUTHORIZED') {
          this.authService.logout();
          this.router.navigate(['/entrar']);
        }

        this.error.set(apiError);
      },
    });
  }
}
