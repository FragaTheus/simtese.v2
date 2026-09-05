import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-account-info-layout',
  imports: [CardModule, AvatarModule, SkeletonModule],
  templateUrl: './account-info-layout.html',
})
export class AccountInfoLayout {
  loading = true;
}
