import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TooltipData {
  day: string;
  primaryValue: number;
  secondaryValue: number;
  primaryLabel: string;
  secondaryLabel: string;
  total: number;
  primaryPercentage: number;
  secondaryPercentage: number;
}

@Component({
  selector: 'app-chart-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isVisible && data"
      class="chart-tooltip absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3 pointer-events-none"
      [style.left.px]="position.x"
      [style.top.px]="position.y"
    >
      <!-- Day header -->
      <div class="text-sm font-semibold text-gray-900 dark:text-white mb-2">
        {{ data.day }}
      </div>

      <!-- Primary value -->
      <div class="flex items-center space-x-2 mb-1">
        <div class="w-3 h-3 bg-primary-500 rounded"></div>
        <span class="text-sm text-gray-700 dark:text-gray-300">
          {{ data.primaryLabel }}:
        </span>
        <span class="text-sm font-medium text-gray-900 dark:text-white">
          {{ data.primaryValue }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          ({{ data.primaryPercentage }}%)
        </span>
      </div>

      <!-- Secondary value -->
      <div class="flex items-center space-x-2 mb-2">
        <div class="w-3 h-3 bg-success-500 rounded"></div>
        <span class="text-sm text-gray-700 dark:text-gray-300">
          {{ data.secondaryLabel }}:
        </span>
        <span class="text-sm font-medium text-gray-900 dark:text-white">
          {{ data.secondaryValue }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          ({{ data.secondaryPercentage }}%)
        </span>
      </div>

      <!-- Total -->
      <div class="pt-2 border-t border-gray-200 dark:border-gray-600">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total:
          </span>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ data.total }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .chart-tooltip {
        min-width: 200px;
        transform: translateX(-50%) translateY(-100%);
        margin-top: -8px;
      }

      .chart-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 6px solid transparent;
        border-top-color: rgb(249 250 251);
      }

      .dark .chart-tooltip::after {
        border-top-color: rgb(31 41 55);
      }
    `,
  ],
})
export class ChartTooltipComponent {
  @Input() isVisible = false;
  @Input() data: TooltipData | null = null;
  @Input() position = { x: 0, y: 0 };
}
