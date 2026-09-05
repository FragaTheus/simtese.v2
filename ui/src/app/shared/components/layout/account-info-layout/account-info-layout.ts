import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { AccountInfo, Role } from '../../../../feat/account/account-service';

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrador',
  NURSE: 'Enfermeiro(a)',
  RECEPTIONIST: 'Recepcionista',
  ENTERPRISE: 'Empresa',
};

@Component({
  selector: 'app-account-info-layout',
  imports: [CardModule, AvatarModule, SkeletonModule],
  templateUrl: './account-info-layout.html',
})
export class AccountInfoLayout {
  loading = input.required<boolean>();
  account = input.required<AccountInfo>();
  roleLabels = ROLE_LABELS;
  skeletons = Array.from({ length: 6 }, (_, i) => i);

  getInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  }
}
