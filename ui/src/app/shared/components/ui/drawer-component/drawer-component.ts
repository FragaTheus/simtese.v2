import { Component, inject, model, signal } from '@angular/core';
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

@Component({
  selector: 'app-drawer-component',
  imports: [
    DrawerModule,
    ButtonModule,
    PanelMenuModule,
    MenuModule,
    AvatarModule,
    ProfileChangePasswordComponent,
  ],
  templateUrl: './drawer-component.html',
})
export class DrawerComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  visible = model<boolean>(true);
  closeable = signal(true);
  changePasswordDialogVisible = signal(false);
  isMd = window.matchMedia('(min-width: 768px)').matches;
  items: MenuItem[] = [
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
  ];

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

  ngOnInit() {
    this.visible.set(this.isMd);
    this.closeable.set(!this.isMd);
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
