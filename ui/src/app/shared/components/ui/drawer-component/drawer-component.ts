import { Component, computed, inject, model, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { DASH_ROUTE } from '../../../routes/routes';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { ProfileChangePasswordComponent } from '../../../../feat/account/profile/profile-change-password-component/profile-change-password-component';
import { AuthService } from '../../../../feat/auth/auth-service';
import { Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-drawer-component',
  imports: [
    DrawerModule,
    ButtonModule,
    PanelMenuModule,
    MenuModule,
    AvatarModule,
    ProfileChangePasswordComponent,
    SkeletonModule,
  ],
  templateUrl: './drawer-component.html',
})
export class DrawerComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  visible = model<boolean>(true);
  changePasswordDialogVisible = signal(false);
  private mediaQuery = window.matchMedia('(min-width: 768px)');
  isMd = signal(this.mediaQuery.matches);
  closeable = computed(() => !this.isMd());
  items = signal<MenuItem[]>([]);
  loading = signal<boolean>(false);

  profileItems: MenuItem[] = [
    {
      label: 'Conta',
      items: [
        {
          label: 'Ver perfil',
          icon: 'pi pi-user',
          routerLink: `${DASH_ROUTE}/perfil`,
        },
      ],
    },
    {
      label: 'Segurança',
      items: [
        {
          label: 'Alterar senha',
          icon: 'pi pi-key',
          command: () => this.changePasswordDialogVisible.set(true),
        },
        {
          label: 'Sair',
          icon: 'pi pi-sign-out',
          command: () => this.signOut(),
        },
      ],
    },
  ];

  constructor() {
    this.loading.set(true);
    this.visible.set(this.isMd());

    this.mediaQuery.addEventListener('change', (event) => {
      this.isMd.set(event.matches);
      this.visible.set(event.matches);
    });

    this.authService.me().subscribe({
      next: () => {
        const user = this.authService.user();

        console.log('USUARIO:', user);

        if (!user) {
          return;
        }

        if (user.role === 'ADMIN') {
          this.items.set([
            {
              label: 'Painel',
              icon: 'pi pi-home',
              routerLink: `${DASH_ROUTE}`,
            },
            {
              label: 'Agendamentos',
              icon: 'pi pi-calendar',
              routerLink: `${DASH_ROUTE}/agendamentos`,
            },
            {
              label: 'Exames',
              icon: 'pi pi-clipboard',
              routerLink: `${DASH_ROUTE}/exames`,
            },
            {
              label: 'Contas',
              icon: 'pi pi-users',
              routerLink: `${DASH_ROUTE}/contas`,
            },
            {
              label: 'Empresas',
              icon: 'pi pi-building',
              routerLink: `${DASH_ROUTE}/empresas`,
            },
            {
              label: 'Resultados',
              icon: 'pi pi-file',
              routerLink: `${DASH_ROUTE}/resultados`,
            },
          ]);
        } else if (user.role === 'NURSE' || user.role === 'RECEPTIONIST') {
          this.items.set([
            {
              label: 'Painel',
              icon: 'pi pi-home',
              routerLink: `${DASH_ROUTE}`,
            },
            {
              label: 'Agendamentos',
              icon: 'pi pi-calendar',
              routerLink: `${DASH_ROUTE}/agendamentos`,
            },
            {
              label: 'Exames',
              icon: 'pi pi-clipboard',
              routerLink: `${DASH_ROUTE}/exames`,
            },
            {
              label: 'Empresas',
              icon: 'pi pi-building',
              routerLink: `${DASH_ROUTE}/empresas`,
            },
          ]);
        } else if (user.role === 'ENTERPRISE') {
          this.items.set([
            {
              label: 'Painel',
              icon: 'pi pi-home',
              routerLink: `${DASH_ROUTE}`,
            },
          ]);
        }
      },
    });
    this.loading.set(false);
  }

  signOut() {
    this.authService.serverLogout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout() {
    this.authService.logout();
    this.router.navigate(['/entrar']);
  }
}
