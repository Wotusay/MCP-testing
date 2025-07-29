import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { StatusType } from '../../base/component.interfaces';

@Component({
  selector: 'app-status-indicator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center">
      <div class="w-3 h-3 rounded-full mr-3" [class]="statusColor"></div>
      <span class="text-sm text-gray-700 dark:text-gray-300">{{ text }}</span>
    </div>
  `,
})
export class StatusIndicatorComponent {
  @Input() text: string = '';
  @Input() status: StatusType = 'success';

  get statusColor(): string {
    const colors = {
      success: 'bg-green-400 dark:bg-green-500',
      warning: 'bg-yellow-400 dark:bg-yellow-500',
      error: 'bg-red-400 dark:bg-red-500',
      info: 'bg-blue-400 dark:bg-blue-500',
      pending: 'bg-gray-400 dark:bg-gray-500',
    };
    return colors[this.status];
  }
}
