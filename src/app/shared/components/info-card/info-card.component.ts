import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-info-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {{ title }}
      </h3>
      <p class="text-gray-700 dark:text-gray-300">{{ content }}</p>
    </div>
  `,
})
export class InfoCardComponent {
  @Input() title: string = '';
  @Input() content: string = '';
}
