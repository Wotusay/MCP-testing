import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
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
        <h3 class="ml-3 text-lg font-semibold text-gray-900">{{ title }}</h3>
      </div>
      <p class="text-gray-600">{{ description }}</p>
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
      red: 'bg-red-100',
      cyan: 'bg-cyan-100',
      green: 'bg-green-100',
      blue: 'bg-blue-100',
      purple: 'bg-purple-100',
    };
    return colors[this.iconColor];
  }

  get iconColorClass(): string {
    const colors = {
      red: 'text-red-600',
      cyan: 'text-cyan-600',
      green: 'text-green-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
    };
    return colors[this.iconColor];
  }
}
