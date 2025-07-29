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
      info: 'bg-blue-50 border-blue-200',
      success: 'bg-green-50 border-green-200',
      warning: 'bg-yellow-50 border-yellow-200',
      error: 'bg-red-50 border-red-200',
    };
    return variants[this.variant];
  }

  get titleClass(): string {
    const variants = {
      info: 'text-blue-900',
      success: 'text-green-900',
      warning: 'text-yellow-900',
      error: 'text-red-900',
    };
    return variants[this.variant];
  }

  get contentClass(): string {
    const variants = {
      info: 'text-blue-800',
      success: 'text-green-800',
      warning: 'text-yellow-800',
      error: 'text-red-800',
    };
    return variants[this.variant];
  }
}
