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
      class="chart-tooltip absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg pointer-events-none"
      [class.compact]="compact"
      [class.p-2]="compact"
      [class.p-3]="!compact"
      [style.left.px]="position.x"
      [style.top.px]="position.y"
    >
      <!-- Day header -->
      <div
        class="text-sm font-semibold text-gray-900 dark:text-white"
        [class.mb-2]="!compact"
        [class.mb-1]="compact"
      >
        {{ data.day }}
      </div>

      <!-- Primary value -->
      <div
        class="flex items-center mb-1"
        [class.space-x-2]="!compact"
        [class.space-x-1]="compact"
      >
        <div
          class="bg-primary-500 rounded"
          [class.w-3]="!compact"
          [class.h-3]="!compact"
          [class.w-2]="compact"
          [class.h-2]="compact"
        ></div>
        <span
          class="text-gray-700 dark:text-gray-300"
          [class.text-sm]="!compact"
          [class.text-xs]="compact"
        >
          {{ data.primaryLabel }}:
        </span>
        <span
          class="font-medium text-gray-900 dark:text-white"
          [class.text-sm]="!compact"
          [class.text-xs]="compact"
        >
          {{ data.primaryValue }}
        </span>
        <span
          class="text-gray-500 dark:text-gray-400"
          [class.text-xs]="!compact"
          [class.text-2xs]="compact"
        >
          ({{ data.primaryPercentage }}%)
        </span>
      </div>

      <!-- Secondary value -->
      <div
        class="flex items-center"
        [class.space-x-2]="!compact"
        [class.space-x-1]="compact"
        [class.mb-2]="!compact"
        [class.mb-1]="compact"
      >
        <div
          class="bg-success-500 rounded"
          [class.w-3]="!compact"
          [class.h-3]="!compact"
          [class.w-2]="compact"
          [class.h-2]="compact"
        ></div>
        <span
          class="text-gray-700 dark:text-gray-300"
          [class.text-sm]="!compact"
          [class.text-xs]="compact"
        >
          {{ data.secondaryLabel }}:
        </span>
        <span
          class="font-medium text-gray-900 dark:text-white"
          [class.text-sm]="!compact"
          [class.text-xs]="compact"
        >
          {{ data.secondaryValue }}
        </span>
        <span
          class="text-gray-500 dark:text-gray-400"
          [class.text-xs]="!compact"
          [class.text-2xs]="compact"
        >
          ({{ data.secondaryPercentage }}%)
        </span>
      </div>

      <!-- Total -->
      <div
        class="border-t border-gray-200 dark:border-gray-600"
        [class.pt-2]="!compact"
        [class.pt-1]="compact"
      >
        <div class="flex items-center justify-between">
          <span
            class="font-medium text-gray-700 dark:text-gray-300"
            [class.text-sm]="!compact"
            [class.text-xs]="compact"
          >
            Total:
          </span>
          <span
            class="font-semibold text-gray-900 dark:text-white"
            [class.text-sm]="!compact"
            [class.text-xs]="compact"
          >
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

      .chart-tooltip.compact {
        min-width: 160px;
        margin-top: -6px;
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

      .chart-tooltip.compact::after {
        border-width: 4px;
      }

      .dark .chart-tooltip::after {
        border-top-color: rgb(31 41 55);
      }

      /* Custom smaller text class for very small text */
      .text-2xs {
        font-size: 0.625rem;
        line-height: 0.75rem;
      }
    `,
  ],
})
export class ChartTooltipComponent {
  @Input() isVisible = false;
  @Input() data: TooltipData | null = null;
  @Input() position = { x: 0, y: 0 };
  @Input() compact = false;
}
