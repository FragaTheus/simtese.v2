import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, startWith } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DrawerComponent } from '../../../ui/drawer-component/drawer-component';
import { DASH_ROUTE } from '../../../../routes/routes';

@Component({
  selector: 'app-dash-layout',
  imports: [DrawerComponent, BreadcrumbModule, ButtonModule],
  templateUrl: './dash-layout.html',
})
export class DashLayout {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private mediaQuery = window.matchMedia('(min-width: 768px)');

  drawerVisible = signal(this.mediaQuery.matches);

  home: MenuItem = {
    icon: 'pi pi-home',
    routerLink: DASH_ROUTE,
  };

  private navigationEnd = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      startWith(null),
    ),
  );

  breadcrumbItems = computed<MenuItem[]>(() => {
    this.navigationEnd();

    return this.buildBreadcrumbItems(this.activatedRoute.root);
  });

  constructor() {
    this.mediaQuery.addEventListener('change', (event) => {
      this.drawerVisible.set(event.matches);
    });
  }

  private buildBreadcrumbItems(
    route: ActivatedRoute,
    url = '',
    items: MenuItem[] = [],
  ): MenuItem[] {
    const child = route.firstChild;

    if (!child) {
      return items;
    }

    const segment = child.snapshot.routeConfig?.path ?? '';

    const resolvedSegment = [...child.snapshot.paramMap.keys].reduce(
      (path, key) => path.replace(`:${key}`, child.snapshot.paramMap.get(key)!),
      segment,
    );

    const nextUrl = resolvedSegment ? `${url}/${resolvedSegment}` : url;

    const breadcrumb = child.snapshot.data['breadcrumb'];

    if (breadcrumb) {
      items.push({
        label: breadcrumb,
        routerLink: nextUrl,
      });
    }

    return this.buildBreadcrumbItems(child, nextUrl, items);
  }
}
