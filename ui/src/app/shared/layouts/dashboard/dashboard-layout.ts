import { Component, inject, signal } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard-layout',
  imports: [DrawerModule, ButtonModule, RouterLink],
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayout {
  isMobile = signal(false);
  drawerVisible = signal(false);
  private readonly breakpointObserver = inject(BreakpointObserver);

  constructor() {
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe((result) => {
      this.isMobile.set(result.matches);
      if (result.matches) {
        this.drawerVisible.set(false);
      } else {
        this.drawerVisible.set(true);
      }
    });
  }
}
