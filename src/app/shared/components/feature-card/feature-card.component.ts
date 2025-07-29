import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center mb-4">
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center"
          [class]="iconBackgroundClass"
        >
          <svg
            class="w-6 h-6"
            [class]="iconColorClass"
            fill="currentColor"
            viewBox="0 0 24 24"
            [attr.aria-label]="iconLabel || null"
            [attr.aria-hidden]="!iconLabel"
          >
            <path [attr.d]="iconPath" />
          </svg>
        </div>
        <h3 class="ml-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ title }}
        </h3>
      </div>
      <p class="text-gray-700 dark:text-gray-300">{{ description }}</p>
    </div>
  `,
})
export class FeatureCardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() iconPath: string = '';
  @Input() iconColor: 'red' | 'cyan' | 'green' | 'blue' | 'purple' = 'blue';
  @Input() iconLabel?: string;

  get iconBackgroundClass(): string {
    const colors = {
      red: 'bg-red-100 dark:bg-red-900/30',
      cyan: 'bg-cyan-100 dark:bg-cyan-900/30',
      green: 'bg-green-100 dark:bg-green-900/30',
      blue: 'bg-blue-100 dark:bg-blue-900/30',
      purple: 'bg-purple-100 dark:bg-purple-900/30',
    };
    return colors[this.iconColor];
  }

  get iconColorClass(): string {
    const colors = {
      red: 'text-red-600 dark:text-red-400',
      cyan: 'text-cyan-600 dark:text-cyan-400',
      green: 'text-green-600 dark:text-green-400',
      blue: 'text-blue-600 dark:text-blue-400',
      purple: 'text-purple-600 dark:text-purple-400',
    };
    return colors[this.iconColor];
  }
}
