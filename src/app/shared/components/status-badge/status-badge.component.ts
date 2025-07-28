import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-status-badge',
  standalone: true,
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
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
    };
    return variants[this.variant];
  }
}
