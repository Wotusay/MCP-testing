import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-metrics-box',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="border rounded-lg p-4 mb-6" [class]="boxClass">
      <h3 class="font-semibold mb-2" [class]="titleClass">{{ title }}</h3>
      <p class="text-sm" [class]="contentClass">
        <ng-content></ng-content>
      </p>
    </div>
  `,
})
export class MetricsBoxComponent {
  @Input() title: string = '';
  @Input() variant: 'info' | 'success' | 'warning' | 'error' = 'info';

  get boxClass(): string {
    const variants = {
      info: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
      success:
        'bg-success-50 border-success-200 dark:bg-success-900/20 dark:border-success-700',
      warning:
        'bg-warning-50 border-warning-200 dark:bg-warning-900/20 dark:border-warning-700',
      error:
        'bg-danger-50 border-danger-200 dark:bg-danger-900/20 dark:border-danger-700',
    };
    return variants[this.variant];
  }

  get titleClass(): string {
    const variants = {
      info: 'text-gray-900 dark:text-gray-100',
      success: 'text-success-900 dark:text-success-200',
      warning: 'text-warning-900 dark:text-warning-200',
      error: 'text-danger-900 dark:text-danger-200',
    };
    return variants[this.variant];
  }

  get contentClass(): string {
    const variants = {
      info: 'text-gray-700 dark:text-gray-300',
      success: 'text-success-800 dark:text-success-300',
      warning: 'text-warning-800 dark:text-warning-300',
      error: 'text-danger-800 dark:text-danger-300',
    };
    return variants[this.variant];
  }
}
