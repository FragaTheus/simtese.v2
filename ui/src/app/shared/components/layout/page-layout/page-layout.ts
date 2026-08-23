import { Component, computed, input } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-page-layout',
  imports: [],
  templateUrl: './page-layout.html',
})
export class PageLayout {
  className = input<string>('');

  protected readonly classes = computed(() =>
    twMerge(`w-full max-w-6xl p-6 m-auto`, this.className()),
  );
}
