import { Component, computed, input } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-home-page-layout',
  imports: [],
  templateUrl: './home-page-layout.html',
})
export class HomePageLayout {
  className = input<string>('');

  protected readonly classes = computed(() =>
    twMerge(`w-full max-w-6xl px-6 m-auto py-8`, this.className()),
  );
}
