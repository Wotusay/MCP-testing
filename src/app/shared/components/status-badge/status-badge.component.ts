import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
  template: `
    <span
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      [ngClass]="badgeClasses"
    >
      {{ text }}
    </span>
  `,
})
export class StatusBadgeComponent {
  @Input() text: string = '';
  @Input() variant: BadgeVariant = 'success';

  get badgeClasses(): string {
    const variants = {
      success:
        'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-200',
      warning:
        'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-200',
      error:
        'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-200',
      info: 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-200',
    };
    return variants[this.variant];
  }
}
