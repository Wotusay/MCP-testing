import { Component, Input } from '@angular/core';

export type StatusType = 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-status-indicator',
  standalone: true,
  template: `
    <div class="flex items-center">
      <div class="w-3 h-3 rounded-full mr-3" [class]="statusColor"></div>
      <span class="text-sm text-gray-700">{{ text }}</span>
    </div>
  `,
})
export class StatusIndicatorComponent {
  @Input() text: string = '';
  @Input() status: StatusType = 'success';

  get statusColor(): string {
    const colors = {
      success: 'bg-green-400',
      warning: 'bg-yellow-400',
      error: 'bg-red-400',
      info: 'bg-blue-400',
    };
    return colors[this.status];
  }
}
